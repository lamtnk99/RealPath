import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from "lucide-react";
import { User } from "../types";

interface AuthViewProps {
  initialMode?: "login" | "register";
  onAuthSuccess: (user: User) => void;
  onBackToHome?: () => void;
}

export default function AuthView({ initialMode = "register", onAuthSuccess, onBackToHome }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [smartToast, setSmartToast] = useState("");

  // Keep track of registered users in localStorage
  const getRegisteredUsers = (): User[] => {
    try {
      const usersRaw = localStorage.getItem("auth-users");
      if (usersRaw) {
        return JSON.parse(usersRaw);
      }
    } catch (e) {
      console.error("Error reading users", e);
    }
    
    // Seed an initial demo account so the user can easily test the auto-login transition!
    const defaultUser: User = {
      id: "demo-user-id",
      name: "Nguyễn Văn Demo",
      email: "demo@gmail.com",
      password: "123"
    };
    localStorage.setItem("auth-users", JSON.stringify([defaultUser]));
    return [defaultUser];
  };

  // Smart transition: "nếu có tài khoản thì tự chuyển sang đăng nhập"
  // Debounce email check to see if that email is registered
  useEffect(() => {
    if (mode !== "register" || !email) return;

    const trimmedEmail = email.trim().toLowerCase();
    
    // Simple email syntax check before looking up
    if (trimmedEmail.includes("@") && trimmedEmail.includes(".")) {
      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
      
      if (existingUser) {
        setSmartToast(`✨ Nhận diện email "${trimmedEmail}" đã có tài khoản! Tự động chuyển sang Đăng nhập...`);
        
        const timer = setTimeout(() => {
          setMode("login");
          setError("");
          setSmartToast("");
          // Clear password and confirm fields for security, keep email prefilled
          setPassword("");
          setConfirmPassword("");
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [email, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Vui lòng điền địa chỉ email.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      if (password.length < 3) {
        setError("Mật khẩu phải dài ít nhất 3 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Xác nhận mật khẩu không trùng khớp.");
        return;
      }

      setIsLoading(true);
      
      // Save user to localStorage
      setTimeout(() => {
        const users = getRegisteredUsers();
        const existingUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
        
        if (existingUser) {
          setError("Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.");
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          name: name.trim(),
          email: trimmedEmail,
          password: password // simplified persistence
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem("auth-users", JSON.stringify(updatedUsers));
        
        setSuccess("Đăng ký tài khoản thành công!");
        setIsLoading(false);

        // Auto login
        setTimeout(() => {
          onAuthSuccess(newUser);
        }, 800);
      }, 600);

    } else {
      // Login mode
      if (!password) {
        setError("Vui lòng nhập mật khẩu.");
        return;
      }

      setIsLoading(true);
      
      setTimeout(() => {
        const users = getRegisteredUsers();
        const foundUser = users.find(
          u => u.email.toLowerCase() === trimmedEmail && u.password === password
        );

        if (!foundUser) {
          setError("Email hoặc mật khẩu không chính xác. Mẹo: Tài khoản mặc định là demo@gmail.com mật khẩu 123");
          setIsLoading(false);
          return;
        }

        setSuccess(`Chào mừng quay trở lại, ${foundUser.name}!`);
        setIsLoading(false);

        setTimeout(() => {
          onAuthSuccess(foundUser);
        }, 800);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 pt-28 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial from-[#5B5FEF]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-radial from-[#B8A7FF]/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Return to Home option */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="group mb-6 flex items-center gap-2 text-xs font-bold text-[#1F2937]/50 hover:text-[#5B5FEF] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại Trang chủ
          </button>
        )}

        {/* Branding & Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-sans font-extrabold tracking-tight text-[#1F2937]">
            {mode === "register" ? "Tạo tài khoản mới" : "Chào mừng quay trở lại"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {mode === "register" 
              ? "Tham gia RealPath để AI định hình lộ trình phát triển sự nghiệp của riêng bạn."
              : "Đăng nhập để xem báo cáo xu hướng và tiếp tục theo đuổi lộ trình."}
          </p>
        </div>

        {/* Outer Form Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 md:p-10 border border-white/50 shadow-sm relative overflow-hidden"
        >
          {/* Form Switcher Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-full mb-8 relative border border-black/[0.02]">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`pill-btn flex-1 py-3 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none relative z-10 ${
                mode === "register" ? "text-white bg-[#5B5FEF] shadow-sm shadow-[#5B5FEF]/10" : "text-[#1F2937]/60 hover:text-[#5B5FEF]"
              }`}
            >
              Đăng ký
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`pill-btn flex-1 py-3 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none relative z-10 ${
                mode === "login" ? "text-white bg-[#5B5FEF] shadow-sm shadow-[#5B5FEF]/10" : "text-[#1F2937]/60 hover:text-[#5B5FEF]"
              }`}
            >
              Đăng nhập
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "register" ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "register" ? 15 : -15 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name Field (Register Only) */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold font-mono uppercase text-gray-400 tracking-wider mb-2">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/5 transition-all text-[#1F2937]"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-gray-400 tracking-wider mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/5 transition-all text-[#1F2937]"
                  />
                </div>
                {mode === "register" && (
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    Mẹo: Nhập <span className="font-semibold text-[#5B5FEF] underline">demo@gmail.com</span> để trải nghiệm tính năng tự động chuyển sang Đăng nhập!
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold font-mono uppercase text-gray-400 tracking-wider">
                    Mật khẩu
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => alert("Trình duyệt Demo: Bạn có thể nhập bất kỳ mật khẩu nào đã đăng ký hoặc mật khẩu '123' cho tài khoản demo.")}
                      className="text-[10px] text-gray-400 hover:text-[#5B5FEF] font-semibold"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/5 transition-all text-[#1F2937]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Register Only) */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold font-mono uppercase text-gray-400 tracking-wider mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#5B5FEF]/5 transition-all text-[#1F2937]"
                    />
                  </div>
                </div>
              )}

              {/* Smart Toast Message */}
              <AnimatePresence>
                {smartToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{smartToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Errors or Successes */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-start gap-2"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="pill-btn w-full py-4 bg-[#5B5FEF] text-white text-sm font-bold tracking-wide rounded-full shadow-lg shadow-[#5B5FEF]/20 flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    {mode === "register" ? "Đăng ký ngay" : "Đăng nhập hệ thống"}
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

              {/* Switch Hint link */}
              <div className="text-center mt-6 text-xs text-gray-500">
                {mode === "register" ? (
                  <p>
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError("");
                        setSuccess("");
                      }}
                      className="font-bold text-[#5B5FEF] hover:underline focus:outline-none"
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                ) : (
                  <p>
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setError("");
                        setSuccess("");
                      }}
                      className="font-bold text-[#5B5FEF] hover:underline focus:outline-none"
                    >
                      Đăng ký miễn phí
                    </button>
                  </p>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Demo sandbox login guide card */}
        <div className="mt-8 bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <span className="font-bold">Môi trường dùng thử Sandbox:</span>
            <p>Hệ thống hỗ trợ tài khoản demo có sẵn:</p>
            <p>• Email: <span className="font-bold">demo@gmail.com</span></p>
            <p>• Mật khẩu: <span className="font-bold">123</span></p>
            <p className="text-amber-700/80 leading-relaxed mt-1">
              Bạn có thể nhập thử email <span className="italic">demo@gmail.com</span> vào mẫu Đăng ký để chứng kiến AI tự động chuyển trang đăng nhập mượt mà!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
