import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";

const PRIMARY_SINGLE_SELECT_FIELDS = [
  {
    key: "climate",
    label: "Climate",
    icon: "🌤",
    tintClass: "bg-[#EEF4F8]",
    options: ["Warm", "Mild", "Cold"],
  },
  {
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
  },
  {
    key: "styleVibe",
    label: "Style Vibe",
    icon: "✨",
    tintClass: "bg-[#F8F0F0]",
    options: ["Minimal", "Earthy", "Romantic", "Contemporary"],
  },
  {
    key: "colorPalette",
    label: "Color Palette",
    icon: "🎨",
    tintClass: "bg-[#F3F0F8]",
    options: ["Neutrals", "Desert Tones", "Forest Tones", "Soft Pastels"],
  },
];

const SECONDARY_SINGLE_SELECT_FIELDS = [
  {
    key: "opacityPreference",
    label: "Opacity Preference",
    icon: "👁",
    tintClass: "bg-[#F0F0F8]",
    options: ["Sheer/Layering", "Semi-Opaque", "Fully Opaque"],
  },
  {
    key: "activityLevel",
    label: "Activity Level",
    icon: "🚶",
    tintClass: "bg-[#F0F5F0]",
    options: ["Office/Static", "Daily/Walking", "Active/Commuting"],
  },
  {
    key: "careCapacity",
    label: "Care Capacity",
    icon: "🫧",
    tintClass: "bg-[#F5F0F5]",
    options: ["Machine Wash", "Hand Wash", "Dry Clean Only"],
  },
];

const PRIORITY_OPTIONS = [
  "Breathability",
  "Durability",
  "Minimal Environmental Impact",
  "Modest Layering",
];

const ETHICS_OPTIONS = [
  "Vegan Only",
  "Compostable/Biodegradable",
  "Local Sourcing",
  "Fair Trade",
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
          selections.designPriorities.length ||
          selections.opacityPreference ||
          selections.activityLevel ||
          selections.careCapacity ||
          selections.specificEthics.length
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

  function toggleEthic(ethic) {
    setSelections((current) => {
      const exists = current.specificEthics.includes(ethic);

      return {
        ...current,
        specificEthics: exists
          ? current.specificEthics.filter((item) => item !== ethic)
          : [...current.specificEthics, ethic],
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
      {PRIMARY_SINGLE_SELECT_FIELDS.map((field) => (
        <div key={field.key} className="space-y-3 border-b border-[#EDE8E0] pb-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.05em] text-[#8B7355]">
              <span aria-hidden="true">{field.icon}</span>
              <span>{field.label}</span>
            </h2>
            <span className="text-sm text-stone-400">{selections[field.key] || ""}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {field.options.map((option) => {
              const selected = selections[field.key] === option;
              const tooltip = field.key === "fiberPreference" ? FIBER_TOOLTIPS[option] : null;
              const button = (
                <Button
                  key={option}
                  radius="full"
                  variant={selected ? "solid" : "bordered"}
                  className={
                    selected
                      ? "chip-selected min-h-11"
                      : `chip-unselected min-h-11 border-sand/60 ${field.tintClass} text-stone-700`
                  }
                  onPress={() => updateSelection(field.key, option)}
                >
                  {option}
                </Button>
              );

              return (
                <span key={option} className="fiber-chip-wrap">
                  {button}
                  {tooltip ? <span className="fiber-chip-tooltip">{tooltip}</span> : null}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      <div className="space-y-3 border-b border-[#EDE8E0] pb-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.05em] text-[#8B7355]">
            <span aria-hidden="true">🌱</span>
            <span>Design Priorities</span>
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
                    : "chip-unselected min-h-11 border-sand/60 bg-[#EDF2ED] text-stone-700"
                }
                onPress={() => togglePriority(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>

      {SECONDARY_SINGLE_SELECT_FIELDS.map((field) => (
        <div key={field.key} className="space-y-3 border-b border-[#EDE8E0] pb-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.05em] text-[#8B7355]">
              <span aria-hidden="true">{field.icon}</span>
              <span>{field.label}</span>
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
                      : `chip-unselected min-h-11 border-sand/60 ${field.tintClass} text-stone-700`
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

      <div className="space-y-3 border-b border-[#EDE8E0] pb-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.05em] text-[#8B7355]">
            <span aria-hidden="true">🌍</span>
            <span>Specific Ethics</span>
          </h2>
          <span className="text-sm text-stone-400">
            {selections.specificEthics.length} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {ETHICS_OPTIONS.map((option) => {
            const selected = selections.specificEthics.includes(option);

            return (
              <Button
                key={option}
                radius="full"
                variant={selected ? "solid" : "bordered"}
                className={
                  selected
                    ? "chip-selected min-h-11"
                    : "chip-unselected min-h-11 border-sand/60 bg-[#F0F5F0] text-stone-700"
                }
                onPress={() => toggleEthic(option)}
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
