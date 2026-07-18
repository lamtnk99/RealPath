import React from "react";
import { ArrowLeft, Cpu, Palette, FileText, TrendingUp, Users } from "lucide-react";
import { WorkdayCareer } from "../../types";

interface SimulationHeaderProps {
  career: WorkdayCareer;
  currentScenarioIndex: number;
  totalScenarios: number;
  onBackToPicker: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu: Cpu,
  Palette: Palette,
  FileText: FileText,
  TrendingUp: TrendingUp,
  Users: Users
};

export default function SimulationHeader({
  career,
  currentScenarioIndex,
  totalScenarios,
  onBackToPicker
}: SimulationHeaderProps) {
  const Icon = ICON_MAP[career.iconName] || Cpu;

  return (
    <div className="space-y-4 border-b border-black/[0.04] pb-5">
      {/* Back Button & Progress Badge */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToPicker}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F2937]/70 hover:text-[#5B5FEF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] rounded-lg px-2.5 py-1.5 min-h-[44px]"
          aria-label="Quay lại chọn nghề khác"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Chọn nghề khác</span>
        </button>

        <span className="inline-flex items-center gap-1.5 bg-[#5B5FEF]/10 text-[#5B5FEF] px-3 py-1 rounded-full text-xs font-mono font-bold">
          <span>Tình huống {currentScenarioIndex + 1}/{totalScenarios}</span>
        </span>
      </div>

      {/* Career Title & Icon */}
      <div className="flex items-start gap-3.5 pt-1">
        <div className="w-11 h-11 rounded-2xl bg-white border border-black/[0.05] shadow-sm flex items-center justify-center shrink-0 text-[#5B5FEF]">
          <Icon className="w-6 h-6 stroke-[2.2px]" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight">
            {career.title}
          </h2>
          <p className="text-xs md:text-sm text-[#1F2937]/70 leading-relaxed max-w-2xl">
            {career.intro}
          </p>
        </div>
      </div>
    </div>
  );
}
