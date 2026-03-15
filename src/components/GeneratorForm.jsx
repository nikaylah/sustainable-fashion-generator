import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { FIBER_LIBRARY } from "../constants/fabrics";

const FIBER_FIELD = {
  key: "fiberPreference",
  label: "Fiber Preference",
  icon: "🌿",
  options: Object.keys(FIBER_LIBRARY),
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

const IMPACT_HINTS = {
  "Organic Hemp": "High Impact / Low Water",
  "Tencel Lyocell": "Bio-engineered / Soft",
  "Recycled Polyester": "Ocean Plastic / Durable",
  "Deadstock Silk": "Luxury Waste / Zero New Resources",
  "Conventional Cotton": "Baseline / High Water Use",
};

function SingleSelectSection({ field, selections, updateSelection }) {
  if (field.key === "fiberPreference") {
    return (
      <section className="space-y-5 border-b border-[#EDE8E0] py-8">
        <div className="flex items-center gap-2 text-[1rem] font-medium tracking-[0.08em] text-[#5C4A32]">
          <span aria-hidden="true">{field.icon}</span>
          <span>{field.label}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field.options.map((option) => {
            const selected = selections[field.key] === option;
            const fiber = FIBER_LIBRARY[option];

            return (
              <button
                key={option}
                type="button"
                className={
                  selected
                    ? "rounded-[12px] border-2 border-sage bg-[#F0F5F0] p-4 text-left shadow-[0_16px_36px_-30px_rgba(124,154,126,0.7)] transition-colors"
                    : "rounded-[12px] border border-stone-200 bg-cream p-4 text-left shadow-[0_14px_30px_-28px_rgba(80,70,55,0.45)] transition-colors hover:border-sand/80"
                }
                onClick={() => updateSelection(field.key, option)}
              >
                <p className="text-[0.95rem] font-semibold text-stone-900">{option}</p>
                <p className="mt-1 text-sm italic text-sage">{fiber.label}</p>
                <p className="mt-3 text-[0.72rem] text-stone-500">{IMPACT_HINTS[option]}</p>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 border-b border-[#EDE8E0] py-8">
      <div className="flex items-center gap-2 text-[1rem] font-medium tracking-[0.08em] text-[#5C4A32]">
        <span aria-hidden="true">{field.icon}</span>
        <span>{field.label}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        {field.options.map((option) => {
          const selected = selections[field.key] === option;

          return (
            <Button
              key={option}
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
