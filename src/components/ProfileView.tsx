import React from "react";
import { motion } from "motion/react";
import { User, Bookmark, History, Award, Compass, ArrowRight, Trash2, Calendar, Star, CheckCircle, LogOut } from "lucide-react";
import { Career, SavedResult, User as UserType } from "../types";

interface ProfileViewProps {
  savedCareers: Career[];
  onRemoveSavedCareer: (title: string) => void;
  assessmentHistory: SavedResult[];
  onSelectHistory: (careerTitle: string) => void;
  onClearHistory: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export default function ProfileView({
  savedCareers,
  onRemoveSavedCareer,
  assessmentHistory,
  onSelectHistory,
  onClearHistory,
  currentUser,
  onLogout,
  onNavigate
}: ProfileViewProps) {

  
  // Custom gamified badges based on user interactions
  const achievements = [
    {
      title: "Nhà Thám Hiểm",
      description: "Đã kích hoạt ứng dụng RealPath và tìm kiếm cơ hội.",
      icon: "🧭",
      unlocked: true,
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Tư Duy Thấu Cảm",
      description: "Hoàn tất khảo sát thiết kế sáng tạo & thấu hiểu khách hàng.",
      icon: "✨",
      unlocked: assessmentHistory.length > 0,
      color: "from-pink-400 to-orange-400"
    },
    {
      title: "Nhà Thiết Kế Lộ Trình",
      description: "Kích hoạt thành công ít nhất một timeline học tập.",
      icon: "🎯",
      unlocked: savedCareers.length > 0,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Bền Bỉ & Sẵn Sàng",
      description: "Đánh dấu hoàn thành toàn bộ mốc học tập đầu tiên.",
      icon: "⚡",
      unlocked: false, // customizable
      color: "from-amber-400 to-rose-500"
    }
  ];

  const getInitials = (name: string) => {
    if (!name) return "JD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white hero-gradient pb-32 px-6 pt-28 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white/90 backdrop-blur-md rounded-[40px] p-10 border border-white/50 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#5B5FEF]/10 flex items-center justify-center text-[#5B5FEF] mx-auto mb-6 text-3xl">
            👤
          </div>
          
          <h2 className="text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight mb-3">
            Hồ sơ cá nhân của bạn
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Hãy đăng ký hoặc đăng nhập để lưu giữ các ngành nghề yêu thích, lưu trữ lịch sử đánh giá năng lực AI, và may đo riêng lộ trình học tập!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate("auth-register")}
              className="pill-btn flex-1 py-3.5 bg-[#5B5FEF] text-white font-bold text-xs tracking-wide rounded-full shadow-lg shadow-[#5B5FEF]/20 focus:outline-none"
            >
              Đăng ký ngay
            </button>
            <button
              onClick={() => onNavigate("auth-login")}
              className="pill-btn flex-1 py-3.5 bg-gray-50 hover:bg-[#5B5FEF]/5 text-[#1F2937]/70 font-bold text-xs tracking-wide rounded-full border border-gray-200 focus:outline-none"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = getInitials(currentUser.name);

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 px-6 pt-28">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 border border-white/50 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#5B5FEF] to-[#B8A7FF] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#5B5FEF]/20 shrink-0">
            {userInitials}
          </div>
          <div className="flex-grow">
            <span className="text-xs font-mono font-bold text-[#5B5FEF] uppercase tracking-widest bg-[#5B5FEF]/10 px-3 py-1 rounded-full">
              Thành viên RealPath
            </span>
            <h2 className="text-3xl font-sans font-extrabold text-[#1F2937] tracking-tight mt-3 mb-1">
              {currentUser.name}
            </h2>
            <p className="text-xs text-[#1F2937]/50 font-mono flex items-center gap-1 justify-center md:justify-start">
              Email: {currentUser.email}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="pill-btn shrink-0 flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-semibold tracking-wide transition-all focus:outline-none"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>

          {/* Quick Metrics */}
          <div className="flex gap-6 border-t md:border-t-0 md:border-l border-black/[0.05] pt-6 md:pt-0 md:pl-10 shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono font-sans">Khảo sát</span>
              <p className="text-2xl font-black text-[#5B5FEF] mt-0.5">{assessmentHistory.length}</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono font-sans">Đã lưu</span>
              <p className="text-2xl font-black text-[#FF8F70] mt-0.5">{savedCareers.length}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Left Column = Saved careers & history, Right Column = Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* SAVED CAREERS LIST */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Bookmark className="w-5 h-5 text-[#FF8F70]" />
                <h3 className="text-xl font-sans font-extrabold text-[#1F2937] tracking-tight">
                  Ngành nghề đã lưu
                </h3>
              </div>

              {savedCareers.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 text-center border border-white/50 shadow-sm">
                  <Compass className="w-10 h-10 text-[#1F2937]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#1F2937]/50 max-w-xs mx-auto">
                    Chưa có công việc nào được lưu. Hãy ghé qua Trang Xu hướng nghề để lưu các công việc bạn yêu thích!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCareers.map((career) => (
                    <div
                      key={career.title}
                      className="bg-white p-6 rounded-2xl border border-black/[0.01] shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 hover:border-[#FF8F70]/20 transition-all"
                    >
                      <div>
                        <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight">
                          {career.title}
                        </h4>
                        <p className="text-xs text-[#1F2937]/50 mt-0.5">
                          {career.category} • Lương: {career.salaryRange}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectHistory(career.title)}
                          className="p-2.5 bg-gray-50 hover:bg-[#5B5FEF]/10 text-[#5B5FEF] rounded-xl transition-all"
                          title="Xem lộ trình AI"
                        >
                          <ArrowRight className="w-4.5 h-4.5" />
                        </button>
                        
                        <button
                          onClick={() => onRemoveSavedCareer(career.title)}
                          className="p-2.5 bg-gray-50 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                          title="Bỏ lưu"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ASSESSMENT HISTORY LIST */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#5B5FEF]" />
                  <h3 className="text-xl font-sans font-extrabold text-[#1F2937] tracking-tight">
                    Lịch sử đánh giá AI
                  </h3>
                </div>

                {assessmentHistory.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-xs font-bold text-red-500 hover:underline focus:outline-none"
                  >
                    Xóa lịch sử
                  </button>
                )}
              </div>

              {assessmentHistory.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 text-center border border-white/50 shadow-sm">
                  <User className="w-10 h-10 text-[#1F2937]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#1F2937]/50 max-w-xs mx-auto">
                    Chưa có lịch sử đánh giá. Hãy tham gia khảo sát Đánh giá AI ngay để nhận định hướng nghề nghiệp.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessmentHistory.map((history, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-black/[0.01] shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#1F2937]/40 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{history.date}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#1F2937] tracking-tight">
                          Phù hợp: {history.primaryCareerTitle}
                        </h4>
                        <p className="text-xs text-[#1F2937]/50">
                          Lĩnh vực: {history.category}
                        </p>
                      </div>

                      <button
                        onClick={() => onSelectHistory(history.primaryCareerTitle)}
                        className="pill-btn px-4.5 py-2.5 bg-[#5B5FEF]/10 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 focus:outline-none shrink-0 self-start sm:self-center"
                      >
                        Nạp báo cáo & Lộ trình <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Span 1) - Gamified achievements */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-[#B8A7FF]" />
              <h3 className="text-xl font-sans font-extrabold text-[#1F2937] tracking-tight">
                Thành tích đạt được
              </h3>
            </div>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <div
                  key={ach.title}
                  className={`p-6 rounded-[32px] border transition-all duration-300 relative overflow-hidden flex gap-4 ${
                    ach.unlocked 
                      ? "bg-white/90 backdrop-blur-md border-white/50 shadow-sm opacity-100" 
                      : "bg-white/40 border-dashed border-black/[0.05] opacity-50"
                  }`}
                >
                  {/* Left Icon with color gradient backdrop */}
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-xl bg-gradient-to-tr ${
                    ach.unlocked ? ach.color : "from-slate-100 to-slate-200"
                  } text-white shadow-sm`}>
                    {ach.unlocked ? ach.icon : "🔒"}
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                      {ach.title}
                      {ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-[#8EE3C4] fill-[#8EE3C4]/10" />}
                    </h4>
                    
                    <p className="text-xs text-[#1F2937]/50 mt-1 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
