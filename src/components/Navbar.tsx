import React from "react";
import { Compass, Sparkles, User, Award, Briefcase, Lock, LogIn } from "lucide-react";
import { User as UserType } from "../types";
// @ts-ignore
import realPathLogo from "../../assets/logo.png";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  aiStatus: { mode: string; message: string };
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Navbar({ currentTab, onTabChange, aiStatus, currentUser, onLogout }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Trang chủ", icon: Sparkles, requiresAuth: false },
    { id: "trends", label: "Xu hướng nghề", icon: Compass, requiresAuth: false },
    { id: "workday", label: "Ngày làm thử", icon: Briefcase, requiresAuth: false },
    { id: "assessment", label: "Đánh giá AI", icon: Sparkles, requiresAuth: true },
    { id: "roadmap", label: "Lộ trình", icon: Award, requiresAuth: true },
  ];

  return (
    <header className="bg-white border-b border-black/[0.06] fixed top-0 w-full z-50 px-3 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          type="button"
          onClick={() => onTabChange("home")}
          className="group flex items-center gap-2.5 focus:outline-none cursor-pointer"
          id="nav-logo"
          aria-label="Về trang chủ RealPath"
        >
          <div className="h-12 w-12 overflow-hidden flex items-center justify-start rounded-xl bg-transparent">
            <img
              src={realPathLogo}
              alt="RealPath - Hiểu mình, chọn nghề, sống đúng đam mê"
              className="h-full w-auto max-w-none object-cover object-left mix-blend-multiply"
            />
          </div>
          <span className="font-sans font-extrabold text-xl md:text-2xl tracking-tight select-none">
            <span className="text-[#1F2937]">Real</span>
            <span className="bg-gradient-to-r from-[#5B5FEF] via-[#B8A7FF] to-[#FF8F70] bg-clip-text text-transparent">Path</span>
          </span>
        </button>

        {/* Navigation Tabs (Desktop-first navbar) */}
        <nav className="hidden md:flex items-center bg-white/70 p-1.5 rounded-full border border-white/50 shadow-sm gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isLocked = item.requiresAuth && !currentUser;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`pill-btn flex items-center gap-1.5 px-5 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none cursor-pointer ${
                  isActive
                    ? "bg-[#5B5FEF] text-white shadow-md shadow-[#5B5FEF]/10"
                    : isLocked
                    ? "text-[#1F2937]/35 hover:text-[#5B5FEF] hover:bg-[#5B5FEF]/5"
                    : "text-[#1F2937]/60 hover:text-[#5B5FEF] hover:bg-black/[0.02]"
                }`}
              >
                {isActive ? <Icon className="w-4 h-4 animate-pulse" /> : <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Action Status Bar */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => onTabChange("profile")}
              id="nav-profile-btn"
              className="pill-btn px-4.5 py-2.5 bg-[#5B5FEF]/10 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={() => onTabChange("auth-login")}
              id="nav-login-btn"
              className="pill-btn px-5.5 py-2.5 bg-[#5B5FEF] text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none shadow-md shadow-[#5B5FEF]/10 hover:shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation tray at bottom for mobile convenience */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-black/[0.05] shadow-[0_-4px_25px_rgba(0,0,0,0.04)] px-4 py-3 z-50 flex justify-around items-center rounded-t-3xl backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isLocked = item.requiresAuth && !currentUser;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 focus:outline-none relative cursor-pointer ${
                isActive ? "text-[#5B5FEF] scale-105 font-semibold" : "text-[#1F2937]/50"
              } ${isLocked ? "opacity-60" : ""}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
