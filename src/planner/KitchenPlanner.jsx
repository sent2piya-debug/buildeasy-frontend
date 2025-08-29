// src/planner/KitchenPlanner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===== Config ===== */
const CM_TO_PX = 2;            // 1 cm = 2 px  (60 cm cabinet => 120 px)
const GRID_STEP_CM = 10;       // snap every 10 cm
const SNAP = GRID_STEP_CM * CM_TO_PX;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const uid = () => Math.random().toString(36).slice(2, 9);

/* Simple catalog (feel free to expand) */
const PRESETS = [
  { group: "Base",      type: "base-60",   w: 60,  d: 60,  h: 90,  label: "Base 60" },
  { group: "Base",      type: "base-80",   w: 80,  d: 60,  h: 90,  label: "Base 80" },
  { group: "Wall",      type: "wall-80",   w: 80,  d: 35,  h: 72,  label: "Wall 80" },
  { group: "Appliance", type: "sink-80",   w: 80,  d: 60,  h: 90,  label: "Sink 80" },
  { group: "Appliance", type: "stove-60",  w: 60,  d: 60,  h: 90,  label: "Stove 60" },
  { group: "Appliance", type: "fridge-90", w: 90,  d: 70,  h: 200, label: "Fridge 90" },
];

const colorFor = (type) => {
  if (type.startsWith("base")) return "#e1f0ff";
  if (type.startsWith("wall")) return "#fff3d6";
  if (type.startsWith("sink")) return "#d6f0ff";
  if (type.startsWith("stove")) return "#ffe1e1";
  if (type.startsWith("fridge")) return "#eee";
  return "#ddd";
};

