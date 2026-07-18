import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Star,
  Award,
  ChevronRight,
  Bookmark,
  Compass,
  Cpu,
  MapPin,
  Brain,
  Zap,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { AssessmentResult, Career } from "../types";
import localJobsData from "../../data/localJobsData.json";

// Helper function to map careers to stunning modern Unsplash illustrations
function getCareerImage(title: string, category: string): string {
  const normalizedTitle = (title || "").toLowerCase();
  const normalizedCategory = (category || "").toLowerCase();

  if (
    normalizedTitle.includes("designer") ||
    normalizedTitle.includes("thiết kế") ||
    normalizedTitle.includes("ui/ux") ||
    normalizedTitle.includes("art director")
  ) {
    return "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("ai engineer") ||
    normalizedTitle.includes("kỹ sư ai") ||
    normalizedTitle.includes("machine learning") ||
    normalizedTitle.includes("trí tuệ nhân tạo")
  ) {
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("software") ||
    normalizedTitle.includes("engineer") ||
    normalizedTitle.includes("developer") ||
    normalizedTitle.includes("lập trình") ||
    normalizedTitle.includes("kỹ sư phần mềm") ||
    normalizedTitle.includes("coder")
  ) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("cybersecurity") ||
    normalizedTitle.includes("an ninh mạng") ||
    normalizedTitle.includes("bảo mật")
  ) {
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("analyst") ||
    normalizedTitle.includes("phân tích dữ liệu") ||
    normalizedTitle.includes("data analyst") ||
    normalizedTitle.includes("khoa học dữ liệu")
  ) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("marketing") ||
    normalizedTitle.includes("tiếp thị") ||
    normalizedTitle.includes("strategist") ||
    normalizedTitle.includes("truyền thông") ||
    normalizedTitle.includes("content")
  ) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("business") ||
    normalizedTitle.includes("kinh doanh") ||
    normalizedTitle.includes("quản lý") ||
    normalizedTitle.includes("manager") ||
    normalizedTitle.includes("phát triển")
  ) {
    return "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedTitle.includes("commerce") ||
    normalizedTitle.includes("thương mại điện tử") ||
    normalizedTitle.includes("e-commerce")
  ) {
    return "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80";
  }

  if (
    normalizedCategory.includes("công nghệ") ||
    normalizedCategory.includes("kỹ thuật") ||
    normalizedCategory.includes("tech")
  ) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedCategory.includes("thiết kế") ||
    normalizedCategory.includes("nghệ thuật") ||
    normalizedCategory.includes("sáng tạo") ||
    normalizedCategory.includes("design")
  ) {
    return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80";
  }
  if (
    normalizedCategory.includes("kinh doanh") ||
    normalizedCategory.includes("quản trị") ||
    normalizedCategory.includes("marketing") ||
    normalizedCategory.includes("tiếp thị")
  ) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
}

interface ResultsViewProps {
  result: AssessmentResult;
  onGenerateRoadmap: (careerTitle: string, skills: string[]) => void;
  isLoadingRoadmap: boolean;
  onSaveCareer: (career: Career) => void;
  savedCareers: string[];
  onRestartAssessment?: () => void;
}

