const SILHOUETTES = {
  "midi-dress": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M85,60 C80,65 75,75 74,90 L74,160 L126,160 L126,90 C125,75 120,65 115,60 Z"
        className={pathClassName}
      />
      <path d="M74,155 C85,162 115,162 126,155" fill="none" className={pathClassName} />
      <path
        d="M74,160 C65,180 55,220 50,280 C60,285 140,285 150,280 C145,220 135,180 126,160 Z"
        className={pathClassName}
      />
      <path
        d="M85,60 C90,55 95,52 100,52 C105,52 110,55 115,60"
        fill="none"
        className={pathClassName}
      />
      <path
        d="M85,65 C78,68 70,75 65,88 C70,92 76,90 80,85 C80,78 82,70 85,65 Z"
        className={pathClassName}
      />
      <path
        d="M115,65 C122,68 130,75 135,88 C130,92 124,90 120,85 C120,78 118,70 115,65 Z"
        className={pathClassName}
      />
    </g>
  ),
  abaya: (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M80,55 C72,65 65,80 63,100 L55,320 C70,325 130,325 145,320 L137,100 C135,80 128,65 120,55 Z"
        className={pathClassName}
      />
      <path
        d="M80,60 C70,65 55,75 40,100 C35,115 35,130 40,135 C55,125 68,110 75,95 L78,70 Z"
        className={pathClassName}
      />
      <path
        d="M120,60 C130,65 145,75 160,100 C165,115 165,130 160,135 C145,125 132,110 125,95 L122,70 Z"
        className={pathClassName}
      />
      <path
        d="M83,55 C88,50 95,48 100,48 C105,48 112,50 117,55"
        fill="none"
        className={pathClassName}
      />
      <path
        d="M100,55 L100,320"
        fill="none"
        strokeDasharray="4,4"
        className={pathClassName}
      />
    </g>
  ),
  "wide-leg-tunic": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M82,58 C76,65 72,78 71,95 L70,175 L130,175 L129,95 C128,78 124,65 118,58 Z"
        className={pathClassName}
      />
      <path d="M70,165 C65,172 62,178 60,185 L140,185 C138,178 135,172 130,165 Z" className={pathClassName} />
      <path d="M70,175 C60,185 45,210 40,310 L85,310 L90,200 L90,175 Z" className={pathClassName} />
      <path d="M130,175 C140,185 155,210 160,310 L115,310 L110,200 L110,175 Z" className={pathClassName} />
      <path
        d="M84,58 C90,52 95,50 100,50 C105,50 110,52 116,58"
        fill="none"
        className={pathClassName}
      />
      <path d="M82,62 C74,66 64,76 58,92 C63,97 70,95 75,88 L78,68 Z" className={pathClassName} />
      <path d="M118,62 C126,66 136,76 142,92 C137,97 130,95 125,88 L122,68 Z" className={pathClassName} />
    </g>
  ),
  "structured-coat": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M78,58 C70,68 66,85 65,105 L64,310 L136,310 L135,105 C134,85 130,68 122,58 Z"
        className={pathClassName}
      />
      <path d="M92,58 C88,70 86,85 87,105 L100,95 Z" className={pathClassName} />
      <path d="M108,58 C112,70 114,85 113,105 L100,95 Z" className={pathClassName} />
      <path
        d="M78,62 C68,68 56,82 52,115 L52,200 C58,202 68,200 72,195 L74,115 C76,90 76,72 78,62 Z"
        className={pathClassName}
      />
      <path
        d="M122,62 C132,68 144,82 148,115 L148,200 C142,202 132,200 128,195 L126,115 C124,90 124,72 122,62 Z"
        className={pathClassName}
      />
      <path d="M65,165 L135,165" fill="none" className={pathClassName} />
      <path
        d="M100,100 L100,310"
        fill="none"
        strokeDasharray="3,8"
        className={pathClassName}
      />
    </g>
  ),
  asymmetric: (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M80,58 C74,66 70,78 69,92 L69,155 L131,155 L131,92 C130,78 126,66 120,58 Z"
        className={pathClassName}
      />
      <path d="M90,58 C86,68 85,82 87,95 L100,88 Z" className={pathClassName} />
      <path d="M110,58 C114,68 115,82 113,95 L100,88 Z" className={pathClassName} />
      <path
        d="M69,155 C58,170 48,210 45,310 L95,310 L100,175 L105,310 L155,310 C152,240 142,185 131,155 Z"
        className={pathClassName}
      />
      <path
        d="M45,310 C65,295 85,300 100,310 C115,320 135,295 155,310"
        fill="none"
        className={pathClassName}
      />
      <path
        d="M80,62 C72,68 62,80 58,100 L58,160 C64,162 72,160 74,155 L74,100 C75,82 76,70 80,62 Z"
        className={pathClassName}
      />
      <path
        d="M120,62 C128,68 138,80 142,100 L142,160 C136,162 128,160 126,155 L126,100 C125,82 124,70 120,62 Z"
        className={pathClassName}
      />
    </g>
  ),
  "wrap-dress": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M85,58 C78,65 73,78 72,95 L72,155 L100,145 Z" className={pathClassName} />
      <path d="M115,58 C122,65 127,78 128,95 L128,155 L100,145 Z" className={pathClassName} />
      <path
        d="M72,150 C60,170 50,220 48,310 L152,310 C150,220 140,170 128,150 Z"
        className={pathClassName}
      />
      <path
        d="M85,62 C74,68 60,80 52,105 C48,118 50,132 56,135 C66,122 74,108 78,92 L82,68 Z"
        className={pathClassName}
      />
      <path
        d="M115,62 C126,68 140,80 148,105 C152,118 150,132 144,135 C134,122 126,108 122,92 L118,68 Z"
        className={pathClassName}
      />
      <path d="M100,145 C95,155 88,162 78,168" fill="none" className={pathClassName} />
      <path d="M85,58 L100,85 L115,58" fill="none" className={pathClassName} />
    </g>
  ),
  "aline-blouse": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M84,58 C78,65 74,76 73,90 L73,165 L127,165 L127,90 C126,76 122,65 116,58 Z"
        className={pathClassName}
      />
      <path d="M73,155 C68,160 65,165 64,170 L136,170 C135,165 132,160 127,155 Z" className={pathClassName} />
      <path d="M73,165 C62,178 52,215 50,295 L150,295 C148,215 138,178 127,165 Z" className={pathClassName} />
      <path
        d="M86,58 C90,53 95,51 100,51 C105,51 110,53 114,58"
        fill="none"
        className={pathClassName}
      />
      <path d="M84,62 C76,67 68,76 65,90 C70,94 77,93 80,88 L82,68 Z" className={pathClassName} />
      <path d="M116,62 C124,67 132,76 135,90 C130,94 123,93 120,88 L118,68 Z" className={pathClassName} />
      <path d="M73,162 C85,168 115,168 127,162" fill="none" className={pathClassName} />
    </g>
  ),
  "layered-coat": (pathClassName) => (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M72,300 C65,305 55,315 52,325 L148,325 C145,315 135,305 128,300 Z" className={pathClassName} />
      <path
        d="M76,58 C68,68 63,85 62,108 L62,295 L138,295 L138,108 C137,85 132,68 124,58 Z"
        className={pathClassName}
      />
      <path
        d="M88,58 C84,52 80,48 78,52 C76,58 78,68 82,75 L100,90 L118,75 C122,68 124,58 122,52 C120,48 116,52 112,58"
        fill="none"
        className={pathClassName}
      />
      <path
        d="M76,65 C65,72 54,88 50,118 L50,210 C57,213 67,210 70,205 L71,118 C72,92 73,76 76,65 Z"
        className={pathClassName}
      />
      <path
        d="M124,65 C135,72 146,88 150,118 L150,210 C143,213 133,210 130,205 L129,118 C128,92 127,76 124,65 Z"
        className={pathClassName}
      />
      <path d="M62,175 L138,175" className={pathClassName} />
      <rect x="94" y="170" width="12" height="10" rx="2" className={pathClassName} />
    </g>
  ),
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
  const silhouette = SILHOUETTES[silhouetteKey] || SILHOUETTES["midi-dress"];
  const accent = primaryColor || "#D4B896";

  return (
    <div className="fashion-silhouette-wrap" key={silhouetteKey}>
      <svg
        key={silhouetteKey}
        viewBox="0 0 200 400"
        width="160"
        height="240"
        className="fashion-silhouette-svg block mx-auto"
        aria-hidden="true"
      >
        <g className="silhouette-fill" style={{ color: accent, fill: `${accent}26`, stroke: "none" }}>
          {silhouette("")}
        </g>
        <g style={{ color: accent }}>
          {silhouette("silhouette-path")}
        </g>
        <circle cx="92" cy="82" r="3" className="silhouette-dot" style={{ fill: accent }} />
        <circle cx="100" cy="182" r="3" className="silhouette-dot" style={{ fill: accent }} />
        <circle cx="112" cy="326" r="3" className="silhouette-dot" style={{ fill: accent }} />
      </svg>
    </div>
  );
}
