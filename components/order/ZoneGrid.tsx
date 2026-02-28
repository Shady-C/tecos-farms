import type { DeliveryZone } from "@/types";

interface ZoneGridProps {
  zones: DeliveryZone[];
  selectedZone: string;
  landmark: string;
  onZoneChange: (zone: string) => void;
  onLandmarkChange: (landmark: string) => void;
}

export default function ZoneGrid({
  zones,
  selectedZone,
  landmark,
  onZoneChange,
  onLandmarkChange,
}: ZoneGridProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="grid grid-cols-2 gap-2 p-3.5">
        {zones.map((zone) => {
          const isSelected = selectedZone === zone.name;
          return (
            <button
              key={zone.name}
              type="button"
              onClick={() => onZoneChange(zone.name)}
              className="text-left rounded-xl p-3 transition-all"
              style={{
                border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                background: isSelected ? "var(--accent-bg)" : "var(--surface)",
              }}
            >
              <div className="text-lg mb-1">{zone.icon}</div>
              <div
                className="text-sm font-semibold"
                style={{ color: isSelected ? "var(--accent)" : "var(--text)" }}
              >
                {zone.name}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                {zone.detail}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="px-4 pt-3.5 pb-1">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: "var(--muted)" }}
          >
            Specific Address / Landmark
          </div>
        </div>
        <input
          type="text"
          value={landmark}
          onChange={(e) => onLandmarkChange(e.target.value)}
          placeholder="e.g. Near Shoprite, opposite the mosque..."
          className="w-full bg-transparent border-none outline-none px-4 pb-4 text-base font-medium"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "var(--text)",
          }}
        />
      </div>
    </div>
  );
}
