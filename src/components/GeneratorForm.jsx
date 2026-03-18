import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FIBER_LIBRARY } from "../constants/fabrics";

const FIBER_FIELD = {
  key: "fiberPreference",
  options: Object.keys(FIBER_LIBRARY),
};

const STYLE_VIBES = [
  { value: "Minimal", label: "Clean & Structured", subtitle: "Sharp lines, no excess" },
  { value: "Earthy", label: "Natural & Grounded", subtitle: "Raw textures, organic shapes" },
  { value: "Romantic", label: "Soft & Flowing", subtitle: "Gathered layers, gentle drape" },
  { value: "Contemporary", label: "Bold & Modern", subtitle: "Unexpected cuts, fashion-forward" },
];

const DESIGN_PRIORITIES = [
  { value: "Breathability", label: "Keeps Me Cool", subtitle: "Light weaves, airflow first" },
  { value: "Durability", label: "Built to Last", subtitle: "Strong construction, timeless" },
  {
    value: "Minimal Environmental Impact",
    label: "Low Impact",
    subtitle: "Certified fibers, clean process",
  },
  { value: "Modest Layering", label: "Full Coverage", subtitle: "Longer lengths, layered styling" },
];

const IMPACT_HINTS = {
  "Organic Hemp": "High Impact / Low Water",
  "Tencel Lyocell": "Bio-engineered / Soft",
  "Recycled Polyester": "Ocean Plastic / Durable",
  "Deadstock Silk": "Luxury Waste / Zero New Resources",
  "Conventional Cotton": "Baseline / High Water Use",
};

