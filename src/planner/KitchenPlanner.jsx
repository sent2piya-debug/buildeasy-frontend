import React, { useMemo, useRef, useState, useEffect } from "react";

// ===== Helpers =====
const cmToPxScale = 2;         // 1 cm = 2 px  (60cm cabinet => 120px)
const gridStepCm = 10;         // snap every 10 cm
const snapPx = gridStepCm * cmToPxScale;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const uid = () => Math.random().toString(36).slice(2, 9);

const PRESETS = [
  { group: "Base", type: "base-60", w: 60, d: 60, h: 90, label: "Base 60" },
  { group: "Base", type: "base-80", w: 80, d: 60, h: 90, label: "Base 80" },
  { group: "Wall", type: "wall-60", w: 60, d: 35, h: 72, label: "Wall 60" },
  { group: "Wall", type: "wall-80", w: 80, d: 35, h: 72, label: "Wall 80" },
  { group: "Appliance", type: "sink-80", w: 80, d: 60, h: 90, label: "Sink 80" },
  { group: "Appliance", type: "stove-60", w: 60, d: 60, h: 90, label: "Stove 60" },
  { group: "Appliance", type: "fridge-90", w: 90, d: 70, h: 200, label: "Fridge 90" },
];

const colorFor = (type) => {
  if (type.startsWith("base")) return "#e1f0ff";
  if (type.startsWith("wall")) return "#fff3d6";
  if (type.startsWith("sink")) return "#d6fff2";
  if (type.startsWith("stove")) return "#ffe1e1";
  if (type.startsWith("fridge")) return "#eee";
  return "#ddd";
};

