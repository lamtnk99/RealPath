import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Compass,
  PenTool,
  CheckSquare,
  Brain,
  Flame,
  Users,
  Trash2,
  BookOpen,
  Undo2,
  Layers,
  Sparkle,
  RotateCcw,
  HelpCircle,
  Info,
  X
} from "lucide-react";
import { JigsawGameState, JigsawGameData, JigsawGuessResponse, TimeManagementTask } from "../types";

interface AssessmentViewProps {
  onCompleteAll: (result: JigsawGuessResponse, finalState: JigsawGameState) => void;
  onBackToHome: () => void;
}


export default function AssessmentView({
  onCompleteAll,
  onBackToHome
}: AssessmentViewProps) {
  const [step, setStep] = useState(1);
  const [gameData, setGameData] = useState<JigsawGameData | null>(null);
  const [loading, setLoading] = useState(true);

  // User Selections
  const [story, setStory] = useState("");
  const [customTasks, setCustomTasks] = useState<TimeManagementTask[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<Record<string, "doNow" | "delegate" | "skip">>({});
  const [decisionHistory, setDecisionHistory] = useState<Array<{ taskId: string; choice: "doNow" | "delegate" | "skip" }>>([]);
  const [styles, setStyles] = useState<Record<string, string>>({});

  // Active indices for Step 2 and Step 3 cards
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [activeStyleIndex, setActiveStyleIndex] = useState(0);

  // Card deck interaction states
  const [showTutorialModal, setShowTutorialModal] = useState(true);

  // Slide direction for transitions
  const [slideDirection, setSlideDirection] = useState(1); // 1 = forward, -1 = backward

  // API loading states
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [synthesis, setSynthesis] = useState<JigsawGuessResponse | null>(null);
  const [exitDirection, setExitDirection] = useState<"doNow" | "delegate" | "skip" | "undo" | null>(null);
  const [taskGenError, setTaskGenError] = useState<string | null>(null);
  const [userType, setUserType] = useState<"student" | "undergrad" | null>(null);

  // Fetch Game Data (static questions & industries)
  useEffect(() => {
    fetch("/api/jigsaw-data")
      .then((res) => res.json())
      .then((data) => {
        setGameData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !gameData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400 font-mono">Đang tải dữ liệu hướng nghiệp...</p>
        </div>
      </div>
    );
  }

  // Handle Step 1 -> Step 2 transition: call Gemini to generate tasks
  const handleProceedToStep2 = async () => {
    setIsGeneratingTasks(true);
    setTaskGenError(null);
    try {
      const res = await fetch("/api/generate-custom-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, userType })
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (!data.tasks || !Array.isArray(data.tasks) || data.tasks.length !== 10) {
        throw new Error("API không trả về đủ 10 lá bài");
      }

      const tasksToUse = data.tasks;
      setCustomTasks(tasksToUse);
      const initialAssignments: Record<string, "doNow" | "delegate" | "skip"> = {};
      tasksToUse.forEach((t: any) => {
        initialAssignments[t.id] = "doNow";
      });
      setTaskAssignments(initialAssignments);
      setDecisionHistory([]);
      setActiveTaskIndex(0);
      setSlideDirection(1);
      setStep(4); // Transition from Step 3 (Story) to Step 4 (Cards)
    } catch (e: any) {
      console.error(e);
      setTaskGenError(e?.message || "Lỗi không xác định");
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  // Step 2 card assignment selection handler
  const handleAssignTask = (taskId: string, column: "doNow" | "delegate" | "skip") => {
    if (decisionHistory.length >= customTasks.length) {
      return;
    }
    if (decisionHistory.some(d => d.taskId === taskId)) {
      return;
    }

    setExitDirection(column);

    setTaskAssignments((prev) => ({
      ...prev,
      [taskId]: column
    }));

    const nextHistory = [...decisionHistory, { taskId, choice: column }];
    setDecisionHistory(nextHistory);

    setSlideDirection(1);

    const nextUncompletedIdx = customTasks.findIndex((t, i) =>
      i > activeTaskIndex && !nextHistory.some(d => d.taskId === t.id)
    );

    if (nextUncompletedIdx !== -1) {
      setActiveTaskIndex(nextUncompletedIdx);
    } else {
      const firstUncompletedIdx = customTasks.findIndex((t) =>
        !nextHistory.some(d => d.taskId === t.id)
      );
      if (firstUncompletedIdx !== -1) {
        setActiveTaskIndex(firstUncompletedIdx);
      }
    }
  };

  // Undo previous decision ("Quay lại lá trước")
  const handleUndoCard = () => {
    if (decisionHistory.length > 0) {
      const lastDecision = decisionHistory[decisionHistory.length - 1];
      const nextHistory = decisionHistory.slice(0, -1);
      setDecisionHistory(nextHistory);

      setExitDirection("undo");
      setSlideDirection(-1);

      const undoneIdx = customTasks.findIndex(t => t.id === lastDecision.taskId);
      if (undoneIdx !== -1) {
        setActiveTaskIndex(undoneIdx);
      }
    } else if (step === 4) {
      setStep(3);
    }
  };


  // Step 3 style question selection handler
  const handleSelectStyle = (questionId: string, value: string) => {
    setStyles((prev) => ({
      ...prev,
      [questionId]: value
    }));

    setSlideDirection(1);
    if (activeStyleIndex < 1) {
      setActiveStyleIndex((prev) => prev + 1);
    } else {
      handleSubmit({
        story,
        taskAssignments,
        styles: {
          ...styles,
          [questionId]: value
        },
        userType: userType || undefined
      });
    }
  };

  // Back action in Step 3 style deck
  const handleBackStyle = () => {
    setSlideDirection(-1);
    if (activeStyleIndex > 0) {
      setActiveStyleIndex((prev) => prev - 1);
    } else {
      setActiveTaskIndex(customTasks.length - 1);
      setStep(4);
    }
  };

  const handleSubmit = async (finalState: JigsawGameState) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/jigsaw-guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameState: finalState })
      });

      if (res.ok) {
        const data: JigsawGuessResponse = await res.json();
        setSynthesis(data);
        setStep(6);
        onCompleteAll(data, finalState);
      } else {
        alert("Có lỗi xảy ra trong quá trình phân tích AI.");
      }
    } catch (e) {
      console.error(e);
      alert("Không thể kết nối với máy chủ.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isStep1Valid = story.trim().length >= 80;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 28 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 28 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="min-h-screen hero-ambient-bg pb-28 pt-24 px-4 md:px-6 relative overflow-hidden">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f1/[0.02]_1px,transparent_1px),linear-gradient(to_bottom,#6366f1/[0.02]_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Step Indicator Headers */}
        {step < 6 && (
          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={onBackToHome}
                className="pill-btn flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Trang chủ
              </motion.button>

              <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-full border border-indigo-100/80">
                {step === 1
                  ? "Khởi động"
                  : step === 2
                    ? "Khảo sát đối tượng"
                    : step === 3
                      ? "Bước 1: Kể câu chuyện"
                      : step === 4
                        ? `Bước 2: Xếp bài năng lực (${decisionHistory.length}/${customTasks.length || 10})`
                        : `Bước 3: Phong cách (${activeStyleIndex + 1}/2)`}
              </span>
            </div>

            {/* Soft progress bar */}
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200/60 p-0.5 shadow-2xs">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width:
                    step === 1
                      ? "5%"
                      : step === 2
                        ? "20%"
                        : step === 3
                          ? "40%"
                          : step === 4
                            ? `${40 + (decisionHistory.length / (customTasks.length || 10)) * 30}%`
                            : `${70 + ((activeStyleIndex + 1) / 2) * 20}%`
                }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Wizard Forms Card */}
        <div className="glass-card rounded-3xl p-5 md:p-8 border border-white/90 shadow-sm min-h-[480px] flex flex-col justify-between overflow-hidden relative">

          <AnimatePresence mode="wait" custom={slideDirection}>

            {/* STEP 1: WELCOME INTRO */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Trải nghiệm RealPath AI
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                      Khám phá năng lực qua cốt truyện của chính bạn
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                      Sử dụng phương pháp Storytelling &amp; Xếp bài năng lực (lấy cảm hứng từ tựa game Balatro) để chẩn đoán hướng nghiệp một cách chân thực nhất.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/50 space-y-2 text-center hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-lg font-bold">
                        1
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">
                        Kể câu chuyện
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Chia sẻ một thành tích, đồ án hay dự án thực tế mà bạn tự hào nhất.
                      </p>
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/50 space-y-2 text-center hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-lg font-bold">
                        2
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">
                        Xếp bài năng lực
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        AI bóc tách 10 việc từ câu chuyện. Bạn chọn cách xử lý: Làm, Nhờ người khác hoặc Bỏ qua.
                      </p>
                    </div>

                    <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/50 space-y-2 text-center hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
                        3
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider font-mono">
                        Chẩn đoán hướng nghiệp
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Nhận báo cáo năng lực chuyên sâu, gợi ý nhóm ngành &amp; việc làm tuyển dụng thực tế.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSlideDirection(1);
                      setStep(2);
                    }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    Bắt đầu ngay
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TARGET GROUP SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2-target"
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      Khảo sát đối tượng
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                      Bạn đang là học sinh hay sinh viên?
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      RealPath AI sẽ tinh chỉnh các nhiệm vụ và gợi ý ngành nghề sao cho phù hợp nhất với giai đoạn học tập của bạn.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserType("student")}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 outline-none cursor-pointer ${
                        userType === "student"
                          ? "bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20"
                          : "bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 hover:border-indigo-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${userType === "student" ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 border border-slate-200"}`}>
                        🎒
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-800">Tôi là học sinh</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-normal">Đang học THCS/THPT, muốn tìm hiểu xu hướng nghề nghiệp.</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserType("undergrad")}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 outline-none cursor-pointer ${
                        userType === "undergrad"
                          ? "bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20"
                          : "bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 hover:border-indigo-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${userType === "undergrad" ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 border border-slate-200"}`}>
                        🎓
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-800">Sinh viên sắp / mới ra trường</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-normal">Đang học Đại học/Cao đẳng hoặc chuẩn bị đi làm.</p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-3 pt-6 border-t border-slate-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSlideDirection(-1);
                      setStep(1);
                    }}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-full cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!userType}
                    onClick={() => {
                      setSlideDirection(1);
                      setStep(3);
                    }}
                    className="px-8 py-3 bg-indigo-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold text-xs rounded-full shadow-md shadow-indigo-600/20 disabled:shadow-none flex items-center gap-2 cursor-pointer transition-all"
                  >
                    Tiếp tục
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ACHIEVEMENT STORY */}
            {step === 3 && (
              <motion.div
                key="step3-story"
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      <PenTool className="w-3 h-3" /> Bước 1: Kể câu chuyện của bạn
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                      Nhập câu chuyện thành tích nổi bật
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Hãy kể lại một thành tích, đồ án hoặc hoạt động mà bạn tự hào. Câu chuyện càng cụ thể (ai làm gì, kết quả ra sao) thì 10 lá bài AI tạo ra sẽ càng phản ánh đúng năng lực thực tế của bạn.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Ví dụ: Tôi từng làm trưởng nhóm thiết kế web cho khoa. Tôi đã lên layout, sắp xếp thời gian làm việc cho 4 bạn và tự tay gỡ lỗi phần giao diện giúp nhóm hoàn thành đồ án xuất sắc..."
                      rows={6}
                      className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white rounded-2xl p-4.5 border border-slate-200/80 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all text-xs md:text-sm outline-none resize-none placeholder:text-slate-400 font-medium leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 px-1">
                      <span className={story.length < 80 ? "text-rose-400" : "text-slate-400"}>Tối thiểu 80 ký tự để AI phân tích chính xác</span>
                      <span className={story.length >= 80 ? "text-emerald-600" : "text-slate-400"}>
                        {story.length} / 80 ký tự
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  {/* API Error Notice */}
                  {taskGenError && (
                    <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 text-xs">
                      <span className="text-rose-500 mt-0.5 shrink-0 text-base">⚠️</span>
                      <div className="space-y-0.5 flex-1">
                        <p className="font-bold text-rose-700">Đang xảy ra sự cố — không thể tạo bộ lá bài</p>
                        <p className="text-rose-600 font-medium">Hệ thống AI không phản hồi. Vui lòng kiểm tra kết nối hoặc thử lại sau ít phút.</p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => {
                        setSlideDirection(-1);
                        setStep(2);
                      }}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-full cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleProceedToStep2}
                      disabled={!isStep1Valid || isGeneratingTasks}
                      className="px-7 py-3 bg-indigo-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs rounded-full shadow-md shadow-indigo-600/20 disabled:shadow-none focus:outline-none flex items-center gap-2 cursor-pointer transition-all"
                    >
                      {isGeneratingTasks ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          AI đang tạo bộ lá bài...
                        </>
                      ) : taskGenError ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          Thử lại
                        </>
                      ) : (
                        <>
                          Chia 10 lá bài
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BALATRO PLAYING CARD DECK INTERFACE */}
            {step === 4 && customTasks.length > 0 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-grow flex flex-col justify-between"
              >
                {/* Header & Controls */}
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-200/80">
                      <Sparkles className="w-3 h-3 text-amber-600" /> BỘ BÀI 10 NHIỆM VỤ ({activeTaskIndex + 1}/10)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Tutorial Banner Button */}
                    <button
                      onClick={() => setShowTutorialModal(!showTutorialModal)}
                      className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-indigo-200/80 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{showTutorialModal ? "Ẩn hướng dẫn" : "Hướng dẫn chơi"}</span>
                    </button>
                  </div>
                </div>

                {/* STEP 2 TUTORIAL GUIDE BANNER */}
                <AnimatePresence>
                  {showTutorialModal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-4 shadow-md space-y-2.5 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center gap-2 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🃏</span>
                          <h4 className="font-extrabold text-xs md:text-sm text-amber-300">
                            Hướng dẫn chơi
                          </h4>
                        </div>
                        <button
                          onClick={() => setShowTutorialModal(false)}
                          className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                        Mỗi lá bài là 1 công việc phát sinh từ câu chuyện của bạn. Cách bạn phân loại chúng sẽ cho AI biết đâu là điểm mạnh cốt lõi, đâu là kỹ năng phụ trợ, và đâu là việc bạn không muốn làm — đây là dữ liệu chính để AI đề xuất ngành nghề.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                        <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                          <strong className="text-emerald-300 block font-bold">🔥 1. Làm (Do Now):</strong>
                          Đây là việc bạn thấy tự tin và muốn làm trực tiếp — AI ghi nhận là <em>điểm mạnh cốt lõi</em>.
                        </div>
                        <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                          <strong className="text-indigo-300 block font-bold">👥 2. Nhờ người khác:</strong>
                          Việc bạn hiểu nhưng không muốn tự làm — AI ghi nhận là <em>kỹ năng quản lý, không phải chuyên môn</em>.
                        </div>
                        <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                          <strong className="text-slate-300 block font-bold">🗑️ 3. Bỏ Qua (Skip):</strong>
                          Việc bạn không quan tâm hoặc không liên quan — AI loại khỏi hồ sơ năng lực của bạn.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ACTIVE PLAYING CARD FOCUS DISPLAY */}
                <div className="relative flex flex-col items-center justify-center min-h-[300px] my-1">

                  {/* Active Card */}
                  {customTasks.length > 0 && activeTaskIndex < customTasks.length && (() => {
                    const task = customTasks[activeTaskIndex];
                    const suitColor = task.cardSuit === "♥" ? "text-rose-600" : task.cardSuit === "♦" ? "text-amber-600" : task.cardSuit === "♣" ? "text-emerald-600" : "text-slate-800";
                    const isRed = task.cardSuit === "♥" || task.cardSuit === "♦";

                    return (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`active-card-${task.id}`}
                          initial={
                            exitDirection === "undo"
                              ? { scale: 0.85, x: -600, y: 100, rotate: -45, opacity: 0 }
                              : { scale: 0.85, y: 20, opacity: 0, rotate: -3 }
                          }
                          animate={{ scale: 1, x: 0, y: 0, opacity: 1, rotate: 0 }}
                          exit={
                            exitDirection === "doNow"
                              ? { x: 600, y: -200, rotate: 45, opacity: 0, scale: 0.85 }
                              : exitDirection === "delegate"
                                ? { x: -600, y: -200, rotate: -45, opacity: 0, scale: 0.85 }
                                : exitDirection === "skip"
                                  ? { x: 0, y: 600, rotate: 15, opacity: 0, scale: 0.85 }
                                  : { y: -20, opacity: 0, scale: 0.85, rotate: 3 }
                          }
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="w-full max-w-sm bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-300 shadow-xl space-y-4 relative overflow-hidden"
                        >
                          {/* Corner Insignia Top Left */}
                          <div className="absolute top-3.5 left-4 flex flex-col items-center leading-none font-mono font-black">
                            <span className={`text-base md:text-lg ${suitColor}`}>{task.cardRank || "A"}</span>
                            <span className={`text-sm md:text-base ${suitColor}`}>{task.cardSuit || "♥"}</span>
                          </div>

                          {/* Corner Insignia Bottom Right */}
                          <div className="absolute bottom-3.5 right-4 flex flex-col items-center leading-none font-mono font-black rotate-180">
                            <span className={`text-base md:text-lg ${suitColor}`}>{task.cardRank || "A"}</span>
                            <span className={`text-sm md:text-base ${suitColor}`}>{task.cardSuit || "♥"}</span>
                          </div>

                          {/* Importance Badge */}
                          <div className="text-center">
                            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full font-mono border ${task.importanceLevel === "Rất cao" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                task.importanceLevel === "Cao" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  "bg-indigo-50 text-indigo-700 border-indigo-200"
                              }`}>
                              Lá bài {task.cardRank}{task.cardSuit} • Tác động {task.importanceLevel || "Quan trọng"}
                            </span>
                          </div>

                          {/* Card Icon & Center Graphic */}
                          <div className="flex justify-center pt-1">
                            <div className={`w-14 h-14 rounded-2xl ${isRed ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-800 border-slate-200"} border flex items-center justify-center text-2xl shadow-inner`}>
                              {task.icon || "📌"}
                            </div>
                          </div>

                          {/* Task Content */}
                          <div className="text-center space-y-1.5 px-3 pb-1">
                            <h4 className="font-extrabold text-sm md:text-base text-slate-800 leading-snug">
                              {task.label}
                            </h4>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    );
                  })()}

                  {/* FAN-OUT HAND DISPLAY AT THE BOTTOM (XÒE BÀI TRÊN TAY) */}
                  <div className="mt-4 flex justify-center items-center gap-0.5 select-none pt-[48px] overflow-x-auto w-full max-w-full pb-1">
                    {(() => {
                      const uncompletedTasks = customTasks.filter(t => !decisionHistory.some(d => d.taskId === t.id));
                      return uncompletedTasks.map((t, visibleIdx) => {
                        const idx = customTasks.findIndex(ct => ct.id === t.id);
                        const isCurrent = idx === activeTaskIndex;
                        const rotationAngle = (visibleIdx - (uncompletedTasks.length - 1) / 2) * 4;
                        const suitColor = t.cardSuit === "♥" ? "text-rose-600" : t.cardSuit === "♦" ? "text-amber-600" : t.cardSuit === "♣" ? "text-emerald-600" : "text-slate-800";

                        return (
                          <motion.div
                            key={t.id}
                            whileHover={{ y: -16, scale: 1.1, zIndex: 40 }}
                            onClick={() => setActiveTaskIndex(idx)}
                            animate={{
                              y: isCurrent ? -8 : 0,
                              rotate: isCurrent ? 0 : rotationAngle,
                              scale: isCurrent ? 1.05 : 0.88,
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={`w-11 h-18 sm:w-13 sm:h-20 bg-white rounded-xl border ${isCurrent
                                ? "border-indigo-600 ring-2 ring-indigo-500/30 shadow-md z-30"
                                : "border-slate-300 shadow-2xs hover:shadow"
                              } p-1 flex flex-col justify-between cursor-pointer transition-colors relative shrink-0`}
                          >
                            <div className="flex justify-between items-start text-[9px] font-mono font-bold leading-none">
                              <span className={suitColor}>{t.cardRank || "A"}</span>
                              <span className={suitColor}>{t.cardSuit || "♥"}</span>
                            </div>

                            <div className="text-center text-xs">
                              {t.icon || "📌"}
                            </div>

                            <div className="text-[8px] font-bold text-center truncate font-mono text-slate-400">
                              #{idx + 1}
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>

                </div>

                {/* BALATRO GAME ACTION CONTROLS PANEL */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {decisionHistory.length < customTasks.length && (
                    <div className="grid grid-cols-3 gap-2.5">

                      {/* Action 1: LÀM (Do Now) */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignTask(customTasks[activeTaskIndex].id, "doNow")}
                        className="py-3 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all focus:outline-none"
                      >
                        <Flame className="w-4 h-4 fill-white" />
                        <span>Làm (Do Now)</span>
                      </motion.button>

                      {/* Action 2: ĐỂ NGƯỜI KHÁC LÀM (Delegate) */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignTask(customTasks[activeTaskIndex].id, "delegate")}
                        className="py-3 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all focus:outline-none"
                      >
                        <Users className="w-4 h-4 fill-white" />
                        <span>Để Người Khác Làm</span>
                      </motion.button>

                      {/* Action 3: BỎ QUA (Skip) */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignTask(customTasks[activeTaskIndex].id, "skip")}
                        className="py-3 px-2 bg-slate-700 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md shadow-slate-700/20 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4 fill-white" />
                        <span>Bỏ Qua (Skip)</span>
                      </motion.button>

                    </div>
                  )}

                  {/* Controller Bar: Undo + Progress */}
                  <div className="flex justify-between items-center text-xs font-bold pt-2 px-1">
                    {decisionHistory.length > 0 ? (
                      <motion.button
                        whileHover={{ x: -2 }}
                        onClick={handleUndoCard}
                        className="text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 focus:outline-none cursor-pointer bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-slate-200/60"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Quay lại lá trước</span>
                      </motion.button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Tiến độ: {decisionHistory.length} / {customTasks.length} lá bài
                      </span>
                      <motion.button
                        whileHover={decisionHistory.length >= 7 ? { scale: 1.03 } : {}}
                        whileTap={decisionHistory.length >= 7 ? { scale: 0.97 } : {}}
                        disabled={decisionHistory.length < 7}
                        onClick={() => {
                          setActiveStyleIndex(0);
                          setStep(5);
                        }}
                        className={`px-4.5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                          decisionHistory.length >= 7
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-indigo-600/10 animate-pulse"
                            : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed"
                        }`}
                      >
                        <span>Tiếp tục</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: STYLE DECK */}
            {step === 5 && gameData.styleQuestions.length > 0 && (
              <motion.div
                key={`step4-card-${activeStyleIndex}`}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5 flex-grow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Brain className="w-3 h-3" /> Bước 3: Phong cách hoạt động ({activeStyleIndex + 1}/2)
                  </span>

                  {story && (
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-600 uppercase">
                        <BookOpen className="w-3 h-3" />
                        <span>Bối cảnh từ câu chuyện ở Bước 1:</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 italic line-clamp-2">
                        "{story}"
                      </p>
                    </div>
                  )}

                  {/* Question Card */}
                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 text-center min-h-[90px] flex items-center justify-center">
                    <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-relaxed">
                      {activeStyleIndex === 0
                        ? "Trong bối cảnh xử lý công việc từ câu chuyện trên, phong cách làm việc tự nhiên của bạn là:"
                        : "Khi cần trau dồi kỹ năng mới để giải quyết công việc trong câu chuyện trên, phương pháp của bạn là:"}
                    </p>
                  </div>
                </div>

                {/* Choice list */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gameData.styleQuestions[activeStyleIndex].options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelectStyle(gameData.styleQuestions[activeStyleIndex].id, opt.value)}
                        className="p-4 bg-white hover:bg-indigo-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-400 text-left transition-all duration-200 flex flex-col justify-between h-28 focus:outline-none shadow-2xs cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-snug">
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Controller */}
                  <div className="flex justify-between items-center text-xs font-bold pt-1">
                    <button
                      onClick={handleBackStyle}
                      className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Câu trước
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeStyleIndex + 1} / 2
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: SYNTHESIS RESULTS */}
            {step === 6 && synthesis && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex-grow"
              >
                <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1 shadow-2xs">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                    Kết quả phân tích tổng hợp
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Bản phác họa chân dung năng lực dựa trên câu chuyện thực tế và các lá bài công việc bạn đã xếp.
                  </p>

                  {story && (
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-100 px-3.5 py-1.5 rounded-xl text-xs font-medium max-w-lg mx-auto text-left">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-2 text-[11px]">
                        <strong className="font-extrabold">Bối cảnh:</strong> "{story}"
                      </span>
                    </div>
                  )}
                </div>

                {/* TOP SECTION: BEGINNER-FRIENDLY BEHAVIORAL ANALYSIS & STRATEGIC PREFERENCE GUIDANCE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Beginner-Friendly Behavioral Analysis Card */}
                  {synthesis.beginnerFriendlyAnalysis && (
                    <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 space-y-2 text-xs shadow-2xs">
                      <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                        <Brain className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Đánh giá từ RealPath AI (Dễ hiểu cho người mới)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {synthesis.beginnerFriendlyAnalysis}
                      </p>
                    </div>
                  )}

                  {/* Strategic Preference Advice Card */}
                  {synthesis.strategicPreferenceAdvice && (
                    <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-2 text-xs shadow-2xs">
                      <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Góc tư vấn định hướng theo mục tiêu cá nhân</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {synthesis.strategicPreferenceAdvice}
                      </p>
                    </div>
                  )}

                </div>

                {/* 3 Columns of Skills Synthesis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Story Skills */}
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 shadow-2xs space-y-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <PenTool className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-extrabold text-[11px] text-emerald-800 uppercase tracking-wider font-mono">
                      Từ câu chuyện
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {synthesis.extractedSkills.map((sk) => (
                        <span key={sk} className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Task Inferences */}
                  <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 shadow-2xs space-y-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-extrabold text-[11px] text-indigo-800 uppercase tracking-wider font-mono">
                      Từ các lá bài chọn
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {synthesis.inferredFromTasks.map((sk) => (
                        <span key={sk} className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Style Inferences */}
                  <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 shadow-2xs space-y-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-extrabold text-[11px] text-purple-800 uppercase tracking-wider font-mono">
                      Từ phong cách
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {synthesis.inferredFromStyles.map((sk) => (
                        <span key={sk} className="text-[10px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Salary disclaimer note */}
                <p className="text-[10px] text-slate-400 font-mono text-center pt-1">
                  * Mức lương mang tính tham khảo, được ước tính từ dữ liệu thị trường — không phải cam kết tuyển dụng thực tế.
                </p>

                {/* Recommendations careers list */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Đề xuất ngành nghề — dựa trên bộ bài &amp; câu chuyện của bạn
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {synthesis.recommendations.map((rec) => {
                      let mappedId = "ky-su-ai";
                      const title = rec.title.toLowerCase();
                      if (title.includes("design") || title.includes("đồ họa") || title.includes("thành")) mappedId = "thiet-ke-do-hoa";
                      else if (title.includes("kiểm toán") || title.includes("audit")) mappedId = "kiem-toan";
                      else if (title.includes("market") || title.includes("tiếp thị")) mappedId = "growth-marketer";
                      else if (title.includes("nhân sự") || title.includes("hr")) mappedId = "quan-tri-nhan-su";
                      else if (title.includes("nội dung") || title.includes("content")) mappedId = "sang-tao-noi-dung";
                      else if (title.includes("tâm lý") || title.includes("psy")) mappedId = "bac-si-tam-ly";

                      return (
                        <div
                          key={rec.title}
                          className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3 hover:border-indigo-300 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-extrabold text-sm text-slate-800 leading-tight">{rec.title}</h5>
                                <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                                  Lương: {rec.salaryRange}
                                </span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                const win = window as any;
                                if (win.handleOpenWorkdayGlobal) {
                                  win.handleOpenWorkdayGlobal(mappedId, rec.title);
                                }
                              }}
                              className="w-full sm:w-auto shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              Chơi thử 1 ngày
                            </motion.button>
                          </div>

                          {/* Why Recommended AI Explanation Box */}
                          {(rec.whyRecommended || rec.reason) && (
                            <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-emerald-50/40 border border-indigo-100/90 rounded-xl p-3.5 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-800">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span>Vì sao bạn nên chọn ngành này? (AI bóc tách từ các lá bài & câu chuyện)</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {rec.whyRecommended || rec.reason}
                              </p>
                            </div>
                          )}

                          {/* Matched Local Company Jobs List */}
                          {rec.matchedJobs && rec.matchedJobs.length > 0 && (
                            <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/60 space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700 font-mono uppercase">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Doanh nghiệp địa phương đang tuyển dụng mảng này:</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {rec.matchedJobs.map((job) => (
                                  <div key={job.id} className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs space-y-1">
                                    <div className="flex justify-between items-start gap-1">
                                      <strong className="font-extrabold text-slate-800 text-[11px] truncate">{job.companyName}</strong>
                                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 shrink-0">
                                        {job.preferenceTag}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-600 truncate">{job.jobTitle}</p>
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                      <span>📍 {job.city}</span>
                                      <span className="font-bold text-indigo-600">{job.salaryRange}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final action */}
                <div className="text-center pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onBackToHome}
                    className="px-7 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-full focus:outline-none cursor-pointer"
                  >
                    Về Trang chủ
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setStory("");
                      setStyles({});
                      setSynthesis(null);
                      setStep(1);
                      setActiveTaskIndex(0);
                      setActiveStyleIndex(0);
                      setShowTutorialModal(true);
                      setDecisionHistory([]);
                      setExitDirection(null);
                      setTaskGenError(null);
                      setUserType(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-7 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-full focus:outline-none shadow-md shadow-slate-800/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Đánh giá lại từ đầu</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* AI Loader status overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-50 space-y-3">
              <RefreshCw className="w-9 h-9 text-indigo-600 animate-spin" />
              <div className="text-center space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">RealPath AI đang phân tích bộ bài...</h4>
                <p className="text-[10px] text-slate-400 font-mono">Bóc tách năng lực &amp; tổng hợp xu hướng</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
