import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button, Card, CardBody, Modal, ModalBody, ModalContent } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import FashionSilhouette from "./FashionSilhouette";
import InsightPanel from "./InsightPanel";
import ShareCard from "./ShareCard";
import { FIBER_LIBRARY, calculateScore } from "../constants/fabrics";
import linenImage from "../assets/swatches/linen.jpg";
import cottonImage from "../assets/swatches/cotton.jpg";
import cottonFabricImage from "../assets/swatches/cottonfabric.jpg";
import merinoImage from "../assets/swatches/Merino_Wool.jpg";
import hempImage from "../assets/swatches/hemp.jpg";
import silkImage from "../assets/swatches/MulberrySilk.jpg";
import alpacaImage from "../assets/swatches/alpacawool.jpg";
import woolImage from "../assets/swatches/wool.jpg";

const LOADING_PHRASES = [
  "Reading your values...",
  "Exploring fiber combinations...",
  "Considering your climate...",
  "Shaping your direction...",
];

function DesignConnections({ selections, result }) {
  if (!selections?.fiberPreference && !selections?.styleVibe) return null;

  const connections = [];

  if (selections.fiberPreference) {
    connections.push({
      icon: "🌿",
      text: `${selections.fiberPreference} informed the fabric weight and drape`,
    });
  }

  if (selections.styleVibe) {
    const vibeMap = {
      Minimal: "the clean silhouette and structured lines",
      Earthy: "the organic texture and grounded proportions",
      Romantic: "the gathered layers and soft movement",
      Contemporary: "the asymmetric cut and modern proportions",
    };
    const vibeResult = vibeMap[selections.styleVibe] || "the overall silhouette";
    connections.push({
      icon: "✦",
      text: `${selections.styleVibe} shaped ${vibeResult}`,
    });
  }

  if (selections.designPriorities?.length > 0) {
    const priority = selections.designPriorities[0];
    const priorityMap = {
      Breathability: "open weave constructions and light fabric weight",
      Durability: "reinforced seaming and structured fabric choices",
      "Minimal Environmental Impact": "certified fibers and natural dye palette",
      "Modest Layering": "longer hemlines and layered silhouette",
    };
    const priorityResult = priorityMap[priority] || "the construction details";
    connections.push({
      icon: "◎",
      text: `${priority} guided ${priorityResult}`,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "16px",
        backgroundColor: "rgba(124, 154, 126, 0.06)",
        borderRadius: "12px",
        margin: "16px 0",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#7C9A7E",
          marginBottom: "4px",
        }}
      >
        how your choices shaped this
      </p>
      {connections.map((connection, index) => (
        <p
          key={`${connection.icon}-${index}`}
          style={{
            fontSize: "0.8rem",
            color: "#5C4A32",
            lineHeight: 1.5,
          }}
        >
          <span style={{ marginRight: "8px" }}>{connection.icon}</span>
          {connection.text}
        </p>
      ))}
    </div>
  );
}

