import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import TrendsView from "./components/TrendsView";
import AssessmentView from "./components/AssessmentView";
import AnalysisTransition from "./components/AnalysisTransition";
import ResultsView from "./components/ResultsView";
import RoadmapView from "./components/RoadmapView";
import ProfileView from "./components/ProfileView";
import AuthView from "./components/AuthView";
import Footer from "./components/Footer";
import BackgroundVideo from "./components/BackgroundVideo";
import DashboardHomeView from "./components/DashboardHomeView";
import { Career, AssessmentResult, RoadmapResponse, SavedResult, User, JigsawGameState, JigsawGuessResponse, JigsawGameData, WorkdayExperience } from "./types";
import { PRESET_CAREERS } from "./data";
import { WORKDAY_CAREERS } from "./data/workdayCareers";
import WorkdayCareerPicker from "./components/workday/WorkdayCareerPicker";
import WorkdaySimulation from "./components/workday/WorkdaySimulation";
import JigsawWorkdayView from "./components/SimulatedWorkdayView";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [aiStatus, setAiStatus] = useState({ mode: "simulation", message: "" });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App persistent states
  const [savedCareerTitles, setSavedCareerTitles] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<SavedResult[]>([]);
  
  // Workday Simulation states
  const [workdayExperiences, setWorkdayExperiences] = useState<Record<string, WorkdayExperience>>({});
  const [activeWorkdayCareerId, setActiveWorkdayCareerId] = useState<string | null>(null);

  // UI states
  const [quizIsAnalyzing, setQuizIsAnalyzing] = useState<boolean>(false);
  const [roadmapIsLoading, setRoadmapIsLoading] = useState<boolean>(false);

  // Jigsaw-specific states
  const [jigsawState, setJigsawState] = useState<JigsawGameState>({
    story: "",
    taskAssignments: {},
    styles: {}
  });
  const [jigsawGuessResult, setJigsawGuessResult] = useState<JigsawGuessResponse | null>(null);
  const [activeWorkday, setActiveWorkday] = useState<{ id: string; name: string; steps: any[] } | null>(null);
  const [jigsawDataStatic, setJigsawDataStatic] = useState<JigsawGameData | null>(null);

  // Initial Load & API Status Check
  useEffect(() => {
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({ mode: data.mode, message: data.message });
      })
      .catch((err) => {
        console.error("Failed to check AI status:", err);
      });

    const storedUser = localStorage.getItem("auth-current-user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse current user", e);
      }
    }

    const storedSaved = localStorage.getItem("saved-careers");
    if (storedSaved) {
      setSavedCareerTitles(JSON.parse(storedSaved));
    }

    const storedResult = localStorage.getItem("assessment-result");
    if (storedResult) {
      const parsed = JSON.parse(storedResult) as AssessmentResult;
      setAssessmentResult(parsed);

      // Refresh matchedJobs from server to ensure career-specific listings
      const allCareers = [parsed.primaryCareer, ...(parsed.topCareers || []), ...(parsed.careerOptions || [])].filter(Boolean);
      if (allCareers.length > 0) {
        fetch("/api/refresh-matched-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ careers: allCareers.map(c => ({ title: c.title, category: c.category, skillsRequired: c.skillsRequired })) })
        })
          .then(r => r.json())
          .then(data => {
            if (data.refreshed) {
              const jobMap = new Map(data.refreshed.map((r: any) => [r.title, r.matchedJobs]));
              const updatedResult = {
                ...parsed,
                primaryCareer: parsed.primaryCareer ? { ...parsed.primaryCareer, matchedJobs: (jobMap.get(parsed.primaryCareer.title) as any) || parsed.primaryCareer.matchedJobs } : parsed.primaryCareer,
                topCareers: (parsed.topCareers || []).map(c => ({ ...c, matchedJobs: (jobMap.get(c.title) as any) || c.matchedJobs })),
                careerOptions: (parsed.careerOptions || []).map(c => ({ ...c, matchedJobs: (jobMap.get(c.title) as any) || c.matchedJobs })),
              };
              setAssessmentResult(updatedResult);
              localStorage.setItem("assessment-result", JSON.stringify(updatedResult));
            }
          })
          .catch(() => {});
      }
    }

    const storedRoadmap = localStorage.getItem("current-roadmap");
    if (storedRoadmap) {
      setRoadmap(JSON.parse(storedRoadmap));
    }

    const storedHistory = localStorage.getItem("assessment-history");
    if (storedHistory) {
      setAssessmentHistory(JSON.parse(storedHistory));
    }

    const storedJigsawState = localStorage.getItem("jigsaw-game-state");
    if (storedJigsawState) {
      try {
        setJigsawState(JSON.parse(storedJigsawState));
      } catch (e) {
        console.error(e);
      }
    }

    const storedJigsawGuess = localStorage.getItem("jigsaw-guess-result");
    if (storedJigsawGuess) {
      try {
        setJigsawGuessResult(JSON.parse(storedJigsawGuess));
      } catch (e) {
        console.error(e);
      }
    }

    const storedWorkday = localStorage.getItem("workday-experiences-v1");
    if (storedWorkday) {
      try {
        setWorkdayExperiences(JSON.parse(storedWorkday));
      } catch (e) {
        console.error("Failed to parse workday-experiences-v1", e);
      }
    }

    fetch("/api/jigsaw-data")
      .then((res) => res.json())
      .then((data) => {
        setJigsawDataStatic(data);
      })
      .catch((err) => {
        console.error("Failed to load static jigsaw data on mount:", err);
      });
  }, []);

  const handleUpdateWorkdayExperience = (updated: WorkdayExperience) => {
    const nextMap = {
      ...workdayExperiences,
      [updated.careerId]: updated
    };
    setWorkdayExperiences(nextMap);
    localStorage.setItem("workday-experiences-v1", JSON.stringify(nextMap));
  };

  const handleResetAllWorkday = () => {
    if (confirm("Bạn có chắc chắn muốn làm lại toàn bộ tiến trình của cả 5 nghề mô phỏng?")) {
      setWorkdayExperiences({});
      localStorage.removeItem("workday-experiences-v1");
    }
  };

  const handleSaveCareer = (career: Career) => {
    let updated: string[];
    if (savedCareerTitles.includes(career.title)) {
      updated = savedCareerTitles.filter((title) => title !== career.title);
    } else {
      updated = [...savedCareerTitles, career.title];
    }
    setSavedCareerTitles(updated);
    localStorage.setItem("saved-careers", JSON.stringify(updated));
  };

  const handleRemoveSavedCareer = (title: string) => {
    const updated = savedCareerTitles.filter((item) => item !== title);
    setSavedCareerTitles(updated);
    localStorage.setItem("saved-careers", JSON.stringify(updated));
  };

  const handleGenerateRoadmap = async (careerTitle: string, skills: string[]) => {
    setRoadmapIsLoading(true);
    setRoadmap(null);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ careerTitle, skills }),
      });

      if (!res.ok) {
        throw new Error("Tạo lộ trình gặp sự cố");
      }

      const data: RoadmapResponse = await res.json();
      
      setRoadmap(data);
      localStorage.setItem("current-roadmap", JSON.stringify(data));
      localStorage.setItem("roadmap-target-career", careerTitle);
      setCurrentTab("roadmap");

    } catch (error) {
      console.error("Roadmap generation error:", error);
    } finally {
      setRoadmapIsLoading(false);
    }
  };

  const handleGenerateRoadmapDirect = (career: Career) => {
    handleGenerateRoadmap(career.title, career.skillsRequired);
  };

  const handleSelectHistory = (careerTitle: string) => {
    const matchingPreset = PRESET_CAREERS.find((c) => c.title === careerTitle);
    const targetSkills = matchingPreset ? matchingPreset.skillsRequired : ["Kỹ năng chuyên môn", "Kỹ năng thực chiến", "Lập nghiệp"];
    handleGenerateRoadmap(careerTitle, targetSkills);
  };

  const handleClearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử đánh giá?")) {
      setAssessmentHistory([]);
      localStorage.removeItem("assessment-history");
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("auth-current-user", JSON.stringify(user));
    setCurrentTab("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("auth-current-user");
    setCurrentTab("home");
  };

  const savedCareersObjects: Career[] = PRESET_CAREERS.filter((c) =>
    savedCareerTitles.includes(c.title)
  );

  const activeTargetCareer = localStorage.getItem("roadmap-target-career") || (assessmentResult ? assessmentResult.primaryCareer?.title : "") || "";

  const handleCompleteAssessmentNew = (result: JigsawGuessResponse, finalState: JigsawGameState) => {
    setJigsawState(finalState);
    localStorage.setItem("jigsaw-game-state", JSON.stringify(finalState));
    setJigsawGuessResult(result);
    localStorage.setItem("jigsaw-guess-result", JSON.stringify(result));

    if (result.recommendations && result.recommendations.length > 0) {
      const careerOptions: Career[] = result.recommendations.map((rec) => ({
        title: rec.title,
        category: rec.category,
        salaryRange: rec.salaryRange,
        jobDemand: "Cao",
        futureOutlook: (rec as any).futureOutlook || "Ngành nghề có tiềm năng phát triển mạnh mẽ dựa trên kỹ năng của bạn.",
        skillsRequired: rec.skillsRequired,
        matchReason: rec.reason,
        whyRecommended: rec.whyRecommended || rec.reason,
        beginnerFriendlyAnalysis: rec.beginnerFriendlyAnalysis || result.beginnerFriendlyAnalysis,
        strategicPreferenceAdvice: rec.strategicPreferenceAdvice || result.strategicPreferenceAdvice,
        cities: rec.cities,
        shortageNote: (rec as any).shortageNote || "🔥 Thị trường đang thiếu hụt nhân sự tay nghề mảng này.",
        matchedJobs: rec.matchedJobs || result.matchedJobs
      }));

      const primaryCareer = careerOptions[0];
      const topCareers = careerOptions.slice(1);

      const mapped: AssessmentResult = {
        targetDomain: (result as any).targetDomain || primaryCareer.category,
        domainShortageReason: (result as any).domainShortageReason || "Báo cáo thị trường: Việt Nam đang rất khát nhân sự có trình độ chuyên môn cao mảng này.",
        beginnerFriendlyAnalysis: result.beginnerFriendlyAnalysis,
        strategicPreferenceAdvice: result.strategicPreferenceAdvice,
        matchedJobs: result.matchedJobs,
        careerOptions,
        primaryCareer,
        topCareers,
        strengths: result.strengths || result.extractedSkills.map((sk) => ({
          name: sk,
          evidence: "Trích xuất từ câu chuyện thành tích ở Bước 1",
          analysis: "Kỹ năng thể hiện qua kinh nghiệm thực tiễn bạn kể lại."
        })),
        thinkingStyles: result.thinkingStyles || result.inferredFromTasks.map((sk) => ({
          name: sk,
          evidence: "Suy luận từ cách phân công nhiệm vụ ở Bước 2",
          analysis: "Phản ánh ưu tiên xử lý công việc và cách tối ưu hóa hiệu suất."
        })),
        skillGaps: result.skillGaps || result.inferredFromStyles.map((sk) => ({
          name: sk,
          evidence: "Suy luận từ phong cách hoạt động chọn ở Bước 3",
          analysis: "Điểm cần chú ý phát triển thêm để tránh lệch phong cách."
        })),
        naturalLanguageExplanation: `Dựa trên câu chuyện thành tích và cách sắp xếp công việc, bạn thể hiện điểm mạnh ở "${result.extractedSkills.join(', ')}". Khả năng tư duy nổi bật của bạn là "${result.inferredFromTasks.join(', ')}" đi kèm phong cách "${result.inferredFromStyles.join(', ')}".`
      };

      setAssessmentResult(mapped);
      localStorage.setItem("assessment-result", JSON.stringify(mapped));

      const newHistoryItem: SavedResult = {
        date: new Date().toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        primaryCareerTitle: primaryCareer.title,
        category: primaryCareer.category,
      };
      const updatedHistory = [newHistoryItem, ...assessmentHistory];
      setAssessmentHistory(updatedHistory);
      localStorage.setItem("assessment-history", JSON.stringify(updatedHistory));
    }
  };

  const handleResetGame = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử và chơi lại từ đầu?")) {
      const reset: JigsawGameState = {
        story: "",
        taskAssignments: {},
        styles: {}
      };
      setJigsawState(reset);
      setJigsawGuessResult(null);
      setAssessmentResult(null);
      setRoadmap(null);
      localStorage.removeItem("jigsaw-game-state");
      localStorage.removeItem("jigsaw-guess-result");
      localStorage.removeItem("assessment-result");
      localStorage.removeItem("current-roadmap");
      localStorage.removeItem("roadmap-target-career");
    }
  };

  useEffect(() => {
    (window as any).handleOpenWorkdayGlobal = (id: string, name: string) => {
      if (jigsawDataStatic) {
        const steps = jigsawDataStatic.simulatedWorkdays[id] || [];
        setActiveWorkday({ id, name, steps });
      } else {
        fetch("/api/jigsaw-data")
          .then((res) => res.json())
          .then((data) => {
            setJigsawDataStatic(data);
            const steps = data.simulatedWorkdays[id] || [];
            setActiveWorkday({ id, name, steps });
          });
      }
    };
    return () => {
      delete (window as any).handleOpenWorkdayGlobal;
    };
  }, [jigsawDataStatic]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#1F2937] pb-20 md:pb-0 selection:bg-[#5B5FEF]/10 selection:text-[#5B5FEF] relative">
      
      <BackgroundVideo />

      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          if (!currentUser && tab !== "home" && tab !== "trends" && tab !== "auth-login" && tab !== "auth-register" && tab !== "workday") {
            setCurrentTab("auth-register");
          } else {
            setCurrentTab(tab);
          }
        }} 
        aiStatus={aiStatus}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Floating Status Notification Bar */}
      {aiStatus.mode !== "realtime_ai" && (
        <div className="max-w-[1440px] mx-auto px-4 pt-24 relative z-10">
          <div className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md transition-all shadow-xs bg-amber-50/80 border-amber-100 text-amber-800">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0 bg-amber-500" />
              <p>
                <strong className="font-extrabold">Chế độ mô phỏng AI:</strong>{" "}
                RealPath đang chạy ngoại tuyến với thuật toán mô phỏng.
              </p>
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full shrink-0">
              Demo Sandbox
            </span>
          </div>
        </div>
      )}

      {/* Primary Workspace View Switcher with Framer Motion Page Transitions */}
      <main className="relative z-10 min-h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === "home" && (
              currentUser ? (
                <DashboardHomeView
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onNavigate={(tab) => setCurrentTab(tab)}
                  assessmentResult={assessmentResult}
                  assessmentHistory={assessmentHistory}
                  savedCareers={savedCareersObjects}
                  onRemoveSavedCareer={handleRemoveSavedCareer}
                  onSelectHistory={handleSelectHistory}
                  onClearHistory={handleClearHistory}
                  isLoadingRoadmap={roadmapIsLoading}
                  onStartAssessment={() => {
                    setAssessmentResult(null);
                    localStorage.removeItem("assessment-result");
                    setCurrentTab("assessment");
                  }}
                />
              ) : (
                <HomeView
                  onStartJourney={() => {
                    setAssessmentResult(null);
                    localStorage.removeItem("assessment-result");
                    if (!currentUser) {
                      setCurrentTab("auth-register");
                    } else {
                      setCurrentTab("assessment");
                    }
                  }}
                  onNavigate={(tab) => setCurrentTab(tab)}
                  onOpenWorkday={(id) => {
                    setActiveWorkdayCareerId(id);
                    setCurrentTab("workday");
                  }}
                />
              )
            )}

            {currentTab === "trends" && (
              <TrendsView
                onSaveCareer={handleSaveCareer}
                savedCareers={savedCareerTitles}
                onGenerateRoadmapDirect={handleGenerateRoadmapDirect}
              />
            )}

            {currentTab === "workday" && (
              <div className="pt-24 px-4 max-w-[1440px] mx-auto">
                {activeWorkdayCareerId ? (
                  (() => {
                    const career = WORKDAY_CAREERS.find((c) => c.id === activeWorkdayCareerId);
                    if (!career) return null;
                    return (
                      <WorkdaySimulation
                        career={career}
                        initialExperience={workdayExperiences[career.id]}
                        onUpdateExperience={handleUpdateWorkdayExperience}
                        onBackToPicker={() => setActiveWorkdayCareerId(null)}
                        onSaveToCareerJigsaw={() => {
                          setCurrentTab("assessment");
                        }}
                      />
                    );
                  })()
                ) : (
                  <WorkdayCareerPicker
                    experiences={workdayExperiences}
                    onSelectCareer={(id) => setActiveWorkdayCareerId(id)}
                    onResetAll={handleResetAllWorkday}
                  />
                )}
              </div>
            )}

            {currentTab === "auth-register" && (
              <AuthView
                initialMode="register"
                onAuthSuccess={handleAuthSuccess}
                onBackToHome={() => setCurrentTab("home")}
              />
            )}

            {currentTab === "auth-login" && (
              <AuthView
                initialMode="login"
                onAuthSuccess={handleAuthSuccess}
                onBackToHome={() => setCurrentTab("home")}
              />
            )}

            {currentTab === "assessment" && (
              <>
                {!currentUser ? (
                  <AuthView
                    initialMode="register"
                    onAuthSuccess={handleAuthSuccess}
                    onBackToHome={() => setCurrentTab("home")}
                  />
                ) : quizIsAnalyzing ? (
                  <AnalysisTransition />
                ) : assessmentResult ? (
                  <ResultsView
                    result={assessmentResult}
                    onGenerateRoadmap={handleGenerateRoadmap}
                    isLoadingRoadmap={roadmapIsLoading}
                    onSaveCareer={handleSaveCareer}
                    savedCareers={savedCareerTitles}
                    onRestartAssessment={() => {
                      setAssessmentResult(null);
                      setJigsawGuessResult(null);
                      localStorage.removeItem("jigsaw-guess-result");
                    }}
                  />
                ) : (
                  <AssessmentView
                    onCompleteAll={handleCompleteAssessmentNew}
                    onBackToHome={() => setCurrentTab("home")}
                  />
                )}
              </>
            )}

            {currentTab === "roadmap" && (
              <RoadmapView
                roadmap={roadmap}
                targetCareerTitle={activeTargetCareer}
                onNavigateToQuiz={() => setCurrentTab("assessment")}
              />
            )}

            {currentTab === "profile" && (
              <ProfileView
                savedCareers={savedCareersObjects}
                onRemoveSavedCareer={handleRemoveSavedCareer}
                assessmentHistory={assessmentHistory}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
                currentUser={currentUser}
                onLogout={handleLogout}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Simulated Workday Overlay Modal */}
      <AnimatePresence>
        {activeWorkday && (
          <JigsawWorkdayView
            industryId={activeWorkday.id}
            industryName={activeWorkday.name}
            steps={activeWorkday.steps}
            onClose={() => setActiveWorkday(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
