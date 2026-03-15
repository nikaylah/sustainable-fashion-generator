import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LOADING_PHRASES = [
  "reading your values...",
  "exploring fiber combinations...",
  "imagining the silhouette...",
  "consulting the sustainability data...",
  "shaping your direction...",
  "almost ready...",
];

export default function LoadingOverlay({ isVisible }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isVisible) return;
    setPhraseIndex(0);

    const phraseInterval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length);
    }, 2200);

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(dotsInterval);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "#f8f5ec",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="80"
              height="160"
              viewBox="0 0 200 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#7C9A7E"
              strokeWidth="1.5"
            >
              <path d="M85,60 C80,65 75,75 74,90 L74,160 L126,160 L126,90 C125,75 120,65 115,60 Z" />
              <path d="M74,160 C65,180 55,220 50,280 C60,285 140,285 150,280 C145,220 135,180 126,160 Z" />
              <path d="M85,60 C90,55 95,52 100,52 C105,52 110,55 115,60" />
              <path d="M85,65 C78,68 70,75 65,88 C70,92 76,90 80,85 L85,65 Z" />
              <path d="M115,65 C122,68 130,75 135,88 C130,92 124,90 120,85 L115,65 Z" />
            </svg>
          </motion.div>

          <div
            style={{
              textAlign: "center",
              height: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={LOADING_PHRASES[phraseIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "Caveat, cursive",
                  fontSize: "1.5rem",
                  color: "#5C4A32",
                  letterSpacing: "0.02em",
                }}
              >
                {LOADING_PHRASES[phraseIndex]}
                {dots}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            animate={{ scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          >
            <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
              <path
                d="M2 10C10 10 14 2 22 2C30 2 34 10 42 10C50 10 54 2 62 2C70 2 74 10 82 10C90 10 94 2 102 2C110 2 114 10 118 10"
                stroke="#7C9A7E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8B7355",
              opacity: 0.6,
            }}
          >
            designing with intent
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
