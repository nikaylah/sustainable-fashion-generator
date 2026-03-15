import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";

const FIBER_FIELD = {
  key: "fiberPreference",
  label: "Fiber Preference",
  icon: "🌿",
  tintClass: "bg-[#EEF2EE]",
  options: [
    "Linen",
    "Organic Cotton",
    "Bamboo",
    "Wool (Merino)",
    "Hemp",
    "Tencel/Lyocell",
    "Alpaca",
    "Silk",
  ],
};

const STYLE_FIELD = {
  key: "styleVibe",
  label: "Style Vibe",
  icon: "✨",
  tintClass: "bg-[#F8F0F0]",
  options: ["Minimal", "Earthy", "Romantic", "Contemporary"],
};

const PRIORITY_OPTIONS = [
  "Breathability",
  "Durability",
  "Minimal Environmental Impact",
  "Modest Layering",
];

const FIBER_TOOLTIPS = {
  Linen: "Breathability 10/10 · Best for hot/humid climates · Biodegradable",
  "Organic Cotton": "Breathability 8/10 · Best for mild climates · GOTS certifiable",
  Bamboo: "Breathability 9/10 · All-season · Fast drying",
  "Wool (Merino)": "Breathability 7/10 · Best for cold/mild · Wicks moisture as vapor",
  Hemp: "Breathability 9/10 · Best for warm/arid · Antimicrobial",
  "Tencel/Lyocell": "Breathability 9/10 · Best for warm/humid · Very high moisture wicking",
  Alpaca: "Breathability 6/10 · Best for extreme cold · Ultra-high thermal regulation",
  Silk: "Breathability 7/10 · Best for mild climates · Protein fiber, takes natural dyes well",
};

function SingleSelectSection({ field, selections, updateSelection }) {
  return (
    <section className="space-y-5 border-b border-[#EDE8E0] py-8">
      <div className="flex items-center gap-2 text-[1rem] font-medium tracking-[0.08em] text-[#5C4A32]">
        <span aria-hidden="true">{field.icon}</span>
        <span>{field.label}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        {field.options.map((option) => {
          const selected = selections[field.key] === option;
          const tooltip = field.key === "fiberPreference" ? FIBER_TOOLTIPS[option] : null;

          return (
            <span key={option} className="fiber-chip-wrap">
              <Button
                radius="full"
                variant={selected ? "solid" : "bordered"}
                className={
                  selected
                    ? "chip-selected min-h-11 px-6 py-3 text-[0.9rem]"
                    : `chip-unselected min-h-11 border-sand/60 ${field.tintClass} px-6 py-3 text-[0.9rem] text-stone-700`
                }
                onPress={() => updateSelection(field.key, option)}
              >
                {option}
              </Button>
              {tooltip ? <span className="fiber-chip-tooltip">{tooltip}</span> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default function GeneratorForm({
  selections,
  setSelections,
  onGenerate,
  isLoading,
  canGenerate,
}) {
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const hasAnySelection = useMemo(
    () =>
      Boolean(
        selections.fiberPreference || selections.styleVibe || selections.designPriorities.length
      ),
    [selections]
  );

  useEffect(() => {
    if (hasAnySelection) {
      setShowValidationMessage(false);
    }
  }, [hasAnySelection]);

  function updateSelection(key, value) {
    setSelections((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));
  }

  function togglePriority(priority) {
    setSelections((current) => {
      const exists = current.designPriorities.includes(priority);

      return {
        ...current,
        designPriorities: exists
          ? current.designPriorities.filter((item) => item !== priority)
          : [...current.designPriorities, priority],
      };
    });
  }

  function handleGeneratePress() {
    if (!hasAnySelection) {
      setShowValidationMessage(true);
      return;
    }

    setShowValidationMessage(false);
    onGenerate(selections);
  }

  return (
    <div className="space-y-2">
      <div className="pb-3">
        <h2 className="font-heading text-[2rem] italic text-[#3D3027]">
          what do you want to feel?
        </h2>
      </div>

      <SingleSelectSection
        field={FIBER_FIELD}
        selections={selections}
        updateSelection={updateSelection}
      />

      <SingleSelectSection
        field={STYLE_FIELD}
        selections={selections}
        updateSelection={updateSelection}
      />

      <section className="space-y-5 border-b border-[#EDE8E0] py-8">
        <div className="flex items-center gap-2 text-[1rem] font-medium tracking-[0.08em] text-[#5C4A32]">
          <span aria-hidden="true">🌱</span>
          <span>Design Priorities</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {PRIORITY_OPTIONS.map((option) => {
            const selected = selections.designPriorities.includes(option);

            return (
              <Button
                key={option}
                radius="full"
                variant={selected ? "solid" : "bordered"}
                className={
                  selected
                    ? "chip-selected min-h-11 px-6 py-3 text-[0.9rem]"
                    : "chip-unselected min-h-11 border-sand/60 bg-[#EDF2ED] px-6 py-3 text-[0.9rem] text-stone-700"
                }
                onPress={() => togglePriority(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </section>

      <Button
        size="lg"
        radius="full"
        className={
          isLoading
            ? "generate-button-loading mt-6 w-full px-6 py-[18px] text-[1rem] font-semibold tracking-[0.05em] shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)]"
            : "mt-6 w-full bg-sage px-6 py-[18px] text-[1rem] font-semibold tracking-[0.05em] text-white shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)] transition-transform hover:scale-[1.01]"
        }
        isLoading={isLoading}
        isDisabled={!canGenerate}
        onPress={handleGeneratePress}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="button-spinner" />
            <span>Generating...</span>
          </span>
        ) : (
          "Generate Outfit"
        )}
      </Button>

      {showValidationMessage ? (
        <p className="pt-3 font-heading text-sm italic text-sage">
          Select at least one preference to generate your outfit directions.
        </p>
      ) : null}
    </div>
  );
}
