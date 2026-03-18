export default function ShareCard({ result, selectedFiber, score, forwardRef }) {
  return (
    <div
      ref={forwardRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: "400px",
        height: "500px",
        backgroundColor: "#f8f5ec",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(255,255,255,0.5), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "serif",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#7C9A7E",
        }}
      >
        designed with intent ✦
      </p>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Give You Glory', cursive",
            fontSize: "2.2rem",
            color: "#3D3027",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          {result.outfitName}
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#8B7355",
            fontStyle: "italic",
          }}
        >
          {result.outfitDescription}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {result.colorPalette?.slice(0, 3).map((color, i) => (
          <div
            key={`${color.hex}-${i}`}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: color.hex,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "16px",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "12px",
          border: "1px solid rgba(15,30,63,0.06)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8B7355",
            }}
          >
            Material
          </p>
          <p style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#3D3027" }}>
            {selectedFiber}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8B7355",
            }}
          >
            Impact Score
          </p>
          <p
            style={{
              fontSize: "1.5rem",
              fontFamily: "Playfair Display, serif",
              color: "#3D3027",
              lineHeight: 1,
            }}
          >
            {score}
            <span style={{ fontSize: "0.65rem" }}>/100</span>
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#8B7355",
          opacity: 0.5,
        }}
      >
        sustainable-fashion-gen.vercel.app
      </p>
    </div>
  );
}
