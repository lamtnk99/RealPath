import React from "react";
import { SimulationChoice } from "../../types";
import { ArrowRight, Lightbulb, AlertCircle } from "lucide-react";

interface ChoiceFeedbackProps {
  choice: SimulationChoice;
  isLastScenario: boolean;
  onNextScenario: () => void;
}

export default function ChoiceFeedback({ choice, isLastScenario, onNextScenario }: ChoiceFeedbackProps) {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-[#5B5FEF]/20 shadow-md space-y-4 animate-fadeIn">
      {/* Feedback Header */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5B5FEF] uppercase tracking-wider">
        <Lightbulb className="w-4 h-4 text-[#5B5FEF]" aria-hidden="true" />
        <span>Phản hồi tình huống</span>
      </div>

      {/* Outcome & Consideration grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
        {/* Outcome */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl space-y-1.5 border border-black/[0.03]">
          <span className="font-extrabold text-[#1F2937] block flex items-center gap-1.5">
            <span>✨ Điều có thể xảy ra</span>
          </span>
          <p className="text-[#1F2937]/80 leading-relaxed">
            {choice.outcome}
          </p>
        </div>

        {/* Consideration */}
        <div className="bg-[#5B5FEF]/5 p-4 rounded-2xl space-y-1.5 border border-[#5B5FEF]/10">
          <span className="font-extrabold text-[#5B5FEF] block flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>⚖️ Điều cần cân nhắc</span>
          </span>
          <p className="text-[#1F2937]/80 leading-relaxed">
            {choice.consideration}
          </p>
        </div>
      </div>

      {/* Next Action CTA Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onNextScenario}
          className="pill-btn px-6 py-3 bg-[#5B5FEF] hover:bg-[#5B5FEF]/90 text-white font-bold text-xs md:text-sm rounded-full shadow-md shadow-[#5B5FEF]/20 focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:ring-offset-2 flex items-center gap-2"
        >
          <span>{isLastScenario ? "Xem kết quả ngày làm việc" : "Tình huống tiếp theo"}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
