const SILHOUETTES = {
  "midi-dress":
    "M92 50 C84 60 78 78 80 104 C82 130 88 150 92 165 C70 182 56 220 58 286 C60 332 76 356 100 360 C124 356 140 332 142 286 C144 220 130 182 108 165 C112 150 118 130 120 104 C122 78 116 60 108 50 C103 44 97 44 92 50 Z",
  "aline-blouse":
    "M80 52 C70 64 68 86 74 110 C80 132 88 142 100 144 C112 142 120 132 126 110 C132 86 130 64 120 52 C112 44 88 44 80 52 Z M86 150 C70 164 58 188 56 218 C54 254 68 282 100 292 C132 282 146 254 144 218 C142 188 130 164 114 150 C106 144 94 144 86 150 Z",
  "wide-leg-tunic":
    "M74 54 C66 62 62 84 64 118 C66 148 70 186 72 210 C60 226 52 256 50 304 C48 342 68 360 88 360 C92 360 96 356 96 350 L96 220 L104 220 L104 350 C104 356 108 360 112 360 C132 360 152 342 150 304 C148 256 140 226 128 210 C130 186 134 148 136 118 C138 84 134 62 126 54 C112 40 88 40 74 54 Z",
  "structured-coat":
    "M72 46 C60 58 54 82 56 116 C58 150 64 194 68 242 C72 292 72 332 74 360 L88 360 C88 328 88 288 88 244 L112 244 C112 288 112 328 112 360 L126 360 C128 332 128 292 132 242 C136 194 142 150 144 116 C146 82 140 58 128 46 C114 34 86 34 72 46 Z",
  asymmetric:
    "M74 54 C66 64 64 86 68 116 C72 146 80 166 92 174 L88 212 C76 220 64 242 58 280 C50 326 70 352 98 356 C124 352 146 336 146 290 C146 258 132 238 114 228 L120 176 C130 166 138 148 140 120 C142 92 136 68 126 56 C114 42 88 42 74 54 Z",
  "wrap-dress":
    "M72 52 C62 64 60 84 64 112 C68 138 78 160 92 176 L72 212 C56 242 50 286 58 328 C64 356 80 370 100 372 C120 370 136 356 142 328 C150 286 144 242 128 212 L108 176 C120 160 130 138 134 112 C138 84 136 64 126 52 C112 38 86 38 72 52 Z",
  abaya:
    "M84 44 C70 54 60 76 58 108 C56 144 62 186 68 230 C74 276 76 322 78 372 L122 372 C124 322 126 276 132 230 C138 186 144 144 142 108 C140 76 130 54 116 44 C106 36 94 36 84 44 Z",
  "layered-coat":
    "M76 48 C64 58 58 78 60 108 C62 138 68 170 72 206 C62 222 56 248 56 290 C56 336 74 360 100 364 C126 360 144 336 144 290 C144 248 138 222 128 206 C132 170 138 138 140 108 C142 78 136 58 124 48 C112 38 88 38 76 48 Z M88 176 C76 194 70 220 70 258 C70 300 82 324 100 328 C118 324 130 300 130 258 C130 220 124 194 112 176 Z",
};

function selectSilhouette(climate, styleVibe, priorities) {
  const normalizedClimate = climate?.toLowerCase?.() || "";
  const normalizedVibe = styleVibe?.toLowerCase?.() || "";
  const isModest = priorities?.includes("Modest Layering");

  if (isModest) return "abaya";
  if (normalizedVibe === "romantic" && normalizedClimate === "warm") return "midi-dress";
  if (normalizedVibe === "romantic" && normalizedClimate !== "warm") return "aline-blouse";
  if (normalizedVibe === "minimal" && normalizedClimate === "warm") return "wide-leg-tunic";
  if (normalizedVibe === "minimal" && normalizedClimate === "cold") return "structured-coat";
  if (normalizedVibe === "contemporary") return "asymmetric";
  if (normalizedVibe === "earthy") return "wrap-dress";
  return "midi-dress";
}

export default function FashionSilhouette({
  climate,
  styleVibe,
  priorities,
  primaryColor,
}) {
  const silhouetteKey = selectSilhouette(climate, styleVibe, priorities);
  const path = SILHOUETTES[silhouetteKey] || SILHOUETTES["midi-dress"];
  const accent = primaryColor || "#D4B896";

  return (
    <div className="fashion-silhouette-wrap h-[180px] w-[120px]" key={silhouetteKey}>
      <svg
        viewBox="0 0 200 400"
        className="fashion-silhouette-svg h-full w-full"
        aria-hidden="true"
      >
        <path d={path} className="silhouette-fill" style={{ fill: accent }} />
        <path
          d={path}
          className="silhouette-path"
          style={{ stroke: accent }}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="92" cy="82" r="3" className="silhouette-dot" style={{ fill: accent }} />
        <circle cx="100" cy="182" r="3" className="silhouette-dot" style={{ fill: accent }} />
        <circle cx="112" cy="326" r="3" className="silhouette-dot" style={{ fill: accent }} />
      </svg>
    </div>
  );
}
