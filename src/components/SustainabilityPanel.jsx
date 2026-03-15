import { useEffect, useState } from "react";
import { FIBER_LIBRARY, calculateScore } from "../constants/fabrics";

const BAR_COLORS = {
  Carbon: "#7C9A7E",
  Water: "#89B4C4",
  Ethics: "#C4A882",
};

export default function SustainabilityPanel({ selectedFiber, sustainabilityHighlight }) {
  const fiberData = FIBER_LIBRARY[selectedFiber];
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timeout = window.setTimeout(() => setAnimated(true), 100);
    return () => window.clearTimeout(timeout);
  }, [selectedFiber]);

  if (!fiberData) return null;

  const totalScore = calculateScore(fiberData);
  const maxScore = 100;
  const metrics = [
    { label: "Carbon", value: fiberData.carbon },
    { label: "Water", value: fiberData.water },
    { label: "Ethics", value: fiberData.ethical },
  ];

  return (
    <section className="mt-6 rounded-[12px] bg-[#F5F0E8] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sage">
        Sustainability Score
      </p>

      <div className="mt-4 text-center">
        <div className="flex items-end justify-center gap-1 text-stone-900">
          <span className="font-heading text-[2.5rem] leading-none">{totalScore}</span>
          <span className="pb-1 text-sm text-stone-500">/{maxScore}</span>
        </div>
        <p className="mt-2 text-sm italic text-sage">{fiberData.label}</p>
      </div>

      <div className="mt-6 space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="grid grid-cols-[8ch_1fr_auto] items-center gap-3">
            <p className="text-sm text-stone-700">{metric.label}</p>
            <div className="h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full transition-[width] duration-[800ms] ease-[ease]"
                style={{
                  width: animated ? `${(metric.value / 10) * 100}%` : "0%",
                  backgroundColor: BAR_COLORS[metric.label],
                }}
              />
            </div>
            <p className="text-sm text-stone-600">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[12px] border-l-[3px] border-sage bg-[#EEF5EE] px-4 py-3">
        <p className="text-[0.85rem] italic text-stone-700">
          <span className="mr-2">🌿</span>
          {sustainabilityHighlight}
        </p>
      </div>

      <p className="mt-4 text-sm italic text-stone-500">{fiberData.description}</p>
    </section>
  );
}
