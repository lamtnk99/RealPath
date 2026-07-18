import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, BookOpen, GraduationCap, Compass, Briefcase, Award, CheckCircle, ChevronRight, Lock } from "lucide-react";
import { RoadmapStep, Career } from "../types";

interface RoadmapViewProps {
  roadmap: { steps: RoadmapStep[] } | null;
  targetCareerTitle: string;
  onNavigateToQuiz: () => void;
}

export default function RoadmapView({ roadmap, targetCareerTitle, onNavigateToQuiz }: RoadmapViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Sync with local storage
  useEffect(() => {
    if (targetCareerTitle) {
      const stored = localStorage.getItem(`roadmap-progress-${targetCareerTitle}`);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      } else {
        setCompletedSteps({});
      }
    }
  }, [targetCareerTitle]);

  const toggleStep = (index: number) => {
    const updated = { ...completedSteps, [index]: !completedSteps[index] };
    setCompletedSteps(updated);
    if (targetCareerTitle) {
      localStorage.setItem(`roadmap-progress-${targetCareerTitle}`, JSON.stringify(updated));
    }
  };

  // If no roadmap has been generated yet, show a clean elegant placeholder
  if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) {
    return (
      <div className="min-h-screen bg-white hero-gradient pb-32 px-6 pt-28 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white/90 backdrop-blur-md rounded-[40px] p-10 border border-white/50 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#5B5FEF]/10 flex items-center justify-center text-[#5B5FEF] mx-auto mb-6">
            <Lock className="w-8 h-8 stroke-[2px]" />
          </div>
          
          <h3 className="text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight mb-3">
            Lộ trình đang khóa
          </h3>
          
          <p className="text-sm text-[#1F2937]/50 leading-relaxed mb-8">
            Để tạo ra một lộ trình học tập dạng timeline thực tế phù hợp nhất, hãy thực hiện khảo sát đánh giá AI hoặc lựa chọn trực tiếp từ Trang Xu hướng.
          </p>

          <button
            onClick={onNavigateToQuiz}
            className="pill-btn w-full py-4 bg-[#5B5FEF] text-white font-bold text-sm tracking-wide rounded-full shadow-lg shadow-[#5B5FEF]/20 focus:outline-none"
          >
            Đến Khảo Sát Đánh Giá AI
          </button>
        </div>
      </div>
    );
  }

  // Calculate overall progress stats
  const totalStepsCount = roadmap.steps.length;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const percentageCompleted = Math.round((completedStepsCount / totalStepsCount) * 100) || 0;

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 px-6 pt-28">
      <div className="max-w-4xl mx-auto">
        
        {/* Apple Fitness-style Dashboard Stats Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 border border-white/50 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold tracking-wider text-[#FF8F70] uppercase font-mono bg-[#FF8F70]/10 px-3 py-1 rounded-md">
              Apple Fitness Style
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-[#1F2937] tracking-tight mt-3">
              Lộ trình học tập cá nhân
            </h2>
            <p className="text-sm text-[#1F2937]/60 mt-1">
              May tailor riêng cho vai trò: <strong className="text-[#5B5FEF]">{targetCareerTitle}</strong>
            </p>
          </div>

          {/* Activity Progress ring styled mathematically */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-black/[0.03]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-[#5B5FEF]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 34}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 34 * (1 - percentageCompleted / 100)}` }}
                  transition={{ duration: 0.8 }}
                  strokeLinecap="round"
                 />
              </svg>
              <span className="absolute text-sm font-black text-[#1F2937]">
                {percentageCompleted}%
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">Tiến độ giai đoạn</span>
              <p className="text-2xl font-black text-[#1F2937] mt-0.5">
                {completedStepsCount}/{totalStepsCount} <span className="text-sm font-normal text-[#1F2937]/50">xong</span>
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-[#5B5FEF]/20 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
          
          {roadmap.steps.map((step, idx) => {
            const isCompleted = !!completedSteps[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Timeline Bullet node */}
                <div className={`absolute -left-[45px] md:-left-[57px] top-1 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-[#8EE3C4] border-[#8EE3C4] text-white scale-110 shadow-md shadow-[#8EE3C4]/20" 
                    : "bg-white border-[#5B5FEF] text-[#5B5FEF]"
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Step Card Content */}
                <div className={`card-hover bg-white rounded-[40px] p-6 md:p-10 border border-white/50 shadow-sm transition-all duration-300 ${
                  isCompleted ? "opacity-85 ring-2 ring-[#8EE3C4]/30" : ""
                }`}>
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/[0.03]">
                    <div>
                      <span className="text-xs font-bold text-[#5B5FEF] uppercase tracking-wider font-mono">
                        {step.stage}
                      </span>
                      <h4 className="text-xl md:text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight mt-1">
                        {step.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => toggleStep(idx)}
                      className={`pill-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none shrink-0 ${
                        isCompleted
                          ? "bg-[#8EE3C4]/10 text-[#1F2937] hover:bg-[#8EE3C4]/20"
                          : "bg-gray-50 hover:bg-[#5B5FEF]/5 text-[#1F2937]/70 hover:text-[#5B5FEF]"
                      }`}
                    >
                      {isCompleted ? "✓ Đã hoàn tất" : "Đánh dấu hoàn thành"}
                    </button>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Skills to Learn */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-[#5B5FEF]" />
                        <h5 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">
                          Kỹ năng cần học:
                        </h5>
                      </div>
                      <ul className="space-y-2">
                        {step.skillsToLearn.map((skill, i) => (
                          <li key={i} className="text-sm text-[#1F2937]/70 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8A7FF]" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Projects */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-[#FF8F70]" />
                        <h5 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">
                          Dự án thực tế nên làm:
                        </h5>
                      </div>
                      <ul className="space-y-2">
                        {step.recommendedProjects.map((proj, i) => (
                          <li key={i} className="text-sm text-[#1F2937]/70 flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8F70] mt-1.5 shrink-0" />
                            <span>{proj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Academic Options (Universities / Vocational schools) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <GraduationCap className="w-4.5 h-4.5 text-[#5B5FEF]" />
                        <h6 className="text-xs font-bold text-[#1F2937]/60 uppercase tracking-wider">
                          Đại học phù hợp tại VN:
                        </h6>
                      </div>
                      <ul className="space-y-1 pl-1">
                        {step.colleges.map((uni, i) => (
                          <li key={i} className="text-xs font-medium text-[#1F2937]/70">
                            • {uni}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <GraduationCap className="w-4.5 h-4.5 text-[#FF8F70]" />
                        <h6 className="text-xs font-bold text-[#1F2937]/60 uppercase tracking-wider">
                          Cao đẳng / Học viện thực hành:
                        </h6>
                      </div>
                      <ul className="space-y-1 pl-1">
                        {step.vocationalSchools.map((voc, i) => (
                          <li key={i} className="text-xs font-medium text-[#1F2937]/70">
                            • {voc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Certifications and Pro Tips */}
                  <div className="flex flex-col sm:flex-row justify-between gap-6 border-t border-black/[0.03] pt-6">
                    <div>
                      <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">Chứng chỉ khuyên học</span>
                      <p className="text-xs font-bold text-[#5B5FEF] mt-1">
                        {step.certifications.join(" • ") || "N/A"}
                      </p>
                    </div>

                    <div className="max-w-md sm:text-right">
                      <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">Lời khuyên từ AI</span>
                      <p className="text-xs italic text-[#1F2937]/60 mt-1">
                        "{step.tips}"
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
