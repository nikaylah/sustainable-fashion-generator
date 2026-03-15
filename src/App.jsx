import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardBody, Chip } from "@heroui/react";
import GeneratorForm from "./components/GeneratorForm";
import ResultCard from "./components/ResultCard";
import { generateFashionOutfit } from "./api/claude";

const INITIAL_SELECTIONS = {
  climate: "Warm",
  fiberPreference: "Linen",
  styleVibe: "Minimal",
  colorPalette: "Neutrals",
  designPriorities: ["Breathability", "Minimal Environmental Impact"],
};

export default function App() {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardKey, setCardKey] = useState(0);

  const canGenerate = selections.designPriorities.length > 0 && !isLoading;

  async function handleGenerate(nextSelections = selections) {
    setSelections(nextSelections);
    setIsLoading(true);
    setError("");
    setResult({ directions: [] });
    setCardKey((value) => value + 1);

    try {
      const generated = await generateFashionOutfit(nextSelections, (directionIndex, direction) => {
        setResult((current) => {
          const directions = current?.directions ? [...current.directions] : [];
          directions[directionIndex] = direction;

          return { directions };
        });
      });
      setResult(generated);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "something went weird while generating the outfit."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Card className="border border-sage/15 bg-white/80 shadow-[0_28px_80px_-45px_rgba(124,154,126,0.6)] backdrop-blur md:sticky md:top-8">
            <CardBody className="gap-6 p-6 sm:p-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage/80">
                  ai sustainable fashion generator
                </p>
                <h1 className="font-heading text-4xl leading-tight text-stone-900 sm:text-5xl">
                  build a thoughtful outfit around natural fibers and real values
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-600">
                  pick the weather, fiber, mood, and priorities you care about. the generator
                  turns those choices into an outfit concept with fabric logic and sustainability
                  reasoning.
                </p>
              </div>

              <GeneratorForm
                selections={selections}
                setSelections={setSelections}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                canGenerate={canGenerate}
              />

              {result?.directions?.length ? (
                <div className="rounded-[28px] border-l-[3px] border-sage bg-[#F5F0E8] px-5 py-4 shadow-[0_18px_40px_-30px_rgba(80,70,55,0.45)]">
                  <p className="font-heading text-sm italic leading-6 text-stone-700">
                    A design experiment exploring what clothing concepts look like when
                    sustainability values shape the creative process — not trends.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selections.designPriorities.map((priority) => (
                      <Chip
                        key={priority}
                        radius="full"
                        variant="flat"
                        classNames={{
                          base: "bg-white/80 border border-sand/50",
                          content: "text-xs font-medium text-stone-700",
                        }}
                      >
                        {priority}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </CardBody>
          </Card>

          <div className="flex min-h-[420px] items-stretch">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={cardKey}
                  className="w-full"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <ResultCard
                    result={result}
                    isLoading={isLoading}
                    onGenerateAnother={() => handleGenerate()}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  className="w-full"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Card className="flex h-full min-h-[420px] w-full items-center justify-center border border-sand/40 bg-white/70 shadow-[0_24px_70px_-48px_rgba(80,70,55,0.5)]">
                    <CardBody className="items-center justify-center gap-4 p-8 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage/10 text-3xl text-sage">
                        ✦
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-heading text-3xl text-stone-900">ready when you are</h2>
                        <p className="mx-auto max-w-md text-base leading-7 text-stone-600">
                          your outfit directions will show up here with fabric picks, color
                          swatches, styling notes, and the ai reasoning behind them.
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}
