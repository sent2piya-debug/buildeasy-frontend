import React, { useMemo, useRef, useState, useEffect } from "react";

// ===== Settings
const cmToPxScale = 2;        // 1 cm = 2 px  (60cm cabinet => 120px)
const gridStepCm  = 10;       // snap to 10 cm
const snapPx      = gridStepCm * cmToPxScale;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const uid   = () => Math.random().toString(36).slice(2, 9);

// Preset library (width w, depth d, height h are in CM)
const PRESETS = [
  { group: "Base",       type: "base-60",   w: 60,  d: 60,  h: 90,  label: "Base 60" },
  { group: "Base",       type: "base-80",   w: 80,  d: 60,  h: 90,  label: "Base 80" },
  { group: "Wall",       type: "wall-80",   w: 80,  d: 35,  h: 72,  label: "Wall 80" },
  { group: "Appliance",  type: "sink-80",   w: 80,  d: 60,  h: 90,  label: "Sink 80" },
  { group: "Appliance",  type: "stove-60",  w: 60,  d: 60,  h: 90,  label: "Stove 60" },
  { group: "Appliance",  type: "fridge-90", w: 90,  d: 70,  h: 200, label: "Fridge 90" },
];

const colorFor = (t) => {
  if (t.startsWith("base"))      return "#e1f0ff";
  if (t.startsWith("wall"))      return "#fff3d6";
  if (t.startsWith("sink"))      return "#d6f6ff";
  if (t.startsWith("stove"))     return "#ffe4e1";
  if (t.startsWith("fridge"))    return "#eeeeee";
  return "#ddd";
};

