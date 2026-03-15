import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import FashionSilhouette from "./FashionSilhouette";
import SustainabilityPanel from "./SustainabilityPanel";
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

function LoadingCard() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % LOADING_PHRASES.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="border border-sand/50 bg-white shadow-[0_30px_80px_-50px_rgba(80,70,55,0.45)]">
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

  useEffect(() => {
    setShowReasoning(false);
  }, [result?.outfitName]);

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {isLoading ? <LoadingCard /> : null}

      {result ? (
        <Card className="overflow-hidden border border-sand/50 bg-cream shadow-[0_30px_80px_-50px_rgba(80,70,55,0.45)]">
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

              <SustainabilityPanel
                selectedFiber={result.selected_fiber}
                sustainabilityHighlight={result.sustainability_highlight}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                  Styling Notes
                </p>
                <p className="text-[0.875rem] leading-[1.7] text-stone-700">
                  {result.stylingNotes}
                </p>
              </section>

              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                  Sustainability Insight
                </p>
                <p className="text-[0.875rem] leading-[1.7] text-stone-700">
                  {result.sustainabilityInsight}
                </p>
              </section>
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

            <Button
              radius="full"
              variant="bordered"
              className="mx-auto block min-h-11 w-full rounded-full border-2 border-sage bg-transparent px-6 py-2.5 text-sm font-semibold text-sage transition-colors duration-300 hover:bg-sage hover:text-white sm:w-fit"
              isLoading={isLoading}
              onPress={onGenerateAnother}
            >
              Regenerate
            </Button>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
