import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Briefcase, 
  Play, 
  Bot, 
  Palette, 
  BarChart3, 
  Users 
} from "lucide-react";

interface HomeViewProps {
  onStartJourney: () => void;
  onNavigate: (tab: string) => void;
  onOpenWorkday: (id: string, name: string) => void;
}

export default function HomeView({ onStartJourney, onNavigate, onOpenWorkday }: HomeViewProps) {
  const workdayCareers = [
    { id: "ai-engineer", name: "Kỹ sư AI", icon: Bot, color: "text-blue-600", bg: "bg-white/95 border-black/[0.04] hover:border-indigo-600/20" },
    { id: "graphic-designer", name: "Thiết kế Đồ họa", icon: Palette, color: "text-rose-600", bg: "bg-white/95 border-black/[0.04] hover:border-indigo-600/20" },
    { id: "auditor", name: "Kiểm toán viên", icon: BarChart3, color: "text-amber-600", bg: "bg-white/95 border-black/[0.04] hover:border-indigo-600/20" },
    { id: "growth-marketer", name: "Growth Marketer", icon: TrendingUp, color: "text-emerald-600", bg: "bg-white/95 border-black/[0.04] hover:border-indigo-600/20" },
    { id: "hr-manager", name: "Quản trị Nhân sự", icon: Users, color: "text-purple-600", bg: "bg-white/95 border-black/[0.04] hover:border-indigo-600/20" }
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-white hero-gradient py-12 md:py-20 relative overflow-hidden">
      
      {/* Dynamic Grid Mesh Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5b5fef/[0.02]_1px,transparent_1px),linear-gradient(to_bottom,#5b5fef/[0.02]_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full z-10 px-6 md:px-12 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-[#FF8F70] animate-ping"></span>
                <span className="text-xs font-semibold text-[#1F2937]/70 tracking-wide uppercase font-mono">
                  RealPath AI Core 2.5
                </span>
                <Star className="w-3.5 h-3.5 text-[#FF8F70] fill-current" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-[#1F2937] leading-[1.1]"
                id="hero-title"
              >
                Tìm đúng con đường <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5FEF] via-[#B8A7FF] to-[#FF8F70]">
                  nghề nghiệp tương lai
                </span>{" "}
                của bạn
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base md:text-lg text-[#1F2937]/70 leading-relaxed max-w-xl font-normal"
                id="hero-desc"
              >
                Khám phá điểm mạnh tiềm ẩn, đón đầu các làn sóng xu hướng tuyển dụng mới nhất và nhận bản đồ lộ trình học tập may tailor riêng biệt bằng Trí tuệ Nhân tạo thế hệ mới.
              </motion.p>

              {/* Main CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="pt-4 flex flex-col sm:flex-row gap-4 items-start"
              >
                <button
                  onClick={onStartJourney}
                  id="start-journey-btn"
                  className="pill-btn group relative inline-flex items-center justify-center gap-3 bg-[#5B5FEF] text-white px-8 py-4.5 rounded-full text-base font-bold tracking-wide shadow-xl shadow-[#5B5FEF]/20 focus:outline-none w-full sm:w-auto cursor-pointer"
                >
                  Bắt đầu hành trình
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                
                <button
                  onClick={() => onNavigate("trends")}
                  className="pill-btn inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-[#5B5FEF]/5 text-[#1F2937]/70 font-bold text-sm px-8 py-4.5 rounded-full border border-gray-200/60 transition-all focus:outline-none w-full sm:w-auto cursor-pointer"
                >
                  Xem xu hướng thị trường
                </button>
              </motion.div>
            </div>

            {/* Right Column: Beautiful Interactive 3D Mockup Area */}
            <div className="lg:col-span-5 relative h-[450px] md:h-[500px] w-full flex items-center justify-center">
              
              {/* Outer Perspective Wrapper */}
              <div className="relative w-full h-full flex items-center justify-center [perspective:1200px]">
                
                {/* Core Holographic Glowing Center Orb */}
                <motion.div 
                  animate={{ 
                    scale: [0.95, 1.05, 0.95], 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#5B5FEF]/10 via-[#B8A7FF]/5 to-[#FF8F70]/10 blur-2xl pointer-events-none" 
                />

                {/* Grid Connection Pathways (SVG Line) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" viewBox="0 0 400 400">
                  <motion.path 
                    d="M 105,100 C 150,150 250,150 300,100" 
                    fill="transparent" 
                    stroke="#5B5FEF" 
                    strokeWidth="1.5" 
                    strokeDasharray="6 4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path 
                    d="M 80,300 C 180,250 220,320 320,280" 
                    fill="transparent" 
                    stroke="#FF8F70" 
                    strokeWidth="1.5" 
                    strokeDasharray="8 4"
                    animate={{ strokeDashoffset: [0, 20] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path 
                    d="M 200,80 L 200,320" 
                    fill="transparent" 
                    stroke="#B8A7FF" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* 3D Glass Card 1: AI Engineer */}
                <motion.div
                  initial={{ opacity: 0, z: -100, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    z: 0,
                    y: [0, -12, 0],
                    rotateX: 10,
                    rotateY: -15
                  }}
                  transition={{ 
                    duration: 0.8,
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.05, rotateY: -5, rotateX: 5, z: 20 }}
                  className="absolute top-12 left-4 md:left-10 w-[240px] bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-[0_20px_50px_rgba(91,95,239,0.12)] z-30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold font-mono text-[#5B5FEF] bg-[#5B5FEF]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Công nghệ cao
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1F2937]">Kỹ sư AI & Học máy</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Độ tương thích: 98%</p>
                  
                  {/* Mock Skills indicators inside card */}
                  <div className="flex gap-1.5 mt-3">
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Python</span>
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">TensorFlow</span>
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">LLMs</span>
                  </div>
                </motion.div>

                {/* 3D Glass Card 2: Marketing Director */}
                <motion.div
                  initial={{ opacity: 0, z: -100, y: 100 }}
                  animate={{ 
                    opacity: 1, 
                    z: 0,
                    y: [0, 15, 0],
                    rotateX: -8,
                    rotateY: 20
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 0.1,
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.05, rotateY: 5, rotateX: -2, z: 25 }}
                  className="absolute bottom-16 right-4 md:right-8 w-[240px] bg-white/85 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-[0_25px_50px_rgba(255,143,112,0.12)] z-20 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold font-mono text-[#FF8F70] bg-[#FF8F70]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Kinh doanh
                    </span>
                    <span className="text-[10px] font-extrabold text-[#FF8F70] bg-[#FF8F70]/5 px-2 py-0.5 rounded">Hot 🔥</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1F2937]">Growth Marketer</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Lương tb: 35tr - 50tr/tháng</p>
                  
                  {/* Sparking line chart mockup */}
                  <div className="h-6 flex items-end gap-1 mt-3">
                    <div className="w-full bg-[#FF8F70]/20 h-[30%] rounded-sm" />
                    <div className="w-full bg-[#FF8F70]/20 h-[45%] rounded-sm" />
                    <div className="w-full bg-[#FF8F70]/20 h-[60%] rounded-sm" />
                    <div className="w-full bg-[#FF8F70]/40 h-[80%] rounded-sm" />
                    <div className="w-full bg-[#FF8F70] h-[95%] rounded-sm" />
                  </div>
                </motion.div>

                {/* 3D Glass Card 3: UI/UX Designer */}
                <motion.div
                  initial={{ opacity: 0, z: -100 }}
                  animate={{ 
                    opacity: 1, 
                    z: 10,
                    x: [0, 8, 0],
                    y: [0, 6, 0],
                    rotateX: 5,
                    rotateY: 5
                  }}
                  transition={{ 
                    duration: 1.2,
                    delay: 0.2,
                    x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.05, rotateY: 0, rotateX: 0, z: 30 }}
                  className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[210px] bg-white/95 backdrop-blur-xl rounded-[28px] p-4.5 border border-white shadow-[0_15px_40px_rgba(184,167,255,0.15)] z-40 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-[#B8A7FF]/20 flex items-center justify-center text-xs">
                      🎨
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1F2937]">UI/UX Designer</h4>
                      <p className="text-[9px] text-gray-400">Match: 92%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Realistic 3D floating glass sphere shapes */}
                <motion.div
                  animate={{ 
                    y: [0, -30, 0],
                    rotate: 360
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-16 w-12 h-12 rounded-full bg-gradient-to-tr from-[#5B5FEF]/40 to-[#B8A7FF]/5 shadow-inner border border-white/30 backdrop-blur-[2px] z-10"
                />
                
                <motion.div
                  animate={{ 
                    y: [0, 25, 0],
                    rotate: -360
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-12 left-16 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8F70]/30 to-[#B8A7FF]/5 shadow-inner border border-white/20 backdrop-blur-[1px] z-10"
                />

                <motion.div
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-6 w-6 h-6 rounded-full bg-gradient-to-tr from-[#B8A7FF]/50 to-transparent shadow-inner border border-white/40 z-10"
                />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SIMULATED WORKDAY TRIAL TILES */}
      <section className="relative w-full z-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#5B5FEF]/5 border border-[#5B5FEF]/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#5B5FEF]">
              <Briefcase className="w-4 h-4" />
              <span>Trải nghiệm: Ngày làm việc mô phỏng</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Lựa chọn chơi thử 1 ngày để cảm nhận không khí làm việc thực tế cùng các tình huống đặc thù.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4.5 max-w-5xl mx-auto">
            {workdayCareers.map((workday) => {
              const Icon = workday.icon;
              return (
                <motion.div
                  key={workday.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenWorkday(workday.id, workday.name)}
                  className={`${workday.bg} rounded-[28px] p-5 border flex flex-col justify-between h-36 text-center cursor-pointer transition-all shadow-sm hover:shadow-md group`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className={`w-4.5 h-4.5 ${workday.color}`} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 leading-snug mb-1.5 group-hover:text-[#5B5FEF] transition-colors">
                      {workday.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#5B5FEF] tracking-wide uppercase bg-[#5B5FEF]/5 px-2.5 py-1 rounded-full group-hover:bg-[#5B5FEF] group-hover:text-white transition-all">
                      <Play className="w-2 h-2 fill-current" /> Chơi thử 1 ngày
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
