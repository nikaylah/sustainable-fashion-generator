import React, { useEffect, useState } from "react";
import { FIBER_LIBRARY, calculateScore, getFiberData } from "../constants/fabrics";
import linenImage from "../assets/swatches/linen.jpg";
import cottonImage from "../assets/swatches/cotton.jpg";
import cottonFabricImage from "../assets/swatches/cottonfabric.jpg";
import merinoImage from "../assets/swatches/Merino_Wool.jpg";
import hempImage from "../assets/swatches/hemp.jpg";
import silkImage from "../assets/swatches/MulberrySilk.jpg";
import alpacaImage from "../assets/swatches/alpacawool.jpg";
import woolImage from "../assets/swatches/wool.jpg";

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

function getFallbackHighlight(matchedFiber) {
  if (!matchedFiber?.name) return "";

  const fallbackHighlights = {
    "Organic Hemp":
      "Saves 2400 liters of water per garment compared to conventional cotton equivalent.",
    "Tencel Lyocell":
      "Made in a closed-loop process that reuses 99% of the solvent system.",
    "Recycled Polyester":
      "Gives existing plastic waste a second life instead of demanding virgin petroleum.",
    "Deadstock Silk":
      "Uses existing luxury surplus so no new silk yardage needs to be produced.",
    "Conventional Cotton":
      "Acts as a baseline material, making lower-impact alternatives easier to compare.",
  };

  return fallbackHighlights[matchedFiber.name] || matchedFiber.description || "";
}

function getFabricImage(name = "") {
  const label = name.toLowerCase();

  if (label.includes("linen")) return linenImage;
  if (label.includes("cotton")) return cottonImage;
  if (label.includes("wool") || label.includes("merino")) return merinoImage;
  if (label.includes("hemp")) return hempImage;
  if (label.includes("silk")) return silkImage;
  if (label.includes("alpaca")) return alpacaImage;
  if (label.includes("bamboo") || label.includes("tencel") || label.includes("lyocell")) {
    return cottonFabricImage;
  }

  return woolImage;
}

export default function InsightPanel({
  selectedFiber,
  primaryFabricTag,
  fallbackFiber,
  fabrics,
  sustainabilityHighlight,
  designReasoning,
}) {
  const exactFiberData = selectedFiber ? FIBER_LIBRARY[selectedFiber] : null;

  const derivedFromFabrics = Array.isArray(fabrics)
    ? fabrics
        .map((fabric) => getFiberData(fabric?.name || ""))
        .find(Boolean)
    : null;

  const fallbackFiberData =
    (primaryFabricTag && FIBER_LIBRARY[primaryFabricTag]
      ? { ...FIBER_LIBRARY[primaryFabricTag], name: primaryFabricTag }
      : null) ||
    (primaryFabricTag ? getFiberData(primaryFabricTag) : null) ||
    (selectedFiber ? getFiberData(selectedFiber) : null) ||
    (fallbackFiber && FIBER_LIBRARY[fallbackFiber]
      ? { ...FIBER_LIBRARY[fallbackFiber], name: fallbackFiber }
      : null) ||
    (fallbackFiber ? getFiberData(fallbackFiber) : null) ||
    derivedFromFabrics;

  const matchedFiber = exactFiberData
    ? { ...exactFiberData, name: selectedFiber }
    : fallbackFiberData;

  if (!matchedFiber) return null;

  const finalScore = calculateScore(matchedFiber);
  const resolvedHighlight = sustainabilityHighlight || getFallbackHighlight(matchedFiber);

  return (
    <>
      <div
        className="grid gap-3 md:hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          marginBottom: "16px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fcfaf7",
            borderRadius: "1.5rem",
            padding: "20px",
            border: "1px solid rgba(15,30,63,0.06)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "8px",
            }}
          >
            Impact
          </span>
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#3D3027",
              lineHeight: 1,
            }}
          >
            {finalScore}
          </span>
          <span style={{ fontSize: "0.6rem", opacity: 0.4, marginTop: "4px" }}>out of 100</span>
        </div>

        <div
          style={{
            backgroundColor: "#fcfaf7",
            borderRadius: "1.5rem",
            padding: "20px",
            border: "1px solid rgba(15,30,63,0.06)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "1",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: "8px",
            }}
          >
            Foundation
          </span>
          <img
            src={getFabricImage(matchedFiber.name)}
            alt={matchedFiber.name}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "8px",
            }}
          />
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.3,
              color: "#5C4A32",
            }}
          >
            {matchedFiber.name}
          </span>
        </div>
      </div>

      <div
        className="inner-card-surface"
        style={{
          backgroundColor: "#F5F0E8",
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
            {matchedFiber.label}
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

      <MetricBar label="Carbon Offset" value={matchedFiber.carbon * 10} color="#7C9A7E" />
      <MetricBar
        label="Water Preservation"
        value={matchedFiber.water * 10}
        color="#89B4C4"
      />
      <MetricBar
        label="Ethical Sourcing"
        value={matchedFiber.ethical * 10}
        color="#C4A882"
      />

      {resolvedHighlight && (
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
          🌿 {resolvedHighlight}
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
        Material: {matchedFiber.name}
      </div>
      </div>
    </>
  );
}
