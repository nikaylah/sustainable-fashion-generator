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
                    ? "fiber-card-button inner-card-surface border-2 border-sage bg-[#E4F0E4] p-4 text-left ring-2 ring-sage/30 ring-offset-2 ring-offset-[#f8f5ec]"
                    : "fiber-card-button inner-card-surface border border-stone-200 bg-cream p-4 text-left hover:border-sand/80"
                }
                onClick={() => updateSelection(field.key, option)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={selected ? "text-[0.95rem] font-semibold text-sage" : "text-[0.95rem] font-semibold text-stone-900"}>
                      {option}
                    </p>
                    <p className={selected ? "mt-1 text-sm italic text-sage/90" : "mt-1 text-sm italic text-sage"}>
                      {fiber.label}
                    </p>
                  </div>
                  <span
                    className={
                      selected
                        ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-sm text-white shadow-[0_8px_18px_rgba(124,154,126,0.28)]"
                        : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-transparent"
                    }
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </div>
                <p className={selected ? "mt-3 text-[0.72rem] font-medium text-stone-600" : "mt-3 text-[0.72rem] text-stone-500"}>
                  {IMPACT_HINTS[option]}
                </p>
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
  const shouldPulseGenerate = Boolean(
    !isLoading && selections.fiberPreference && selections.styleVibe
  );

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
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1.15rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#7C9A7E",
            marginBottom: "12px",
          }}
        >
          Step 1 — Choose your foundation
        </p>
        <h1
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
            color: "#3D3027",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          Design with{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "#7C9A7E",
            }}
          >
            Intent
          </span>
          .
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#8B7355",
            maxWidth: "420px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Most fashion starts with a trend. Yours starts with a <strong>value</strong>.
          Select your material and vibe to generate a garment designed for a sustainable
          future.
        </p>
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
            ? "generate-button-loading generate-button-whimsy mt-6 w-full px-6 py-[18px] text-[1rem] font-semibold tracking-[0.05em] shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)]"
            : `generate-button-whimsy mt-6 w-full bg-sage px-6 py-[18px] text-[1rem] font-semibold tracking-[0.05em] text-white shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)] ${shouldPulseGenerate ? "generate-button-pulse" : ""}`
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
