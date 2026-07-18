import React from "react";
import { WorkdayAnalysis, WorkdayCareer } from "../../types";
import { Sparkles, Compass, Clock, RefreshCw, Grid, BookmarkPlus, Info } from "lucide-react";

interface WorkdayResultProps {
  career: WorkdayCareer;
  analysis: WorkdayAnalysis;
  onReplay: () => void;
  onSelectOtherCareer: () => void;
  onSaveToCareerJigsaw?: () => void;
}

export default function WorkdayResult({
  career,
  analysis,
  onReplay,
  onSelectOtherCareer,
  onSaveToCareerJigsaw
}: WorkdayResultProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeIn py-4">
      {/* Main Title Section */}
      <div className="text-center space-y-2 border-b border-black/[0.04] pb-6">
        <div className="inline-flex items-center gap-1.5 bg-[#5B5FEF]/10 text-[#5B5FEF] px-3.5 py-1 rounded-full text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tổng kết mô phỏng {career.title}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1F2937] tracking-tight">
          Một vài điều từ ngày làm việc này
        </h2>

        {analysis.summary && (
          <p className="text-xs md:text-sm text-[#1F2937]/70 leading-relaxed max-w-lg mx-auto">
            {analysis.summary}
          </p>
        )}
      </div>

      {/* 1. Cách bạn thường tiếp cận công việc (Max 3 Observations) */}
      {analysis.observations && analysis.observations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-[#5B5FEF] uppercase tracking-wider flex items-center gap-2">
            <span>📌</span>
            <span>Cách bạn thường tiếp cận công việc</span>
          </h3>

          <div className="space-y-3">
            {analysis.observations.slice(0, 3).map((obs, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 md:p-5 border border-black/[0.05] shadow-sm space-y-2"
              >
                <h4 className="font-extrabold text-sm md:text-base text-[#1F2937]">
                  {obs.title}
                </h4>
                <p className="text-xs md:text-sm text-[#5B5FEF] font-mono italic">
                  🔍 {obs.evidence}
                </p>
                {obs.caveat && (
                  <p className="text-xs text-[#1F2937]/70 leading-relaxed bg-[#FAF7F2] p-2.5 rounded-xl border border-black/[0.02]">
                    ⚖️ {obs.caveat}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Điều bạn có thể thấy hứng thú (Max 3 Interest Signals) */}
      {analysis.interestSignals && analysis.interestSignals.length > 3 && (
        // Enforce max 3
        null
      )}
      {analysis.interestSignals && analysis.interestSignals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-[#5B5FEF] uppercase tracking-wider flex items-center gap-2">
            <span>💡</span>
            <span>Điều bạn có thể thấy hứng thú</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {analysis.interestSignals.slice(0, 3).map((sig, idx) => (
              <div
                key={idx}
                className="bg-[#5B5FEF]/5 rounded-2xl p-4 border border-[#5B5FEF]/10 space-y-1"
              >
                <h4 className="font-extrabold text-xs md:text-sm text-[#5B5FEF]">
                  {sig.name}
                </h4>
                <p className="text-xs text-[#1F2937]/80 leading-relaxed">
                  {sig.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Điều nên thử thêm (Small Experiment 30-90 mins) */}
      {analysis.smallExperiment && (
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-[#5B5FEF] uppercase tracking-wider flex items-center gap-2">
            <span>🧪</span>
            <span>Điều nên thử thêm</span>
          </h3>

          <div className="bg-[#FAF7F2] rounded-3xl p-5 md:p-6 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm md:text-base text-[#1F2937]">
                {analysis.smallExperiment.title}
              </h4>
              <span className="inline-flex items-center gap-1 bg-[#FF8F70]/10 text-[#FF8F70] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {analysis.smallExperiment.estimatedTime || "30–90 phút"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#1F2937]/80 leading-relaxed">
              {analysis.smallExperiment.description}
            </p>
          </div>
        </div>
      )}

      {/* 4. Kết luận mở (Disclaimer) */}
      <div className="bg-white/80 rounded-2xl p-4 border border-gray-200 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-gray-500">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-bold uppercase">Ghi chú hướng nghiệp</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {analysis.disclaimer || "Ba tình huống mô phỏng chưa đủ để kết luận bạn có phù hợp với nghề này hay không. Hãy xem đây là những dấu hiệu để tiếp tục khám phá."}
        </p>
      </div>

      {/* Bottom Action Buttons: 3 buttons */}
      <div className="pt-4 space-y-3 border-t border-black/[0.04]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Replay */}
          <button
            onClick={onReplay}
            className="pill-btn py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Thử lại nghề này</span>
          </button>

          {/* Select Other Career */}
          <button
            onClick={onSelectOtherCareer}
            className="pill-btn py-3 px-4 bg-[#5B5FEF] hover:bg-[#5B5FEF]/90 text-white rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] shadow-md shadow-[#5B5FEF]/20 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Chọn nghề khác</span>
          </button>

          {/* Save to Career Jigsaw */}
          {onSaveToCareerJigsaw && (
            <button
              onClick={onSaveToCareerJigsaw}
              className="pill-btn py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-[#5B5FEF] border border-indigo-200 rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
            >
              <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Lưu vào bản ghép</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