/* ===== Catalog (left pane) ===== */
function Catalog({ onAdd }) {
  const groups = Array.from(new Set(PRESETS.map(p => p.group)));
  return (
    <div style={{ width: 240, borderRight: "1px solid #eee", padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Catalog</div>
      {groups.map((g) => (
        <div key={g} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>{g}</div>
          {PRESETS.filter(p => p.group === g).map(p => (
            <button
              key={p.type}
              onClick={() => onAdd(p)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                marginBottom: 6,
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {p.w}×{p.d} cm
              </div>
            </button>
          ))}
        </div>
      ))}
      <div style={{ fontSize: 12, marginTop: 16, opacity: 0.7 }}>
        Tip: After adding, use mouse to drag.  
        Keys: <b>R</b> rotate, <b>Del</b> delete, <b>Ctrl+D</b> duplicate, arrows move.
      </div>
    </div>
  );
}

/* ===== Main Planner ===== */
export default function KitchenPlanner() {
  // room size (inside dimensions, centimeters)
  const [room, setRoom] = useState({ w: 360, d: 300 }); // default 3.6 m x 3.0 m
  // placed items
  const [items, setItems] = useState([]);
  // selected item id
  const [selId, setSelId] = useState(null);

  // canvas refs
  const wrapRef = useRef(null);

  // load/save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("planner:state");
    if (saved) {
      try {
        const { room: r, items: it } = JSON.parse(saved);
        if (r) setRoom(r);
        if (it) setItems(it);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("planner:state", JSON.stringify({ room, items }));
  }, [room, items]);

  // add from catalog
  const handleAdd = (preset) => {
    const id = uid();
    const x = 20 * CM_TO_PX;
    const y = 20 * CM_TO_PX;
    setItems(prev => [
      ...prev,
      { id, ...preset, x, y, r: 0, group: preset.type.startsWith("wall") ? "wall" : "base" }
    ]);
    setSelId(id);
  };

  const sel = useMemo(
    () => items.find(it => it.id === selId) || null,
    [items, selId]
  );

  /* --- pointer interaction for dragging --- */
  const dragInfo = useRef(null);
  const onPointerDown = (e, id) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const it = items.find(i => i.id === id);
    dragInfo.current = { id, ox: x - it.x, oy: y - it.y };
    setSelId(id);
    (e.target).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragInfo.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = Math.round((x - dragInfo.current.ox) / SNAP) * SNAP;
    const ny = Math.round((y - dragInfo.current.oy) / SNAP) * SNAP;

    setItems(prev =>
      prev.map(it =>
        it.id !== dragInfo.current.id
          ? it
          : {
              ...it,
              x: clamp(nx, 0, room.w * CM_TO_PX - it.w * CM_TO_PX),
              y: clamp(ny, 0, room.d * CM_TO_PX - it.d * CM_TO_PX),
            }
      )
    );
  };
  const onPointerUp = () => (dragInfo.current = null);

  /* --- keyboard shortcuts --- */
  useEffect(() => {
    const onKey = (e) => {
      if (!selId) return;
      const idx = items.findIndex(i => i.id === selId);
      if (idx < 0) return;

      // duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const clone = { ...items[idx], id: uid(), x: items[idx].x + SNAP, y: items[idx].y };
        setItems(prev => [...prev, clone]);
        setSelId(clone.id);
        return;
      }

      // rotate
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        setItems(prev =>
          prev.map((it, i) => (i === idx ? { ...it, r: (it.r + 90) % 360 } : it))
        );
        return;
      }

      // delete
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setItems(prev => prev.filter((it, i) => i !== idx));
        setSelId(null);
        return;
      }

      // nudge with arrows
      const move = (dx, dy) => {
        setItems(prev =>
          prev.map((it, i) =>
            i !== idx
              ? it
              : {
                  ...it,
                  x: clamp(it.x + dx, 0, room.w * CM_TO_PX - it.w * CM_TO_PX),
                  y: clamp(it.y + dy, 0, room.d * CM_TO_PX - it.d * CM_TO_PX),
                }
          )
        );
      };
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-SNAP, 0); }
      if (e.key === "ArrowRight") { e.preventDefault(); move(SNAP, 0); }
      if (e.key === "ArrowUp") { e.preventDefault(); move(0, -SNAP); }
      if (e.key === "ArrowDown") { e.preventDefault(); move(0, SNAP); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, selId, room]);

  /* --- helpers to render grid & rulers --- */
  const gridStyle = {
    backgroundImage: `
      linear-gradient(to right, #f2f2f2 1px, transparent 1px),
      linear-gradient(to bottom, #f2f2f2 1px, transparent 1px)
    `,
    backgroundSize: `${SNAP}px ${SNAP}px`,
  };

  /* --- UI --- */
  return (
    <div style={{ height: "calc(100vh - 80px)", display: "flex" }}>
      <Catalog onAdd={handleAdd} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 10, borderBottom: "1px solid #eee" }}>
          <b>Kitchen Planner</b>
          <div style={{ marginLeft: 16, fontSize: 13, opacity: 0.75 }}>
            Room size (cm):
          </div>
          <label style={{ fontSize: 13 }}>
            W:&nbsp;
            <input
              type="number"
              value={room.w}
              min={100}
              max={1000}
              onChange={e => setRoom(r => ({ ...r, w: Number(e.target.value || 0) }))}
              style={{ width: 80 }}
            />
          </label>
          <label style={{ fontSize: 13 }}>
            D:&nbsp;
            <input
              type="number"
              value={room.d}
              min={100}
              max={1000}
              onChange={e => setRoom(r => ({ ...r, d: Number(e.target.value || 0) }))}
              style={{ width: 80 }}
            />
          </label>
          <button
            onClick={() => { setItems([]); setSelId(null); }}
            style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
          >
            Clear Room
          </button>
        </div>

        {/* Canvas */}
        <div style={{ padding: 14, overflow: "auto" }}>
          <div
            ref={wrapRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              position: "relative",
              width: room.w * CM_TO_PX,
              height: room.d * CM_TO_PX,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              ...gridStyle,
              margin: "0 auto"
            }}
          >
            {/* items */}
            {items.map(it => {
              const W = it.r % 180 === 0 ? it.w * CM_TO_PX : it.d * CM_TO_PX;
              const H = it.r % 180 === 0 ? it.d * CM_TO_PX : it.w * CM_TO_PX;
              return (
                <div
                  key={it.id}
                  onPointerDown={(e) => onPointerDown(e, it.id)}
                  onDoubleClick={() => setSelId(it.id)}
                  style={{
                    position: "absolute",
                    left: it.x,
                    top: it.y,
                    width: W,
                    height: H,
                    transform: `rotate(${it.r}deg)`,
                    transformOrigin: "top left",
                    background: colorFor(it.type),
                    border: selId === it.id ? "2px solid #2b90ff" : "1px solid #bbb",
                    borderRadius: 6,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                    cursor: "grab",
                    userSelect: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {it.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection inspector */}
        <div style={{ borderTop: "1px solid #eee", padding: 10, fontSize: 13 }}>
          {sel ? (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div><b>Selected:</b> {sel.label}</div>
              <div>
                X:&nbsp;
                <input
                  type="number"
                  value={sel.x}
                  onChange={e => {
                    const v = Math.round(Number(e.target.value || 0) / SNAP) * SNAP;
                    setItems(prev => prev.map(it => it.id === sel.id ? { ...it, x: clamp(v, 0, room.w * CM_TO_PX - it.w * CM_TO_PX) } : it));
                  }}
                  style={{ width: 80 }}
                />
              </div>
              <div>
                Y:&nbsp;
                <input
                  type="number"
                  value={sel.y}
                  onChange={e => {
                    const v = Math.round(Number(e.target.value || 0) / SNAP) * SNAP;
                    setItems(prev => prev.map(it => it.id === sel.id ? { ...it, y: clamp(v, 0, room.d * CM_TO_PX - it.d * CM_TO_PX) } : it));
                  }}
                  style={{ width: 80 }}
                />
              </div>
              <div>
                Rotation:&nbsp;
                <input
                  type="number"
                  value={sel.r}
                  step={90}
                  onChange={e => {
                    const v = Number(e.target.value || 0);
                    setItems(prev => prev.map(it => it.id === sel.id ? { ...it, r: ((v % 360) + 360) % 360 } : it));
                  }}
                  style={{ width: 70 }}
                />°
              </div>
              <button
                onClick={() => setItems(prev => prev.filter(i => i.id !== sel.id))}
                style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
              >
                Delete
              </button>
            </div>
          ) : (
            <span style={{ opacity: 0.6 }}>No item selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
 
 
    

