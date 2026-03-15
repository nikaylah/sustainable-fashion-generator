import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";

const SINGLE_SELECT_FIELDS = [
  {
    key: "climate",
    label: "Climate",
    options: ["Warm", "Mild", "Cold"],
  },
  {
    key: "fiberPreference",
    label: "Fiber Preference",
    options: ["Linen", "Organic Cotton", "Bamboo", "Wool"],
  },
  {
    key: "styleVibe",
    label: "Style Vibe",
    options: ["Minimal", "Earthy", "Romantic", "Contemporary"],
  },
  {
    key: "colorPalette",
    label: "Color Palette",
    options: ["Neutrals", "Desert Tones", "Forest Tones", "Soft Pastels"],
  },
];

const PRIORITY_OPTIONS = [
  "Breathability",
  "Durability",
  "Minimal Environmental Impact",
  "Modest Layering",
];

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
        selections.climate ||
          selections.fiberPreference ||
          selections.styleVibe ||
          selections.colorPalette ||
          selections.designPriorities.length
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
    <div className="space-y-6">
      {SINGLE_SELECT_FIELDS.map((field) => (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              {field.label}
            </h2>
            <span className="text-sm text-stone-400">{selections[field.key] || ""}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {field.options.map((option) => {
              const selected = selections[field.key] === option;

              return (
                <Button
                  key={option}
                  radius="full"
                  variant={selected ? "solid" : "bordered"}
                  className={
                    selected
                      ? "chip-selected min-h-11"
                      : "chip-unselected min-h-11 border-sand/60 bg-white text-stone-700"
                  }
                  onPress={() => updateSelection(field.key, option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Design Priorities
          </h2>
          <span className="text-sm text-stone-400">
            {selections.designPriorities.length} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {PRIORITY_OPTIONS.map((option) => {
            const selected = selections.designPriorities.includes(option);

            return (
              <Button
                key={option}
                radius="full"
                variant={selected ? "solid" : "bordered"}
                className={
                  selected
                    ? "chip-selected min-h-11"
                    : "chip-unselected min-h-11 border-sand/60 bg-white text-stone-700"
                }
                onPress={() => togglePriority(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        radius="full"
        className={
          isLoading
            ? "generate-button-loading w-full text-base font-semibold shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)]"
            : "w-full bg-sage text-base font-semibold text-white shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)] transition-transform hover:scale-[1.01]"
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
        <p className="font-heading text-sm italic text-sage">
          Select at least one preference to generate your outfit directions.
        </p>
      ) : null}
    </div>
  );
}