export default function ResultsView({
  result,
  onGenerateRoadmap,
  isLoadingRoadmap,
  onSaveCareer,
  savedCareers,
  onRestartAssessment
}: ResultsViewProps) {
  const [expandedCareers, setExpandedCareers] = React.useState<Record<string, boolean>>({});
  const [loadingCareerTitle, setLoadingCareerTitle] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoadingRoadmap) {
      setLoadingCareerTitle(null);
    }
  }, [isLoadingRoadmap]);

  const {
    targetDomain,
    domainShortageReason,
    careerOptions = [],
    primaryCareer,
    topCareers = [],
    strengths = [],
    thinkingStyles = [],
    skillGaps = [],
    naturalLanguageExplanation,
    beginnerFriendlyAnalysis,
    strategicPreferenceAdvice,
    riskAnalysis,
    matchedJobs = []
  } = result;

  const resolvedPrimary = primaryCareer || careerOptions[0];
  const resolvedTopCareers = topCareers.length > 0 ? topCareers : careerOptions.slice(1);
  const domainName = targetDomain || resolvedPrimary?.category || "Lĩnh vực phù hợp";
  const allRecommendedCareers = [resolvedPrimary, ...resolvedTopCareers].filter(Boolean).slice(0, 3);

  // Score and filter jobs for a specific career title and skills
  const getRelevantJobsForCareer = (careerTitle: string, careerCategory: string, careerSkills: string[], usedIds: Set<string>) => {
    const titleLower = careerTitle.toLowerCase();
    const catLower = careerCategory.toLowerCase();
    const skillsLower = (careerSkills || []).map(s => s.toLowerCase());

    // Use localJobsData directly as the database of all jobs
    const sourceJobs = localJobsData as any[];

    const scored = sourceJobs.map(job => {
      const jobTitle = (job.jobTitle || "").toLowerCase();
      const jobCat = (job.category || "").toLowerCase();
      const jobSkills = (job.skillsRequired || []).map((s: string) => s.toLowerCase());
      
      let score = 0;

      // Direct title match
      if (jobTitle.includes(titleLower) || titleLower.includes(jobTitle)) {
        score += 15;
      }

      // Keyword matches
      const titleWords = titleLower.split(/[\s\/()\-]+/).filter(w => w.length > 2);
      for (const word of titleWords) {
        if (jobTitle.includes(word)) score += 4;
        if (jobCat.includes(word)) score += 1;
      }

      // Category matches
      if (jobCat.includes(catLower) || catLower.includes(jobCat)) {
        score += 2;
      }

      // Skill matches
      for (const skill of skillsLower) {
        if (jobTitle.includes(skill)) score += 4;
        const skillWords = skill.split(/[\s\/()\-]+/).filter(w => w.length > 2);
        for (const sw of skillWords) {
          if (jobTitle.includes(sw)) score += 2;
          for (const js of jobSkills) {
            if (js.includes(sw)) {
              score += 2;
            }
          }
        }
      }

      return { job, score };
    });

    // Filter out already used jobs, sort by score descending
    const filteredAndSorted = scored
      .filter(item => !usedIds.has(item.job.id) && item.score > 0)
      .sort((a, b) => b.score - a.score);

    // If nothing matched, take any unused job from the same category as fallback
    if (filteredAndSorted.length === 0) {
      const fallback = sourceJobs.filter(job => !usedIds.has(job.id) && (
        job.category.toLowerCase().includes(catLower) || 
        catLower.includes(job.category.toLowerCase()) ||
        catLower.split("&")[0].trim().includes(job.category.toLowerCase().split("&")[0].trim())
      ));
      if (fallback.length > 0) {
        return fallback.slice(0, 2);
      }
      // Absolute fallback if category also has zero match
      return sourceJobs.filter(job => !usedIds.has(job.id)).slice(0, 2);
    }

    return filteredAndSorted.slice(0, 2).map(item => item.job);
  };

  const usedJobIds = new Set<string>();

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 px-4 pt-28">
      <div className="max-w-[1440px] mx-auto">

        {/* Restart Assessment Button */}
        {onRestartAssessment && (
          <div className="flex justify-end mb-6">
            <button
              onClick={onRestartAssessment}
              className="pill-btn px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Khảo sát lại
            </button>
          </div>
        )}

        {/* Congratulations Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 bg-[#8EE3C4]/20 text-[#1F2937] px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8EE3C4] fill-current" />
            KẾT QUẢ KHẢO SÁT
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-[#1F2937] tracking-tight">
            {domainName}
          </h2>
          <p className="text-sm text-[#1F2937]/50 mt-2 max-w-lg mx-auto">
            {domainShortageReason || "Khám phá kết quả đo lường năng lực và đề xuất nghề nghiệp cá nhân hóa."}
          </p>
        </div>

        {/* 3 EQUAL RECOMMENDATIONS (TOP ALTERNATIVES / SECTOR MAJORS) */}
        {allRecommendedCareers.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-4">
              <span className="text-[10px] font-bold text-[#5B5FEF] bg-[#5B5FEF]/10 px-4 py-1.5 rounded-full uppercase tracking-widest font-mono">
                Đề xuất theo Lĩnh vực: {domainName}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {allRecommendedCareers.map((career) => {
                const desc = career.whyRecommended || career.matchReason;
                const isExpanded = expandedCareers[career.title];
                const displayDesc = isExpanded ? desc : (desc.length > 150 ? desc.slice(0, 150) + "..." : desc);

                const cardJobs = getRelevantJobsForCareer(
                  career.title,
                  career.category,
                  career.skillsRequired || [],
                  usedJobIds
                );
                cardJobs.forEach(j => usedJobIds.add(j.id));

                return (
                  <div
                    key={career.title}
                    className="bg-white rounded-[32px] p-6 border border-slate-100 hover:border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-all duration-300"
                  >
                    <div>
                      {/* Career Banner Image */}
                      <div className="w-full h-40 rounded-2xl overflow-hidden mb-5 relative border border-black/[0.04]">
                        <img
                          src={getCareerImage(career.title, career.category)}
                          alt={career.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                          <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                            {career.category}
                          </span>
                        </div>

                        <button
                          onClick={() => onSaveCareer(career)}
                          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF8F70] rounded-full shadow-xs transition-colors cursor-pointer"
                          title="Lưu nghề nghiệp"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${savedCareers.includes(career.title) ? "fill-[#FF8F70] text-[#FF8F70]" : ""}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#FF8F70]">
                          💰 {career.salaryRange}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          Nhu cầu: {career.jobDemand}
                        </span>
                      </div>

                      <h4 className="text-xl md:text-2xl font-extrabold text-[#1F2937] tracking-tight mb-3">
                        {career.title}
                      </h4>

                      <p className="text-sm text-[#1F2937]/75 leading-relaxed mb-1">
                        {displayDesc}
                      </p>

                      {desc.length > 150 && (
                        <button
                          onClick={() => setExpandedCareers(prev => ({ ...prev, [career.title]: !prev[career.title] }))}
                          className="text-xs font-bold text-[#5B5FEF] hover:underline mb-4 cursor-pointer focus:outline-none"
                        >
                          {isExpanded ? "Thu gọn" : "Xem thêm"}
                        </button>
                      )}

                      {/* Skills Required */}
                      <div className="mb-4 mt-2">
                        <p className="text-xs font-bold text-[#1F2937]/45 uppercase tracking-widest font-mono mb-2">
                          Kỹ năng cần tập trung:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {career.skillsRequired.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                          {career.skillsRequired.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                              +{career.skillsRequired.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Matched local jobs */}
                      {cardJobs && cardJobs.length > 0 && (
                        <div className="mt-5 pt-5 border-t border-slate-100">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono mb-3">
                            🏢 Tuyển dụng thực tế tại Việt Nam:
                          </h5>
                          <div className="space-y-3">
                            {cardJobs.map((job) => (
                              <a
                                key={job.id}
                                href={job.contactLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 shadow-2xs hover:border-slate-300 transition-all group/job"
                              >
                                <div className="flex justify-between items-start gap-1">
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 group-hover/job:text-[#5B5FEF] transition-colors line-clamp-1">
                                      {job.jobTitle}
                                    </p>
                                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                      {job.companyName}
                                    </p>
                                  </div>
                                  {job.preferenceTag && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm shrink-0">
                                      {job.preferenceTag}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
                                  <span>📍 {job.city}</span>
                                  <span className="font-semibold text-slate-650">💰 {job.salaryRange}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setLoadingCareerTitle(career.title);
                          onGenerateRoadmap(career.title, career.skillsRequired);
                        }}
                        disabled={isLoadingRoadmap}
                        className="w-full py-3 bg-[#5B5FEF] hover:bg-[#4A4BCE] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingRoadmap && loadingCareerTitle === career.title ? (
                          <>
                            <Cpu className="w-3.5 h-3.5 animate-spin" />
                            Đang thiết kế lộ trình...
                          </>
                        ) : (
                          <>
                            Tạo lộ trình học tập
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. DETAILED AI OBSERVATIONS (BEGINNER-FRIENDLY BEHAVIORAL ANALYSIS & STRATEGIC PREFERENCE GUIDANCE) */}
        {(beginnerFriendlyAnalysis || strategicPreferenceAdvice) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {beginnerFriendlyAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 border border-blue-100 bg-blue-50/10 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-base">
                  <Brain className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Đánh giá từ RealPath AI (Người mới)</span>
                </div>
                <p className="text-xs md:text-sm text-blue-900/80 leading-relaxed font-normal">
                  {beginnerFriendlyAnalysis}
                </p>
              </motion.div>
            )}

            {strategicPreferenceAdvice && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 border border-purple-100 bg-purple-50/10 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
                  <Zap className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Lời khuyên chiến lược & Đánh đổi</span>
                </div>
                <p className="text-xs md:text-sm text-purple-900/80 leading-relaxed font-normal">
                  {strategicPreferenceAdvice}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* 4. CORE METRICS GRID (STRENGTHS, STYLE, GAPS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Strengths Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-white/50 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
              <Award className="w-5 h-5 text-[#8EE3C4]" />
              <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight">Điểm mạnh cốt lõi</h4>
            </div>

            <div className="space-y-4">
              {strengths.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-black/[0.01] hover:border-[#8EE3C4]/20 transition-all space-y-1.5">
                  <h5 className="font-extrabold text-[#1F2937] text-xs tracking-tight">{item.name}</h5>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Dẫn chứng:</strong> {item.evidence}</p>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Phân tích:</strong> {item.analysis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Thinking Styles Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-white/50 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
              <Compass className="w-5 h-5 text-[#5B5FEF]" />
              <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight">Phong cách tư duy</h4>
            </div>

            <div className="space-y-4">
              {thinkingStyles.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-black/[0.01] hover:border-[#5B5FEF]/20 transition-all space-y-1.5">
                  <h5 className="font-extrabold text-[#1F2937] text-xs tracking-tight">{item.name}</h5>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Dẫn chứng:</strong> {item.evidence}</p>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Phân tích:</strong> {item.analysis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-white/50 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
              <Star className="w-5 h-5 text-[#FF8F70]" />
              <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight">Khoảng trống phát triển</h4>
            </div>

            <div className="space-y-4">
              {skillGaps.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-black/[0.01] hover:border-[#FF8F70]/20 transition-all space-y-1.5">
                  <h5 className="font-extrabold text-[#1F2937] text-xs tracking-tight">{item.name}</h5>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Cần củng cố:</strong> {item.evidence}</p>
                  <p className="text-[10px] text-gray-500 leading-normal"><strong className="font-bold text-[#1F2937]/75">Gợi ý phát triển:</strong> {item.analysis}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 5. NATURAL LANGUAGE AI REPORT EXPLANATION */}
        {naturalLanguageExplanation && (
          <div className="bg-gradient-to-tr from-[#5B5FEF]/5 via-[#B8A7FF]/5 to-white p-8 md:p-10 rounded-[32px] border border-white/50 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-lg bg-[#5B5FEF] text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-lg font-sans font-extrabold text-[#1F2937]">Giải thích từ RealPath AI</h4>
            </div>

            <p className="text-sm md:text-base text-[#1F2937]/80 leading-relaxed italic font-normal">
              "{naturalLanguageExplanation}"
            </p>
          </div>
        )}

        {/* 6. RISK ANALYSIS SECTION */}
        {riskAnalysis && riskAnalysis.length > 0 && (
          <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[32px] border border-red-100/60 shadow-sm mb-12 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="text-lg font-sans font-extrabold text-[#1F2937]">Phân tích rủi ro & Lộ trình dự phòng</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskAnalysis.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-red-50/30 border border-red-100/50 space-y-2">
                  <h5 className="font-extrabold text-red-950 text-sm tracking-tight flex items-center gap-1.5">
                    ⚠️ Rủi ro: {item.risk}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="font-bold text-emerald-800">Phương án giảm thiểu:</strong> {item.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
