import React, { useEffect, useState } from "react";
import { FIBER_LIBRARY, calculateScore } from "../constants/fabrics";

const MetricBar = ({ label, value, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "4px",
          color: "#8B7355",
        }}
      >
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        style={{
          height: "6px",
          width: "100%",
          backgroundColor: "#E8E0D5",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            backgroundColor: color,
            borderRadius: "999px",
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
};

export default function InsightPanel({
  selectedFiber,
  sustainabilityHighlight,
  designReasoning,
}) {
  const fiberData = FIBER_LIBRARY[selectedFiber];
  if (!fiberData) return null;

  const finalScore = calculateScore(fiberData);

  return (
    <div
      style={{
        backgroundColor: "#F5F0E8",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "20px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#7C9A7E",
              marginBottom: "4px",
            }}
          >
            Sustainability Score
          </p>
          <p
            style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "#5C4A32",
            }}
          >
            {fiberData.label}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "2.5rem",
              color: "#3D3027",
              lineHeight: 1,
            }}
          >
            {finalScore}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#8B7355" }}>/100</span>
        </div>
      </div>

      <MetricBar label="Carbon Offset" value={fiberData.carbon * 10} color="#7C9A7E" />
      <MetricBar label="Water Preservation" value={fiberData.water * 10} color="#89B4C4" />
      <MetricBar label="Ethical Sourcing" value={fiberData.ethical * 10} color="#C4A882" />

      {sustainabilityHighlight && (
        <div
          style={{
            borderLeft: "3px solid #7C9A7E",
            backgroundColor: "#EEF5EE",
            padding: "10px 14px",
            borderRadius: "0 8px 8px 0",
            margin: "16px 0",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "#5C4A32",
          }}
        >
          🌿 {sustainabilityHighlight}
        </div>
      )}

      {designReasoning && (
        <div
          style={{
            borderTop: "1px solid #E8E0D5",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8B7355",
              marginBottom: "8px",
            }}
          >
            Designer Notes
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              fontStyle: "italic",
              lineHeight: "1.7",
              color: "#5C4A32",
            }}
          >
            "{designReasoning}"
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: "16px",
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "999px",
          border: "1px solid #C4B5A0",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8B7355",
        }}
      >
        Material: {selectedFiber}
      </div>
    </div>
  );
}