// ===== Main =====
export default function KitchenPlanner() {
  // Room size in cm (inside dimensions viewed from top)
  const [room, setRoom] = useState({ w: 360, d: 300 }); // default 3.6m x 3.0m
  const [items, setItems] = useState([]);               // placed items
  const [selId, setSelId] = useState(null);

  // drag state
  const dragRef = useRef(null); // {id, startX, startY, origX, origY}

  // Load saved scene on first mount
  useEffect(() => {
    const raw = localStorage.getItem("be_planner_v1");
    if (raw) {
      try {
        const { room, items } = JSON.parse(raw);
        if (room && items) { setRoom(room); setItems(items); }
      } catch {}
    }
  }, []);

  // bounds in px
  const roomPx = useMemo(() => ({
    w: room.w * cmToPxScale,
    d: room.d * cmToPxScale
  }), [room]);

  const addPreset = (p) => {
    const it = {
      id: uid(),
      type: p.type,
      x: snapPx,                  // px position (top-left)
      y: snapPx,
      w: p.w,                     // in cm (we’ll convert to px for drawing)
      d: p.d,
      rot: 0                      // 0 or 90 deg
    };
    setItems((arr) => [...arr, it]);
    setSelId(it.id);
  };

  const removeSelected = () => {
    if (!selId) return;
    setItems((arr) => arr.filter((i) => i.id !== selId));
    setSelId(null);
  };

  const rotateSelected = () => {
    setItems((arr) =>
      arr.map((i) =>
        i.id === selId ? { ...i, rot: i.rot === 0 ? 90 : 0 } : i
      )
    );
  };

  const onMouseDownItem = (e, id) => {
    e.stopPropagation();
    setSelId(id);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: items.find((i) => i.id === id).x,
      origY: items.find((i) => i.id === id).y,
      containerLeft: rect.left,
      containerTop: rect.top,
    };
  };

  const onMouseMoveCanvas = (e) => {
    if (!dragRef.current) return;
    const { id, startX, startY, origX, origY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setItems((arr) =>
      arr.map((i) => {
        if (i.id !== id) return i;

        const sizePx = dimsPx(i);
        // new position (px)
        let nx = origX + dx;
        let ny = origY + dy;

        // snap to grid
        nx = Math.round(nx / snapPx) * snapPx;
        ny = Math.round(ny / snapPx) * snapPx;

        // keep inside room
        nx = clamp(nx, 0, roomPx.w - sizePx.w);
        ny = clamp(ny, 0, roomPx.d - sizePx.d);

        return { ...i, x: nx, y: ny };
      })
    );
  };

  const onMouseUpCanvas = () => (dragRef.current = null);

  const dimsPx = (i) => {
    const wCm = i.rot === 0 ? i.w : i.d;
    const dCm = i.rot === 0 ? i.d : i.w;
    return { w: wCm * cmToPxScale, d: dCm * cmToPxScale };
  };

  const saveLocal = () => {
    localStorage.setItem(
      "be_planner_v1",
      JSON.stringify({ room, items })
    );
    alert("Saved to this browser ✔");
  };

  const loadLocal = () => {
    const raw = localStorage.getItem("be_planner_v1");
    if (!raw) return alert("Nothing saved yet.");
    const { room: r, items: its } = JSON.parse(raw);
    setRoom(r); setItems(its); setSelId(null);
  };

  const exportJSON = () => {
    const payload = JSON.stringify({ room, items }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "kitchen-plan.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.room && data?.items) {
          setRoom(data.room);
          setItems(data.items);
          setSelId(null);
        } else {
          alert("Invalid file.");
        }
      } catch {
        alert("Invalid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const selected = items.find((i) => i.id === selId) || null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 300px", height: "100%" }}>
      {/* Palette */}
      <aside style={{ borderRight: "1px solid #eee", padding: 12, overflow: "auto" }}>
        <h2 style={{ margin: "8px 0" }}>Palette</h2>
        {["Base", "Wall", "Appliance"].map((g) => (
          <div key={g} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, opacity: 0.7 }}>{g}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
              {PRESETS.filter((p) => p.group === g).map((p) => (
                <button
                  key={p.type}
                  onClick={() => addPreset(p)}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                  title={`${p.label} (${p.w}×${p.d}cm)`}
                >
                  <div style={{ fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{p.w}×{p.d} cm</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <h2 style={{ margin: "16px 0 8px" }}>Room</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <label>Width (cm)
            <input type="number" value={room.w}
              onChange={(e)=> setRoom(r => ({...r, w: Math.max(120, Number(e.target.value||0))}))}
              style={{ width: "100%" }} />
          </label>
          <label>Depth (cm)
            <input type="number" value={room.d}
              onChange={(e)=> setRoom(r => ({...r, d: Math.max(120, Number(e.target.value||0))}))}
              style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
          <button onClick={saveLocal}>💾 Save (browser)</button>
          <button onClick={loadLocal}>↩️ Load (browser)</button>
          <button onClick={exportJSON}>⬇️ Export JSON</button>
          <label style={{ display: "inline-block" }}>
            ⬆️ Import JSON
            <input type="file" accept="application/json" onChange={importJSON} style={{ display: "block" }} />
          </label>
          <button onClick={() => { setItems([]); setSelId(null); }}>🧹 Clear All</button>
        </div>

        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Grid: {gridStepCm}cm • Scale: 1cm = {cmToPxScale}px
        </p>
      </aside>

      {/* Canvas */}
      <main
        onMouseMove={onMouseMoveCanvas}
        onMouseUp={onMouseUpCanvas}
        onMouseLeave={onMouseUpCanvas}
        onMouseDown={() => setSelId(null)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7"
        }}
      >
        <div
          style={{
            width: roomPx.w,
            height: roomPx.d,
            background:
              `repeating-linear-gradient(0deg, #eee 0, #eee 1px, transparent 1px, transparent ${snapPx}px),
               repeating-linear-gradient(90deg, #eee 0, #eee 1px, transparent 1px, transparent ${snapPx}px)`,
            position: "relative",
            boxShadow: "inset 0 0 0 2px #999",
            backgroundColor: "#fff"
          }}
        >
          {items.map((i) => {
            const size = dimsPx(i);
            return (
              <div
                key={i.id}
                onMouseDown={(e) => onMouseDownItem(e, i.id)}
                style={{
                  position: "absolute",
                  left: i.x,
                  top: i.y,
                  width: size.w,
                  height: size.d,
                  background: colorFor(i.type),
                  border: i.id === selId ? "2px solid #0070f3" : "1px solid #bbb",
                  borderRadius: 8,
                  boxSizing: "border-box",
                  cursor: "move",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  fontSize: 12,
                  fontWeight: 700
                }}
                title={`${i.type} • ${i.w}×${i.d}cm • rot ${i.rot}°`}
              >
                {i.type.replace("-", " ")}
              </div>
            );
          })}
        </div>
      </main>

      {/* Inspector */}
      <aside style={{ borderLeft: "1px solid #eee", padding: 12, overflow: "auto" }}>
        <h2 style={{ margin: "8px 0" }}>Inspector</h2>
        {!selected && <div style={{ opacity: 0.7 }}>Select an item on the canvas.</div>}
        {selected && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{selected.type}</div>
            <label>X (snap) px
              <input
                type="number"
                value={selected.x}
                onChange={(e) => {
                  const v = Math.round(Number(e.target.value || 0) / snapPx) * snapPx;
                  setItems(arr => arr.map(it => it.id === selected.id ? { ...it, x: clamp(v, 0, roomPx.w - dimsPx(it).w) } : it));
                }}
                style={{ width: "100%" }}
              />
            </label>
            <label>Y (snap) px
              <input
                type="number"
                value={selected.y}
                onChange={(e) => {
                  const v = Math.round(Number(e.target.value || 0) / snapPx) * snapPx;
                  setItems(arr => arr.map(it => it.id === selected.id ? { ...it, y: clamp(v, 0, roomPx.d - dimsPx(it).d) } : it));
                }}
                style={{ width: "100%" }}
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <label>Width (cm)
                <input
                  type="number"
                  value={selected.w}
                  onChange={(e) => {
                    const v = Math.max(20, Number(e.target.value || 0));
                    setItems(arr => arr.map(it => it.id === selected.id ? { ...it, w: v } : it));
                  }}
                  style={{ width: "100%" }}
                />
              </label>
              <label>Depth (cm)
                <input
                  type="number"
                  value={selected.d}
                  onChange={(e) => {
                    const v = Math.max(20, Number(e.target.value || 0));
                    setItems(arr => arr.map(it => it.id === selected.id ? { ...it, d: v } : it));
                  }}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={rotateSelected}>↻ Rotate 90°</button>
              <button onClick={removeSelected} style={{ color: "#b00020" }}>🗑 Remove</button>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Tip: drag items; they snap every {gridStepCm}cm.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
