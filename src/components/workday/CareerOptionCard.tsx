import React from "react";
import { Cpu, Palette, FileText, TrendingUp, Users, ArrowRight, Play, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { WorkdayCareer, WorkdayExperience } from "../../types";

interface CareerOptionCardProps {
  career: WorkdayCareer;
  experience?: WorkdayExperience;
  onSelect: (careerId: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu: Cpu,
  Palette: Palette,
  FileText: FileText,
  TrendingUp: TrendingUp,
  Users: Users
};

export default function CareerOptionCard({ career, experience, onSelect }: CareerOptionCardProps) {
  const Icon = ICON_MAP[career.iconName] || Cpu;
  const status = experience?.status || "not_started";

  let statusLabel = "Chơi thử 1 ngày";
  let StatusIcon = Play;
  if (status === "in_progress") {
    statusLabel = "Tiếp tục";
    StatusIcon = ArrowRight;
  } else if (status === "completed") {
    statusLabel = "Xem lại · Chơi lại";
    StatusIcon = RotateCcw;
  }

  return (
    <button
      onClick={() => onSelect(career.id)}
      className={`group relative w-full h-[155px] md:h-[165px] rounded-3xl p-4 md:p-5 flex flex-col justify-between text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:ring-offset-2 border ${career.bgColorClass} active:scale-[0.98] min-h-[44px] min-w-[44px]`}
      aria-label={`${career.title} - Trạng thái: ${statusLabel}`}
    >
      {/* Top row: Icon & Status badge */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 stroke-[2.2px]" aria-hidden="true" />
        </div>

        {status === "completed" ? (
          <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
            Đã xong
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-white/60 backdrop-blur-xs text-[#5B5FEF] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#5B5FEF]/20">
            <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
            AI Studio
          </span>
        )}
      </div>

      {/* Center: Career Title */}
      <div className="my-auto">
        <h3 className="font-sans font-extrabold text-sm md:text-base text-gray-900 leading-snug tracking-tight">
          {career.title}
        </h3>
      </div>

      {/* Bottom: Status Line */}
      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[11px] font-mono font-bold text-gray-700">
        <span>{statusLabel}</span>
        <StatusIcon className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}
