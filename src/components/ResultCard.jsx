import { useState } from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";

function MoodboardHeader({ direction }) {
  return (
    <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-[28px] border border-sand bg-cream text-center">
      <div className="flex flex-col items-center gap-6">
        <h2 className="font-heading text-4xl italic text-stone-900 sm:text-5xl">
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

export default function ResultCard({ result, onGenerateAnother, isLoading }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="flex h-full w-full flex-col gap-5">
      {result.directions.map((direction, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <Card
            key={`${direction.outfitName}-${index}`}
            className="border border-sand/50 bg-white shadow-[0_30px_80px_-50px_rgba(80,70,55,0.45)]"
          >
            <CardBody className="gap-6 p-6 sm:p-8">
              <MoodboardHeader direction={direction} />

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage/80">
                  outfit concept
                </p>
                <div>
                  <h2 className="font-heading text-3xl text-stone-900">
                    {direction.outfitName}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-stone-600">
                    {direction.outfitDescription}
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Recommended Fabrics
                </h3>
                <div className="grid gap-3">
                  {direction.fabrics.map((fabric) => (
                    <div key={fabric.name} className="rounded-2xl bg-cream px-4 py-3">
                      <p className="font-semibold text-stone-900">{fabric.name}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {fabric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Button
                radius="full"
                variant="light"
                className="w-fit px-0 text-base font-semibold text-sage"
                onPress={() => setExpandedIndex(index)}
              >
                Explore this direction →
              </Button>

              <AnimatePresence initial={false}>
                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6">
                      <Divider className="bg-sand/50" />

                      <section className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Color Palette
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {direction.colorPalette.map((color) => (
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
                                <p className="text-sm text-stone-500">{color.hex}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Styling Notes
                        </h3>
                        <p className="text-base leading-7 text-stone-600">
                          {direction.stylingNotes}
                        </p>
                      </section>

                      <section className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Sustainability Insight
                        </h3>
                        <p className="text-base leading-7 text-stone-600">
                          {direction.sustainabilityInsight}
                        </p>
                      </section>

                      <Card className="border border-sage/20 bg-white/85 shadow-[0_24px_70px_-52px_rgba(124,154,126,0.6)]">
                        <CardBody className="gap-3 p-6">
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage/80">
                            ai reasoning
                          </p>
                          <p className="text-base leading-7 text-stone-600">
                            {direction.aiReasoning}
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardBody>
          </Card>
        );
      })}

      <Button
        radius="full"
        size="lg"
        className="mt-2 bg-sand text-base font-semibold text-stone-900"
        isLoading={isLoading}
        onPress={onGenerateAnother}
      >
        Generate New Directions
      </Button>
    </div>
  );
}
