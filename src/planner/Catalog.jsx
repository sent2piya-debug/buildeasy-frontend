import React from "react";

export default function Catalog({ presets, onAdd }) {
  return (
    <div className="catalog">
      <h3>Catalog</h3>
      {["Base", "Wall", "Appliance"].map((group) => (
        <div key={group}>
          <h4>{group}</h4>
          {presets
            .filter((p) => p.group === group)
            .map((p) => (
              <button
                key={p.type}
                onClick={() => onAdd(p)}
                style={{ display: "block", margin: "5px 0" }}
              >
                {p.label} {/* 👈 Always show label with size */}
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
