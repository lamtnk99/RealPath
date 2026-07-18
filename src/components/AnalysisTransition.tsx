import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, Cpu, ShieldAlert, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Bóc tách câu trả lời khảo sát và nhóm sở thích...",
  "Đánh giá quyết định xử lý sự cố trong mini-game...",
  "So khớp năng lực với hơn 100+ xu hướng tuyển dụng tại Việt Nam...",
  "Đo lường khoảng trống kỹ năng hiện tại của bạn...",
  "Tổng hợp báo cáo định hướng & may đo lộ trình sự nghiệp tương lai..."
];

export default function AnalysisTransition() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center relative">
        {/* Glowing Background Light blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-radial from-[#5B5FEF]/20 to-transparent blur-[80px] pointer-events-none" />

        {/* Outer Circular Pulse Spinner */}
        <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-[#5B5FEF] opacity-40"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute w-32 h-32 rounded-full bg-white/60 border border-black/[0.03] shadow-[0_10px_30px_rgba(91,95,239,0.1)] flex items-center justify-center backdrop-blur-md"
          >
            <Brain className="w-12 h-12 text-[#5B5FEF] animate-pulse" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1F2937] tracking-tight mb-4">
          AI đang phân tích <br />
          năng lực của bạn...
        </h3>
        
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#5B5FEF] mb-10 inline-flex items-center gap-1.5 bg-[#5B5FEF]/10 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          Động cơ RealPath AI
        </p>

        {/* Dynamic Status Progress steps */}
        <div className="bg-white rounded-[2rem] p-6 border border-black/[0.02] shadow-[0_10px_30px_rgba(0,0,0,0.01)] text-left min-h-32">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isUpcoming = idx > currentStep;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 py-1.5 transition-all duration-500 ${
                  isActive 
                    ? "opacity-100 scale-100 font-semibold text-[#1F2937]" 
                    : isCompleted 
                    ? "opacity-50 text-[#5B5FEF]" 
                    : "opacity-20 text-[#1F2937]"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#8EE3C4] shrink-0 mt-0.5" />
                ) : isActive ? (
                  <Cpu className="w-4 h-4 text-[#5B5FEF] shrink-0 mt-0.5 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#1F2937]/30 shrink-0 mt-0.5" />
                )}
                <span className="text-xs md:text-sm leading-relaxed">{step}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-xs text-[#1F2937]/40">
          Quá trình này diễn ra hoàn toàn bảo mật bằng mô hình ngôn ngữ lớn.
        </div>
      </div>
    </div>
  );
}
