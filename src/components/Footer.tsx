import React, { useState } from "react";
import { 
  Mail, 
  Heart, 
  Send, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Globe, 
  Shield,
  FileText,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import realPathLogo from "../../assets/logo.png";

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#5B5FEF] text-white border-t border-white/10 relative z-10 overflow-hidden shadow-inner">
      {/* Decorative top ambient color blur */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-white/10 blur-[90px] pointer-events-none" />

      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 overflow-hidden flex items-center justify-start rounded-xl bg-white p-1">
                <img
                  src={realPathLogo}
                  alt="RealPath Logo"
                  className="h-full w-auto object-cover object-left"
                />
              </div>
              <span className="text-xl font-sans font-extrabold tracking-tight">
                RealPath <span className="text-white/70">AI</span>
              </span>
            </div>
            
            <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-sm font-medium">
              Nền tảng hướng nghiệp thế hệ mới áp dụng Trí tuệ Nhân tạo để bóc tách năng lực tiềm ẩn, cập nhật xu hướng thị trường và thiết kế lộ trình phát triển tối ưu.
            </p>

            <div className="flex items-center gap-2.5">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Globe, label: "Website", href: "#" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.a 
                    key={idx}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={item.href} 
                    className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors flex items-center justify-center cursor-pointer" 
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold font-mono text-white/50 uppercase tracking-widest">Khám Phá</h4>
              <ul className="space-y-2">
                {[
                  { id: "home", label: "Trang chủ" },
                  { id: "trends", label: "Xu hướng nghề" },
                  { id: "workday", label: "Ngày làm thử" },
                  { id: "assessment", label: "Đánh giá AI" },
                  { id: "roadmap", label: "Lộ trình học" },
                ].map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavigate(link.id)} 
                      className="text-xs md:text-sm text-white/80 hover:text-white transition-colors font-medium text-left cursor-pointer focus:outline-none"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold font-mono text-white/50 uppercase tracking-widest">Tài Khoản</h4>
              <ul className="space-y-2">
                {[
                  { id: "profile", label: "Hồ sơ cá nhân" },
                  { id: "auth-login", label: "Đăng nhập" },
                  { id: "auth-register", label: "Đăng ký" },
                ].map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavigate(link.id)} 
                      className="text-xs md:text-sm text-white/80 hover:text-white transition-colors font-medium text-left cursor-pointer focus:outline-none"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-[11px] font-bold font-mono text-white/50 uppercase tracking-widest">Bản Tin Hướng Nghiệp</h4>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
              Cập nhật báo cáo xu hướng thị trường lao động mới nhất tại Việt Nam từ chuyên gia RealPath.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                placeholder="Nhập email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-4 pr-12 py-3 text-xs font-medium focus:outline-none focus:border-white/40 focus:ring-3 focus:ring-white/5 transition-all text-white placeholder:text-white/60"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white text-[#5B5FEF] flex items-center justify-center hover:bg-white/95 transition-all focus:outline-none cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-white font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Đã đăng ký bản tin thành công!
              </motion.p>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
            <span>© {new Date().getFullYear()} RealPath. Phát triển với</span>
            <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
            <span>cho học sinh THPT & Sinh viên Việt Nam.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/70 font-medium">
            <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              Điều khoản dịch vụ
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
