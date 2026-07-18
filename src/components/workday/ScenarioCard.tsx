import React, { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { WorkdayScenario } from "../../types";

interface ScenarioCardProps {
  scenario: WorkdayScenario;
  index: number;
}

export default function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Auto-focus scenario title when scenario changes for keyboard / screen reader accessibility
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [scenario.id]);

  return (
    <div
      className="bg-[#FAF7F2]/80 rounded-3xl p-5 md:p-7 border border-black/[0.04] space-y-3 shadow-sm"
      aria-live="polite"
    >
      {/* Time Tag */}
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF8F70] bg-[#FF8F70]/10 px-3 py-1 rounded-full w-fit">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{scenario.time}</span>
      </div>

      {/* Scenario Title & Description */}
      <div className="space-y-1.5">
        <h3
          ref={titleRef}
          tabIndex={-1}
          className="text-lg md:text-xl font-sans font-extrabold text-[#1F2937] leading-snug outline-none"
        >
          {scenario.title}
        </h3>
        <p className="text-sm md:text-base text-[#1F2937]/80 leading-relaxed">
          {scenario.description}
        </p>
      </div>
    </div>
  );
}