function getFirstSentence(text) {
  if (!text) return "";
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
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

function getSelectedFiberName(result, selections) {
  if (result?.selected_fiber) return result.selected_fiber;
  if (selections?.fiberPreference) return selections.fiberPreference;

  const firstFabricName = result?.fabrics?.[0]?.name?.toLowerCase() || "";

  if (firstFabricName.includes("hemp")) return "Organic Hemp";
  if (firstFabricName.includes("tencel") || firstFabricName.includes("lyocell")) {
    return "Tencel Lyocell";
  }
  if (firstFabricName.includes("polyester")) return "Recycled Polyester";
  if (firstFabricName.includes("silk")) return "Deadstock Silk";
  if (firstFabricName.includes("cotton")) return "Conventional Cotton";

  return null;
}

function LoadingCard() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % LOADING_PHRASES.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="main-card-surface bg-white">
      <CardBody className="gap-6 p-8">
        <div className="skeleton-block mx-auto h-[280px] w-[180px] rounded-[28px] border border-sand/60 bg-cream" />
        <div className="space-y-3 text-center">
          <div className="skeleton-block mx-auto h-12 w-2/3 rounded-full bg-stone-200/70" />
          <div className="skeleton-block mx-auto h-4 w-80 max-w-full rounded-full bg-stone-200/70" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="skeleton-block h-20 w-20 rounded-[8px] bg-cream" />
              <div className="skeleton-block h-3 w-16 rounded-full bg-stone-200/70" />
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={LOADING_PHRASES[phraseIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center font-heading text-sm italic text-stone-500"
          >
            {LOADING_PHRASES[phraseIndex]}
          </motion.p>
        </AnimatePresence>
      </CardBody>
    </Card>
  );
}

export default function ResultCard({ result, selections, onGenerateAnother, isLoading }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSharePreviewOpen, setIsSharePreviewOpen] = useState(false);
  const shareCardRef = useRef(null);
  const selectedFiberName = getSelectedFiberName(result, selections);
  const fiberData = selectedFiberName ? FIBER_LIBRARY[selectedFiberName] : null;
  const score = fiberData ? calculateScore(fiberData) : null;

  useEffect(() => {
    setShowReasoning(false);
  }, [result?.outfitName]);

  const downloadShareImage = (downloadSource) => {
    const a = document.createElement("a");
    a.href = downloadSource;
    a.download = `${result.outfitName.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const captureShareCard = async () => {
    if (!shareCardRef.current || !result) {
      throw new Error("share card wasn't ready yet.");
    }

    await document.fonts?.ready?.catch?.(() => {});
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

    return html2canvas(shareCardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f8f5ec",
      logging: false,
    });
  };

  const handleShare = () => {
    if (!result) return;
    setIsSharePreviewOpen(true);
  };

  const handleShareExport = async () => {
    setIsSharing(true);
    const supportsNativeFileShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function";

    try {
      const canvas = await captureShareCard();
      const blob = await new Promise((resolve) => {
        canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
      });
      const file = blob
        ? new File([blob], "my-sustainable-design.png", { type: "image/png" })
        : null;
      const shareTextScore = score ?? "—";

      if (file && supportsNativeFileShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: result.outfitName,
            text: `I designed "${result.outfitName}" - a sustainable fashion concept with a ${shareTextScore}/100 impact score.`,
            files: [file],
          });
          return;
        } catch {
          // fall through to download if native share is unavailable or dismissed
        }
      }

      if (blob) {
        const previewSource = URL.createObjectURL(blob);
        downloadShareImage(previewSource);
        window.setTimeout(() => URL.revokeObjectURL(previewSource), 1000);
      } else {
        downloadShareImage(canvas.toDataURL("image/png"));
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <Modal
        isOpen={isSharePreviewOpen}
        onOpenChange={setIsSharePreviewOpen}
        placement="center"
        backdrop="blur"
        size="2xl"
      >
        <ModalContent className="main-card-surface bg-cream">
          <ModalBody className="gap-4 p-6 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-sage">
              your share card is ready
            </p>
            {result ? (
              <ShareCard
                forwardRef={shareCardRef}
                result={result}
                selectedFiber={selectedFiberName}
                score={score}
                isPreview
              />
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
              <button
                type="button"
                onClick={handleShareExport}
                className="rounded-full border-2 border-sage bg-sage px-5 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              >
                {isSharing ? "creating..." : "download image"}
              </button>
              <button
                type="button"
                onClick={() => setIsSharePreviewOpen(false)}
                className="rounded-full border-2 border-sage bg-transparent px-5 py-3 text-sm font-semibold text-sage transition-colors duration-200 hover:bg-sage hover:text-white"
              >
                close
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {isLoading ? <LoadingCard /> : null}

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Card className="main-card-surface overflow-hidden bg-cream">
            <CardBody className="gap-10 p-8">
              <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="origin-center scale-[1.16]">
                  <FashionSilhouette
                    climate={selections?.climate}
                    styleVibe={selections?.styleVibe}
                    priorities={selections?.designPriorities}
                    primaryColor={result.colorPalette[0]?.hex}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-[2.5rem] italic leading-none text-stone-900">
                  {result.outfitName}
                </h2>
                <p className="mx-auto max-w-[400px] text-[1rem] leading-7 text-[#8B7355]">
                  {getFirstSentence(result.outfitDescription)}
                </p>
              </div>

              <DesignConnections selections={selections} result={result} />

              <div className="overflow-x-auto pb-2">
                <div className="mx-auto flex w-max gap-5">
                  {result.fabrics.map((fabric) => (
                    <div key={fabric.name} className="w-20 shrink-0 text-center">
                      <img
                        src={getFabricImage(fabric.name)}
                        alt={fabric.name}
                        className="h-20 w-20 rounded-[8px] object-cover shadow-[0_12px_30px_-18px_rgba(80,70,55,0.6)]"
                      />
                      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.05em] text-[#5C4A32]">
                        {fabric.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-start justify-center gap-5">
                {result.colorPalette.map((color) => (
                  <div key={`${color.name}-${color.hex}`} className="w-16 text-center">
                    <span
                      className="mx-auto block h-10 w-10 rounded-full shadow-[0_10px_24px_-16px_rgba(80,70,55,0.7)]"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.05em] text-[#8B7355]">
                      {color.name}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                <svg
                  width="120"
                  height="12"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C10 10 14 2 22 2C30 2 34 10 42 10C50 10 54 2 62 2C70 2 74 10 82 10C90 10 94 2 102 2C110 2 114 10 118 10"
                    stroke="#C4B5A0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <InsightPanel
                selectedFiber={result.selected_fiber}
                primaryFabricTag={result.primaryFabricTag}
                fallbackFiber={selections?.fiberPreference}
                fabrics={result.fabrics}
                sustainabilityHighlight={result.sustainability_highlight}
                designReasoning={result.design_reasoning}
              />
            </div>

              <div>
                <details style={{ borderTop: "1px solid #E8E0D5", marginTop: "24px" }}>
                  <summary
                    style={{
                      padding: "16px 0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#7C9A7E",
                      listStyle: "none",
                      userSelect: "none",
                    }}
                  >
                    <span>Styling & Sustainability Details</span>
                    <span style={{ fontSize: "0.8rem" }}>↓</span>
                  </summary>
                  <div style={{ paddingBottom: "16px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "32px",
                      }}
                      className="md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]"
                    >
                      <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                          Styling Notes
                        </p>
                        <p className="min-w-0 text-[0.875rem] leading-[1.7] text-stone-700">
                          {result.stylingNotes}
                        </p>
                      </section>

                      <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                          Sustainability Insight
                        </p>
                        <p className="min-w-0 text-[0.875rem] leading-[1.7] text-stone-700">
                          {result.sustainabilityInsight}
                        </p>
                      </section>
                    </div>
                  </div>
                </details>
              </div>

              <div className="space-y-3 text-center">
                <button
                  type="button"
                  className="text-sm text-[#8B7355] transition-colors duration-300 hover:text-sage"
                  onClick={() => setShowReasoning((current) => !current)}
                >
                  {showReasoning ? "hide the design logic ↑" : "see the design logic →"}
                </button>

                <AnimatePresence initial={false}>
                  {showReasoning ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mx-auto max-w-2xl text-[0.875rem] leading-[1.7] text-stone-600">
                        {result.aiReasoning}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "999px",
                    border: "2px solid #7C9A7E",
                    backgroundColor: "#7C9A7E",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: isSharing ? "wait" : "pointer",
                    opacity: isSharing ? 0.7 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isSharing ? "Creating..." : "↑ Share This Design"}
                </button>

                <Button
                  radius="full"
                  variant="bordered"
                  className="min-h-11 w-full rounded-full border-2 border-sage bg-transparent px-6 py-2.5 text-sm font-semibold text-sage transition-colors duration-300 hover:bg-sage hover:text-white sm:w-fit"
                  isLoading={isLoading}
                  onPress={onGenerateAnother}
                >
                  Regenerate
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
