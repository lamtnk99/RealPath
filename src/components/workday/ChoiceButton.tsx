import React from "react";
import { SimulationChoice } from "../../types";
import { Check } from "lucide-react";

interface ChoiceButtonProps {
  key?: string | number;
  choice: SimulationChoice;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (choice: SimulationChoice) => void;
}

export default function ChoiceButton({ choice, isSelected, isLocked, onSelect }: ChoiceButtonProps) {
  return (
    <button
      onClick={() => onSelect(choice)}
      disabled={isLocked}
      aria-pressed={isSelected}
      className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:ring-offset-1 min-h-[44px] ${
        isSelected
          ? "border-[#5B5FEF] bg-[#5B5FEF]/5 shadow-sm"
          : isLocked
          ? "border-black/[0.03] bg-gray-50/60 text-gray-400 cursor-not-allowed opacity-70"
          : "border-black/[0.04] bg-white hover:border-[#5B5FEF]/50 hover:bg-[#5B5FEF]/5 shadow-sm active:scale-[0.99]"
      }`}
    >
      {/* Choice ID Badge (A, B, C) */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs transition-colors ${
          isSelected
            ? "bg-[#5B5FEF] text-white"
            : "bg-black/[0.05] text-[#1F2937]/70 group-hover:bg-[#5B5FEF]/20 group-hover:text-[#5B5FEF]"
        }`}
        aria-hidden="true"
      >
        {choice.id}
      </div>

      {/* Choice Label */}
      <div className="flex-grow pt-0.5">
        <p
          className={`text-xs md:text-sm font-bold leading-relaxed ${
            isSelected
              ? "text-[#5B5FEF]"
              : isLocked
              ? "text-gray-500"
              : "text-[#1F2937] group-hover:text-[#5B5FEF]"
          }`}
        >
          {choice.label}
        </p>
      </div>

      {/* Check Icon if selected */}
      {isSelected && (
        <div className="w-5 h-5 rounded-full bg-[#5B5FEF] text-white flex items-center justify-center shrink-0 self-center">
          <Check className="w-3.5 h-3.5 stroke-[3px]" aria-hidden="true" />
        </div>
      )}
    </button>
  );
}