function StepSection({ stepNumber, title, isUnlocked, children, hint }) {
  return (
    <AnimatePresence initial={false}>
      {isUnlocked ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            pointerEvents: isUnlocked ? "auto" : "none",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#7C9A7E",
                color: "white",
                fontSize: "0.65rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {stepNumber}
            </span>
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#5C4A32",
                fontWeight: "600",
              }}
            >
              {title}
            </p>
          </div>

          <AnimatePresence>
            {hint ? (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: "0.7rem",
                  color: "#7C9A7E",
                  fontStyle: "italic",
                  marginBottom: "8px",
                }}
              >
                {hint}
              </motion.p>
            ) : null}
          </AnimatePresence>

          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FiberSection({ selections, pulsingFiber, onFiberSelect }) {
  return (
    <div className="fiber-scroll flex flex-row gap-[10px] overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0">
      {FIBER_FIELD.options.map((option) => {
        const selected = selections.fiberPreference === option;
        const fiber = FIBER_LIBRARY[option];

        return (
          <button
            key={option}
            type="button"
            className={
              selected
                ? `fiber-card-button fiber-card-selected inner-card-surface min-w-[140px] max-w-[140px] shrink-0 p-3 text-left [scroll-snap-align:start] sm:min-w-0 sm:max-w-none sm:p-4 ${pulsingFiber === option ? "card-selected-pulse" : ""}`
                : "fiber-card-button fiber-card-unselected inner-card-surface min-w-[140px] max-w-[140px] shrink-0 p-3 text-left [scroll-snap-align:start] sm:min-w-0 sm:max-w-none sm:p-4"
            }
            onClick={() => onFiberSelect(option)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={
                    selected
                      ? "text-[0.85rem] font-semibold text-sage sm:text-[0.95rem]"
                      : "text-[0.85rem] font-semibold text-stone-900 sm:text-[0.95rem]"
                  }
                >
                  {option}
                </p>
                <p
                  className={
                    selected
                      ? "mt-1 text-[0.75rem] italic text-sage/90 sm:text-sm"
                      : "mt-1 text-[0.75rem] italic text-sage sm:text-sm"
                  }
                >
                  {fiber.label}
                </p>
              </div>
              {selected ? (
                <span className="shrink-0 text-sm font-semibold text-sage" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </div>
            <p
              className={
                selected
                  ? "mt-3 text-[0.65rem] font-medium text-stone-600 sm:text-[0.72rem]"
                  : "mt-3 text-[0.65rem] text-stone-500 sm:text-[0.72rem]"
              }
            >
              {IMPACT_HINTS[option]}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function GuidedOptionGrid({ options, selectedValue, onSelect, selectedClassName, tintClass }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-4">
      {options.map((option) => {
        const selected = selectedValue === option.value;

        return (
          <Button
            key={option.value}
            radius="full"
            variant={selected ? "solid" : "bordered"}
            className={
              selected
                ? `${selectedClassName} min-h-[60px] w-full px-4 py-3 text-center sm:w-auto sm:min-w-[180px]`
                : `chip-unselected min-h-[60px] w-full border-sand/60 ${tintClass} px-4 py-3 text-center text-stone-700 sm:w-auto sm:min-w-[180px]`
            }
            onPress={() => onSelect(option.value)}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.8rem] font-medium leading-tight sm:text-[0.9rem]">
                {option.label}
              </span>
              <span className="text-[0.65rem] italic opacity-70">{option.subtitle}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

function PriorityGrid({ selections, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-4">
      {DESIGN_PRIORITIES.map((option) => {
        const selected = selections.designPriorities.includes(option.value);

        return (
          <Button
            key={option.value}
            radius="full"
            variant={selected ? "solid" : "bordered"}
            className={
              selected
                ? "chip-selected chip-selected-priority min-h-[60px] w-full px-4 py-3 text-center sm:w-auto sm:min-w-[180px]"
                : "chip-unselected min-h-[60px] w-full border-sand/60 bg-[#EDF2ED] px-4 py-3 text-center text-stone-700 sm:w-auto sm:min-w-[180px]"
            }
            onPress={() => onToggle(option.value)}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.8rem] font-medium leading-tight sm:text-[0.9rem]">
                {option.label}
              </span>
              <span className="text-[0.65rem] italic opacity-70">{option.subtitle}</span>
            </div>
          </Button>
        );
      })}
    </div>
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
  const [pulsingFiber, setPulsingFiber] = useState("");
  const [unlockedSteps, setUnlockedSteps] = useState([1]);
  const [activeHint, setActiveHint] = useState("");

  const selectedFiber = selections.fiberPreference;
  const selectedStyleVibe = selections.styleVibe;
  const selectedStyleOption = STYLE_VIBES.find((option) => option.value === selectedStyleVibe);

  const shouldPulseGenerate = Boolean(!isLoading && selectedFiber && selectedStyleVibe);

  const hasAnySelection = useMemo(
    () => Boolean(selectedFiber || selectedStyleVibe || selections.designPriorities.length),
    [selectedFiber, selectedStyleVibe, selections.designPriorities.length]
  );

  useEffect(() => {
    if (hasAnySelection) {
      setShowValidationMessage(false);
    }
  }, [hasAnySelection]);

  useEffect(() => {
    if (selectedFiber && !unlockedSteps.includes(2)) {
      const timer = window.setTimeout(() => {
        setUnlockedSteps((prev) => [...prev, 2]);
        setActiveHint("style");
      }, 300);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [selectedFiber, unlockedSteps]);

  useEffect(() => {
    if (selectedStyleVibe && !unlockedSteps.includes(3)) {
      const timer = window.setTimeout(() => {
        setUnlockedSteps((prev) => [...prev, 3]);
        setActiveHint("priorities");
      }, 300);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [selectedStyleVibe, unlockedSteps]);

  useEffect(() => {
    if (unlockedSteps.includes(3) && !unlockedSteps.includes(4)) {
      const timer = window.setTimeout(() => {
        setUnlockedSteps((prev) => [...prev, 4]);
      }, 300);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [unlockedSteps]);

  useEffect(() => {
    if (!activeHint) return undefined;

    const timer = window.setTimeout(() => {
      setActiveHint("");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeHint]);

  useEffect(() => {
    if (!pulsingFiber) return undefined;

    const timer = window.setTimeout(() => {
      setPulsingFiber("");
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pulsingFiber]);

  function updateSelection(key, value) {
    setSelections((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));
  }

  function handleFiberSelect(fiberName) {
    setPulsingFiber(fiberName);
    updateSelection("fiberPreference", fiberName);
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

  const generateLabel = selectedStyleOption
    ? `Generate My ${selectedStyleOption.label} Look`
    : "Generate Outfit";

  return (
    <div className="space-y-2">
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
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
            fontFamily: "'Give You Glory', cursive",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
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
            fontSize: "0.8rem",
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

      <StepSection stepNumber={1} title="Choose your fiber" isUnlocked>
        <FiberSection
          selections={selections}
          pulsingFiber={pulsingFiber}
          onFiberSelect={handleFiberSelect}
        />
      </StepSection>

      <StepSection
        stepNumber={2}
        title="Choose your style"
        isUnlocked={unlockedSteps.includes(2)}
        hint={activeHint === "style" ? "nice choice — now pick your style ✦" : ""}
      >
        <GuidedOptionGrid
          options={STYLE_VIBES}
          selectedValue={selectedStyleVibe}
          onSelect={(value) => updateSelection("styleVibe", value)}
          selectedClassName="chip-selected chip-selected-style"
          tintClass="bg-[#F8F0F0]"
        />
      </StepSection>

      <StepSection
        stepNumber={3}
        title="Set your priorities"
        isUnlocked={unlockedSteps.includes(3)}
        hint={activeHint === "priorities" ? "beautiful — now set what matters most ✦" : ""}
      >
        <PriorityGrid selections={selections} onToggle={togglePriority} />
      </StepSection>

      <AnimatePresence>
        {unlockedSteps.includes(4) ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Button
              size="lg"
              radius="full"
              className={
                isLoading
                  ? "generate-button-loading generate-button-whimsy mt-4 w-full px-6 py-[14px] text-[0.9rem] font-semibold tracking-[0.05em] shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)] sm:mt-6 sm:py-[18px] sm:text-[1rem]"
                  : `generate-button-whimsy mt-4 w-full bg-sage px-6 py-[14px] text-[0.9rem] font-semibold tracking-[0.05em] text-white shadow-[0_18px_40px_-24px_rgba(124,154,126,0.95)] sm:mt-6 sm:py-[18px] sm:text-[1rem] ${shouldPulseGenerate ? "generate-button-pulse generate-button-ready" : ""}`
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
                generateLabel
              )}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showValidationMessage ? (
        <p className="pt-3 font-heading text-sm italic text-sage">
          Select at least one preference to generate your outfit directions.
        </p>
      ) : null}
    </div>
  );
}
