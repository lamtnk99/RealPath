import React from "react";
import { motion } from "motion/react";
import { 
  User, 
  Bookmark, 
  History, 
  Award, 
  Compass, 
  ArrowRight, 
  Trash2, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  LogOut, 
  Cpu, 
  MapPin, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Career, SavedResult, User as UserType, AssessmentResult } from "../types";

interface DashboardHomeViewProps {
  currentUser: UserType;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  assessmentResult: AssessmentResult | null;
  assessmentHistory: SavedResult[];
  savedCareers: Career[];
  onRemoveSavedCareer: (title: string) => void;
  onSelectHistory: (careerTitle: string) => void;
  onClearHistory: () => void;
  onStartAssessment: () => void;
  isLoadingRoadmap?: boolean;
}

export default function DashboardHomeView({
  currentUser,
  onLogout,
  onNavigate,
  assessmentResult,
  assessmentHistory,
  savedCareers,
  onRemoveSavedCareer,
  onSelectHistory,
  onClearHistory,
  onStartAssessment,
  isLoadingRoadmap = false
}: DashboardHomeViewProps) {
  const [loadingHistoryTitle, setLoadingHistoryTitle] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoadingRoadmap) {
      setLoadingHistoryTitle(null);
    }
  }, [isLoadingRoadmap]);

  // Custom achievements based on actual stats
  const achievements = [
    {
      title: "Nhà Thám Hiểm",
      description: "Đã gia nhập RealPath và sẵn sàng thiết kế sự nghiệp.",
      icon: "🧭",
      unlocked: true,
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Thấu Hiểu Bản Thân",
      description: "Hoàn tất khảo sát tính cách và năng lực nghề nghiệp.",
      icon: "🧠",
      unlocked: assessmentHistory.length > 0,
      color: "from-pink-400 to-orange-400"
    },
    {
      title: "Kiến Tạo Tương Lai",
      description: "Kích hoạt thành công ít nhất một lộ trình học tập.",
      icon: "🎯",
      unlocked: savedCareers.length > 0,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Bền Bỉ Vươn Lên",
      description: "Lưu giữ trên 3 vị trí công việc tiềm năng.",
      icon: "⚡",
      unlocked: savedCareers.length >= 3,
      color: "from-amber-400 to-rose-500"
    }
  ];

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(currentUser.name);

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 px-4 md:px-8 pt-28">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP WELCOME & STATS BANNER */}
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 md:p-8 border border-white/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle decorative lights */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#5B5FEF]/5 to-transparent blur-xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full lg:w-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5B5FEF] to-[#B8A7FF] flex items-center justify-center text-white text-2xl font-black shadow-md shadow-[#5B5FEF]/20 shrink-0">
              {userInitials}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#5B5FEF] uppercase tracking-widest bg-[#5B5FEF]/10 px-2.5 py-1 rounded-full">
                Thành viên danh dự
              </span>
              <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1F2937] tracking-tight mt-2.5 mb-1">
                Chào mừng trở lại, {currentUser.name}! ✨
              </h2>
              <p className="text-xs text-[#1F2937]/50 font-mono">
                Tài khoản: {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end shrink-0">
            {/* Quick Stats Grid */}
            <div className="flex gap-4 border-r border-black/[0.05] pr-6">
              <div className="text-center">
                <span className="text-[9px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">Số lần Đánh giá</span>
                <p className="text-xl font-black text-[#5B5FEF] mt-0.5">{assessmentHistory.length}</p>
              </div>
              <div className="text-center">
                <span className="text-[9px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">Công việc đã lưu</span>
                <p className="text-xl font-black text-[#FF8F70] mt-0.5">{savedCareers.length}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="pill-btn shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-semibold tracking-wide transition-all focus:outline-none"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* CORE INTERACTIVE LINK TO AI ASSESSMENT */}
        <div className="bg-gradient-to-r from-[#5B5FEF] via-[#8576FF] to-[#FF8F70]/90 rounded-[40px] p-8 md:p-10 text-white shadow-xl shadow-[#5B5FEF]/10 relative overflow-hidden">
          {/* Glowing backdrops */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-mono w-fit mx-auto lg:mx-0">
                <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" /> Trực quan hóa tương lai bằng AI
              </div>
              
              {assessmentResult ? (
                <>
                  <h3 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight leading-tight">
                    Đề xuất nghề nghiệp AI của bạn: <span>{assessmentResult.primaryCareer.title}</span>
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Bạn đã có 3 gợi ý nghề nghiệp tương thích cao. Hãy nhấp để xem báo cáo phân tích tâm lý chuyên sâu và lộ trình học tập tối ưu nhất!
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl md:text-4xl font-sans font-extrabold tracking-tight leading-tight">
                    Bạn chưa thực hiện đánh giá sự nghiệp AI nào!
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Hãy trải nghiệm bộ công cụ trắc nghiệm thông minh kết nối trực tiếp với mô hình AI chuyên gia của RealPath để bóc tách thế mạnh tính cách cá nhân ngay hôm nay.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 justify-center">
              {assessmentResult ? (
                <>
                  <button
                    onClick={() => onNavigate("assessment")}
                    className="pill-btn px-6 py-4 bg-white text-[#5B5FEF] font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Xem báo cáo & Lộ trình
                    <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
                  </button>
                  <button
                    onClick={onStartAssessment}
                    className="pill-btn px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    Đánh giá lại
                  </button>
                </>
              ) : (
                <button
                  onClick={onStartAssessment}
                  className="pill-btn px-8 py-4 bg-white text-[#5B5FEF] font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Bắt đầu Khảo sát AI ngay
                  <Sparkles className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DOUBLE COLUMN: SAVED CAREERS & HISTORY / BADGES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area (Careers & History) - Span 8 */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SAVED CAREERS LIST */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
                <Bookmark className="w-5 h-5 text-[#FF8F70]" />
                <h3 className="text-lg font-sans font-extrabold text-[#1F2937] tracking-tight">
                  Ngành nghề bạn đã lưu giữ ({savedCareers.length})
                </h3>
              </div>

              {savedCareers.length === 0 ? (
                <div className="text-center py-8">
                  <Compass className="w-10 h-10 text-[#1F2937]/15 mx-auto mb-3" />
                  <p className="text-xs text-[#1F2937]/50 max-w-sm mx-auto">
                    Chưa lưu công việc nào. Ghé qua mục <strong className="text-[#5B5FEF] cursor-pointer" onClick={() => onNavigate("trends")}>Xu hướng nghề</strong> để lưu và chuẩn bị kế hoạch!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedCareers.map((career) => (
                    <div
                      key={career.title}
                      className="p-5 rounded-2xl bg-gray-50/50 border border-black/[0.02] hover:border-[#FF8F70]/20 transition-all flex flex-col justify-between gap-4 relative group"
                    >
                      <div>
                        <span className="text-[9px] font-bold text-[#FF8F70] bg-[#FF8F70]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          {career.category}
                        </span>
                        <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight mt-2">
                          {career.title}
                        </h4>
                        <p className="text-xs text-[#1F2937]/50 mt-1 flex items-center gap-1 font-mono">
                          Lương: {career.salaryRange}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-black/[0.03] pt-3 mt-1">
                        <button
                          onClick={() => onSelectHistory(career.title)}
                          className="text-xs font-bold text-[#5B5FEF] hover:underline flex items-center gap-1.5 focus:outline-none"
                        >
                          Xây lộ trình <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => onRemoveSavedCareer(career.title)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                          title="Bỏ lưu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ASSESSMENT HISTORY LIST */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.03]">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#5B5FEF]" />
                  <h3 className="text-lg font-sans font-extrabold text-[#1F2937] tracking-tight">
                    Lịch sử định hướng AI ({assessmentHistory.length})
                  </h3>
                </div>

                {assessmentHistory.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-xs font-bold text-red-500 hover:underline focus:outline-none"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {assessmentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-[#1F2937]/15 mx-auto mb-3" />
                  <p className="text-xs text-[#1F2937]/50 max-w-sm mx-auto">
                    Chưa có lịch sử làm khảo sát. Kết nối Trí tuệ Nhân tạo bằng bài test thông minh để nhận bản đồ sự nghiệp.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {assessmentHistory.slice(0, 4).map((hist, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gray-50/50 border border-black/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#1F2937]/40">
                          <Calendar className="w-3 h-3" />
                          <span>{hist.date}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-[#1F2937] tracking-tight">
                          Phù hợp: {hist.primaryCareerTitle}
                        </h4>
                        <p className="text-xs text-[#1F2937]/50">
                          Lĩnh vực: {hist.category}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setLoadingHistoryTitle(hist.primaryCareerTitle);
                          onSelectHistory(hist.primaryCareerTitle);
                        }}
                        disabled={isLoadingRoadmap}
                        className="pill-btn px-4 py-2 bg-[#5B5FEF]/10 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 focus:outline-none self-start sm:self-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingRoadmap && loadingHistoryTitle === hist.primaryCareerTitle ? (
                          <>
                            <Cpu className="w-3.5 h-3.5 animate-spin" />
                            Đang tải lộ trình...
                          </>
                        ) : (
                          <>
                            Tải lại báo cáo & lộ trình <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Area (Achievements / Badges) - Span 4 */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-black/[0.03]">
                <Award className="w-5 h-5 text-[#B8A7FF]" />
                <h3 className="text-lg font-sans font-extrabold text-[#1F2937] tracking-tight">
                  Danh hiệu nghề nghiệp
                </h3>
              </div>

              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div
                    key={ach.title}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex gap-4 ${
                      ach.unlocked 
                        ? "bg-white border-black/[0.03] shadow-[0_4px_15px_rgba(0,0,0,0.01)]" 
                        : "bg-white/40 border-dashed border-black/[0.05] opacity-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg bg-gradient-to-tr ${
                      ach.unlocked ? ach.color : "from-slate-100 to-slate-200"
                    } text-white shadow-sm`}>
                      {ach.unlocked ? ach.icon : "🔒"}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                        {ach.title}
                        {ach.unlocked && <CheckCircle className="w-3 h-3 text-[#8EE3C4] fill-[#8EE3C4]/10" />}
                      </h4>
                      <p className="text-[10px] text-[#1F2937]/50 mt-0.5 leading-normal">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips / Resources */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 border border-amber-100/60 shadow-[0_4px_15px_rgba(0,0,0,0.01)]">
              <h4 className="text-sm font-sans font-extrabold text-amber-800 tracking-tight flex items-center gap-1.5 mb-2">
                <Compass className="w-4 h-4 text-[#FF8F70]" />
                Gợi ý khám phá
              </h4>
              <p className="text-xs text-amber-700/80 leading-relaxed">
                Nhu cầu tuyển dụng của thị trường luôn thay đổi liên tục. Bạn nên thực hiện lại bài trắc nghiệm AI mỗi 3-6 tháng hoặc ghé qua danh sách xu hướng để cập nhật biến động nghề nghiệp mới nhất.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