// ======= Component
export default function KitchenPlanner() {
  // Room size in CM (inside, top-down)
  const [room, setRoom]   = useState({ w: 360, d: 300 }); // default 3.6m x 3.0m
  const [items, setItems] = useState([]);                 // placed items
  const [selId, setSelId] = useState(null);               // selected item id
  const [tool, setTool]   = useState(null);               // preset “about to place”

  const canvasRef = useRef(null);
  const [pan, setPan]     = useState({ x: 40, y: 40 });   // px offset
  const [zoom, setZoom]   = useState(1);                  // not exposed yet (kept for future)

  // Load/save local draft
  useEffect(() => {
    const draft = localStorage.getItem("planner_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.room && parsed.items) {
          setRoom(parsed.room);
          setItems(parsed.items);
        }
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("planner_draft", JSON.stringify({ room, items }));
  }, [room, items]);

  const roomPx = useMemo(
    () => ({ w: Math.round(room.w * cmToPxScale), d: Math.round(room.d * cmToPxScale) }),
    [room]
  );

  // ---- Helpers
  const snap = (v) => Math.round(v / snapPx) * snapPx;

  const addFromPreset = (preset) => {
    // place near top-left (inside room) by default
    const newItem = {
      id: uid(),
      type: preset.type,
      label: preset.label,
      x: snap(10 * cmToPxScale),
      y: snap(10 * cmToPxScale),
      w: preset.w,
      d: preset.d,
      rot: 0, // 0 or 90 (we’ll keep it simple)
    };
    setItems((prev) => [...prev, newItem]);
    setSelId(newItem.id);
    setTool(null);
  };

  const removeSelected = () => {
    if (!selId) return;
    setItems((prev) => prev.filter((it) => it.id !== selId));
    setSelId(null);
  };

  const resetAll = () => {
    setItems([]);
    setSelId(null);
  };

  const rotateSelected = () => {
    setItems((prev) =>
      prev.map((it) =>
        it.id !== selId
          ? it
          : { ...it, rot: it.rot === 0 ? 90 : 0 }
      )
    );
  };

  // ---- Mouse interactions on canvas
  const [drag, setDrag] = useState(null); // {id, dx, dy, kind: "move"|"resize"}

  const hitTest = (mx, my) => {
    // hit test items from top (last) to bottom
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const { x, y } = it;
      const [wPx, dPx] = (it.rot === 0)
        ? [it.w * cmToPxScale, it.d * cmToPxScale]
        : [it.d * cmToPxScale, it.w * cmToPxScale];

      // resize handle (bottom-right 16x16)
      if (mx >= x + wPx - 16 && mx <= x + wPx && my >= y + dPx - 16 && my <= y + dPx) {
        return { id: it.id, kind: "resize" };
      }
      if (mx >= x && mx <= x + wPx && my >= y && my <= y + dPx) {
        return { id: it.id, kind: "move" };
      }
    }
    return null;
  };

  const onMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pan.x) / zoom;
    const my = (e.clientY - rect.top - pan.y) / zoom;

    // Placing a tool: create immediately
    if (tool) {
      addFromPreset(tool);
      return;
    }

    const hit = hitTest(mx, my);
    if (hit) {
      setSelId(hit.id);
      setDrag({ id: hit.id, ox: mx, oy: my, kind: hit.kind });
    } else {
      setSelId(null);
    }
  };

  const onMouseMove = (e) => {
    if (!drag) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pan.x) / zoom;
    const my = (e.clientY - rect.top - pan.y) / zoom;

    const dx = mx - drag.ox;
    const dy = my - drag.oy;
    setDrag((d) => ({ ...d, dx, dy }));
  };

  const onMouseUp = () => {
    if (!drag) return;
    const { id, dx = 0, dy = 0, kind } = drag;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;

        const [wPx0, dPx0] = (it.rot === 0)
          ? [it.w * cmToPxScale, it.d * cmToPxScale]
          : [it.d * cmToPxScale, it.w * cmToPxScale];

        if (kind === "move") {
          // move + snap + clamp inside room
          let nx = snap(it.x + dx);
          let ny = snap(it.y + dy);
          nx = clamp(nx, 0, roomPx.w - wPx0);
          ny = clamp(ny, 0, roomPx.d - dPx0);
          return { ...it, x: nx, y: ny };
        } else {
          // resize along width & depth of current rotation (simple proportional)
          let wPx = snap(wPx0 + dx);
          let dPx = snap(dPx0 + dy);
          wPx = clamp(wPx, 20, roomPx.w - it.x);
          dPx = clamp(dPx, 20, roomPx.d - it.y);

          // convert back to CM according to current rotation
          if (it.rot === 0) {
            return { ...it, w: Math.round(wPx / cmToPxScale), d: Math.round(dPx / cmToPxScale) };
          } else {
            return { ...it, w: Math.round(dPx / cmToPxScale), d: Math.round(wPx / cmToPxScale) };
          }
        }
      })
    );
    setDrag(null);
  };

  // Keyboard helpers
  useEffect(() => {
    const onKey = (e) => {
      if (!selId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        removeSelected();
      }
      if (e.key.toLowerCase() === "r") {
        rotateSelected();
      }
      const delta = e.shiftKey ? snapPx : cmToPxScale * 5; // nudge
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== selId) return it;
            let nx = it.x, ny = it.y;
            if (e.key === "ArrowLeft") nx = clamp(it.x - delta, 0, roomPx.w - it.w * cmToPxScale);
            if (e.key === "ArrowRight") nx = clamp(it.x + delta, 0, roomPx.w - it.w * cmToPxScale);
            if (e.key === "ArrowUp") ny = clamp(it.y - delta, 0, roomPx.d - it.d * cmToPxScale);
            if (e.key === "ArrowDown") ny = clamp(it.y + delta, 0, roomPx.d - it.d * cmToPxScale);
            return { ...it, x: snap(nx), y: snap(ny) };
          })
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selId, roomPx.w, roomPx.d]);

  // Export / Import
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ room, items }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "kitchen-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.room && data.items) {
          setRoom(data.room);
          setItems(data.items);
          setSelId(null);
        } else {
          alert("Invalid file.");
        }
      } catch {
        alert("Invalid file.");
      }
    };
    reader.readAsText(file);
  };

  // ===== Render
  return (
    <div className="planner-wrap">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="group">
          <strong>Add</strong>
          {PRESETS.map((p) => (
            <button
              key={p.type}
              className={tool?.type === p.type ? "active" : ""}
              onClick={() => setTool(p)}
              title={`${p.label} (${p.w}x${p.d}cm)`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="group">
          <strong>Room (cm)</strong>
          <label>W
            <input
              type="number"
              value={room.w}
              onChange={(e) => setRoom((r) => ({ ...r, w: Number(e.target.value || 0) }))}
              min={100}
            />
          </label>
          <label>D
            <input
              type="number"
              value={room.d}
              onChange={(e) => setRoom((r) => ({ ...r, d: Number(e.target.value || 0) }))}
              min={100}
            />
          </label>
          <button onClick={resetAll}>Reset</button>
        </div>

        <div className="group">
          <button onClick={rotateSelected} disabled={!selId}>Rotate (R)</button>
          <button onClick={removeSelected} disabled={!selId}>Delete (Del)</button>
        </div>

        <div className="group">
          <button onClick={exportJSON}>Export</button>
          <label className="importBtn">
            Import
            <input type="file" accept="application/json" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJSON(f);
              e.target.value = "";
            }} />
          </label>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="canvas"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div
          className="room"
          style={{
            width:  roomPx.w,
            height: roomPx.d,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top left"
          }}
        >
          {/* grid */}
          <Grid w={roomPx.w} d={roomPx.d} />

          {/* items */}
          {items.map((it) => (
            <Item
              key={it.id}
              it={it}
              selected={it.id === selId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ======= Presentational subcomponents
function Grid({ w, d }) {
  const bgSize = snapPx;
  const style = {
    backgroundSize: `${bgSize}px ${bgSize}px`,
    backgroundImage:
      `linear-gradient(to right, #eee 1px, transparent 1px),` +
      `linear-gradient(to bottom, #eee 1px, transparent 1px)`,
  };
  return <div className="grid" style={{ ...style, width: w, height: d }} />;
}

function Item({ it, selected }) {
  const [wPx, dPx] = (it.rot === 0)
    ? [it.w * cmToPxScale, it.d * cmToPxScale]
    : [it.d * cmToPxScale, it.w * cmToPxScale];

  return (
    <div
      className={`item ${selected ? "selected" : ""}`}
      style={{
        transform: `translate(${it.x}px, ${it.y}px)`,
        width: wPx,
        height: dPx,
        background: colorFor(it.type),
      }}
    >
      <div className="item-label">{it.label}</div>
      <div className="resize-handle" />
    </div>
  );
}

          
