import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import FashionSilhouette from "./FashionSilhouette";

const LOADING_PHRASES = [
  "Reading your values...",
  "Exploring fiber combinations...",
  "Considering your climate...",
  "Shaping your direction...",
];

function MoodboardHeader({ direction, selections }) {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-[28px] border border-sand bg-cream px-6 py-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <FashionSilhouette
          climate={selections?.climate}
          styleVibe={selections?.styleVibe}
          priorities={selections?.designPriorities}
          primaryColor={direction.colorPalette[0]?.hex}
        />
        <h2 className="font-heading text-[2.2rem] italic text-stone-900 sm:text-5xl">
          {direction.outfitName}
        </h2>
        <div className="flex items-center justify-center gap-4">
          {direction.colorPalette.slice(0, 3).map((color) => (
            <span
              key={`moodboard-${color.name}-${color.hex}`}
              className="h-8 w-8 rounded-full border border-white shadow-[0_8px_18px_-10px_rgba(80,70,55,0.7)]"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
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
      <CardBody className="gap-6 p-6 sm:p-8">
        <div className="skeleton-block h-[200px] w-full rounded-[28px] border border-sand/60 bg-cream" />
        <div className="space-y-3">
          <div className="skeleton-block h-4 w-28 rounded-full bg-stone-200/70" />
          <div className="skeleton-block h-10 w-3/4 rounded-full bg-stone-200/70" />
          <div className="space-y-2">
            <div className="skeleton-block h-4 w-full rounded-full bg-stone-200/70" />
            <div className="skeleton-block h-4 w-5/6 rounded-full bg-stone-200/70" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="skeleton-block h-4 w-36 rounded-full bg-stone-200/70" />
          <div className="grid gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="skeleton-block h-16 rounded-2xl bg-cream"
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={LOADING_PHRASES[phraseIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-heading text-sm italic text-stone-500"
          >
            {LOADING_PHRASES[phraseIndex]}
          </motion.p>
        </AnimatePresence>
      </CardBody>
    </Card>
  );
}

export default function ResultCard({ result, selections, onGenerateAnother, isLoading }) {
  return (
    <div className="flex h-full w-full flex-col gap-6">
      {isLoading ? <LoadingCard /> : null}

      {result ? (
        <Card className="overflow-hidden border border-sand/50 bg-cream shadow-[0_30px_80px_-50px_rgba(80,70,55,0.45)]">
          <div
            className="h-[5px] w-full rounded-t-[12px]"
            style={{ backgroundColor: result.colorPalette[0]?.hex || "#D4B896" }}
          />
          <MoodboardHeader direction={result} selections={selections} />
          <CardBody className="gap-8 p-8">
            <div className="space-y-3">
              <p className="text-base leading-7 text-stone-600">{result.outfitDescription}</p>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                Recommended Fabrics
              </h3>
              <div className="grid gap-3">
                {result.fabrics.map((fabric) => (
                  <div key={fabric.name} className="rounded-2xl bg-cream px-4 py-3">
                    <p className="font-semibold text-stone-900">{fabric.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[#8B7355]">{fabric.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded-[28px] bg-[#F5F0E8] p-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                Color Palette
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.colorPalette.map((color) => (
                  <div
                    key={`${color.name}-${color.hex}`}
                    className="flex items-center gap-3 rounded-2xl border border-sand/40 bg-white px-4 py-3"
                  >
                    <span
                      className="h-12 w-12 rounded-2xl border border-white shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{color.name}</p>
                      <p className="text-sm text-[#8B7355]">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>

              <section className="space-y-2 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                  Styling Notes
                </h3>
                <p className="text-base leading-7 text-stone-600">{result.stylingNotes}</p>
              </section>

              <section className="space-y-2 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                  Sustainability Insight
                </h3>
                <p className="text-base leading-7 text-stone-600">
                  {result.sustainabilityInsight}
                </p>
              </section>

              <Card className="border border-sage/20 bg-white/85 shadow-[0_24px_70px_-52px_rgba(124,154,126,0.6)]">
                <CardBody className="gap-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage/80">
                    ai reasoning
                  </p>
                  <p className="text-base leading-7 text-stone-600">{result.aiReasoning}</p>
                </CardBody>
              </Card>
            </section>

            <Button
              radius="full"
              variant="bordered"
              className="block min-h-11 w-full self-center rounded-full border-2 border-sage bg-transparent px-6 py-2.5 text-sm font-semibold text-sage transition-colors duration-300 hover:bg-sage hover:text-white sm:w-fit"
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
