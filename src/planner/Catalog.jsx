import React from "react";

const CATS = [
  { title: "Base", items: [
    { type: "base-60", w: 60, d: 60, h: 90, label: "Base 60" },
    { type: "base-80", w: 80, d: 60, h: 90, label: "Base 80" },
    { type: "sink-80", w: 80, d: 60, h: 90, label: "Sink 80" },
  ]},
  { title: "Wall", items: [
    { type: "wall-60", w: 60, d: 35, h: 72, label: "Wall 60" },
    { type: "wall-80", w: 80, d: 35, h: 72, label: "Wall 80" },
  ]},
  { title: "Appliances", items: [
    { type: "stove-60", w: 60, d: 60, h: 90, label: "Stove 60" },
    { type: "fridge-90", w: 90, d: 70, h: 200, label: "Fridge 90" },
  ]},
];

export default function Catalog({ onAdd }) {
  return (
    <aside style={{ width: 260, borderRight: "1px solid #eee", padding: 12, overflowY: "auto" }}>
      <h3 style={{ margin: "6px 0 12px" }}>Catalog</h3>
      {CATS.map(cat => (
        <div key={cat.title} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{cat.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {cat.items.map(it => (
              <button key={it.type}
                onClick={() => onAdd(it)}
                style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 12 }}>{it.label}</div>
                <div style={{ color: "#666", fontSize: 11 }}>{it.w}×{it.d} cm</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
