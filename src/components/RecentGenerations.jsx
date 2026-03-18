import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RecentGenerations({ refreshKey = 0 }) {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch("/api/recent")
      .then((response) => response.json())
      .then((data) => {
        setGenerations(data.generations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  if (loading || generations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        marginTop: "48px",
        paddingTop: "32px",
        borderTop: "1px solid rgba(15,30,63,0.06)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#7C9A7E",
            marginBottom: "8px",
          }}
        >
          ✦ recently designed
        </p>
        <p
          style={{
            fontFamily: "'Give You Glory', cursive",
            fontSize: "1.8rem",
            color: "#5C4A32",
          }}
        >
          from the community
        </p>
      </div>

      <div
        className="fiber-scroll"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {generations.map((gen, i) => (
          <motion.div
            key={`${gen.outfitName}-${gen.timestamp}-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            style={{
              minWidth: "160px",
              maxWidth: "160px",
              flexShrink: 0,
              scrollSnapAlign: "start",
              backgroundColor: "#FAF7F2",
              borderRadius: "1.5rem",
              padding: "16px",
              border: "1px solid rgba(15,30,63,0.06)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
              {(gen.colorPalette || []).map((color, j) => (
                <div
                  key={`${color.hex}-${j}`}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                color: "#3D3027",
                lineHeight: 1.3,
                marginBottom: "8px",
              }}
            >
              {gen.outfitName}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#7C9A7E",
                }}
              >
                {gen.fiber}
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8B7355",
                  opacity: 0.7,
                }}
              >
                {gen.styleVibe}
              </span>
            </div>

            <p
              style={{
                fontSize: "0.55rem",
                color: "#8B7355",
                opacity: 0.5,
                marginTop: "8px",
              }}
            >
              {getTimeAgo(gen.timestamp)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
