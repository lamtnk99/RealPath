import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ChevronRight, CheckCircle2, X, Compass, Activity, ArrowRight, RotateCcw } from "lucide-react";
import { SimulatedStep } from "../types";

interface SimulatedWorkdayViewProps {
  industryId: string;
  industryName: string;
  steps: SimulatedStep[];
  onClose: () => void;
}

export default function SimulatedWorkdayView({
  industryName,
  steps,
  onClose
}: SimulatedWorkdayViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleSelectOption = (option: { text: string; insight: string }) => {
    const updatedChoices = [...choices, option.insight];
    setChoices(updatedChoices);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-xl overflow-hidden relative"
      >
        {/* Header decoration bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400" />

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-4 h-4" />
        </motion.button>

        <div className="p-6 md:p-9">
          {!finished ? (
            <div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-indigo-100">
                  <Compass className="w-3.5 h-3.5" />
                  Ngày làm việc mô phỏng
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Tình huống {currentStepIndex + 1} / {steps.length}
                </span>
              </div>

              {/* Title & Clock */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl md:text-2xl font-sans font-extrabold text-slate-800 tracking-tight">
                  {industryName}
                </h3>
                <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full text-xs font-mono font-bold border border-rose-100">
                  <Clock className="w-3.5 h-3.5" />
                  {currentStep.time}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-1.5 mb-6">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? "bg-indigo-600 shadow-2xs"
                        : idx < currentStepIndex
                        ? "bg-indigo-200"
                        : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>

              {/* Scenario card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 md:p-6 mb-6 shadow-2xs"
                >
                  <p className="text-sm md:text-base text-slate-800 leading-relaxed font-semibold">
                    {currentStep.scenario}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Decision options */}
              <div className="space-y-3">
                {currentStep.options.map((opt, oIdx) => (
                  <motion.button
                    key={oIdx}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 shadow-2xs transition-all duration-200 flex items-start gap-3.5 group focus:outline-none cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 font-extrabold text-xs">
                      {oIdx === 0 ? "A" : "B"}
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs md:text-sm font-semibold text-slate-800 leading-relaxed">
                        {opt.text}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all self-center" />
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5px]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl md:text-2xl font-sans font-extrabold text-slate-800 tracking-tight">
                  Hoàn thành ngày mô phỏng!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                  Bạn đã hoàn thành trải nghiệm một ngày làm việc với vai trò <strong className="text-slate-800">{industryName}</strong>. Hãy xem lại những điểm nổi bật bạn đã bộc lộ:
                </p>
              </div>

              {/* Insights tag list */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto py-2">
                {choices.map((insight, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wide shadow-2xs"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    {insight}
                  </span>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-md shadow-indigo-600/20 focus:outline-none cursor-pointer"
                >
                  Trở lại Trang chủ
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
