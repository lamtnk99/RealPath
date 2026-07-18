import React, { useState, useEffect } from "react";
import { WorkdayCareer, WorkdayExperience, WorkdaySelection, SimulationChoice, WorkdayAnalysis, WorkdayScenario } from "../../types";
import SimulationHeader from "./SimulationHeader";
import ScenarioCard from "./ScenarioCard";
import ChoiceButton from "./ChoiceButton";
import ChoiceFeedback from "./ChoiceFeedback";
import WorkdayResult from "./WorkdayResult";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

interface WorkdaySimulationProps {
  career: WorkdayCareer;
  initialExperience?: WorkdayExperience;
  onUpdateExperience: (experience: WorkdayExperience) => void;
  onBackToPicker: () => void;
  onSaveToCareerJigsaw?: () => void;
}

export default function WorkdaySimulation({
  career,
  initialExperience,
  onUpdateExperience,
  onBackToPicker,
  onSaveToCareerJigsaw
}: WorkdaySimulationProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(
    initialExperience?.currentScenarioIndex ?? 0
  );
  const [selections, setSelections] = useState<WorkdaySelection[]>(
    initialExperience?.selections ?? []
  );
  const [status, setStatus] = useState<"not_started" | "in_progress" | "completed">(
    initialExperience?.status ?? "in_progress"
  );
  const [analysis, setAnalysis] = useState<WorkdayAnalysis | null>(
    initialExperience?.analysis ?? null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Dynamic AI Scenarios State
  const [activeScenarios, setActiveScenarios] = useState<WorkdayScenario[]>(career.scenarios);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState<boolean>(false);
  const [aiGeneratedTag, setAiGeneratedTag] = useState<boolean>(false);

  useEffect(() => {
    if (status !== "completed") {
      setIsGeneratingScenarios(true);
      fetch("/api/workday-generate-scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerId: career.id,
          careerTitle: career.title
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.scenarios && Array.isArray(data.scenarios) && data.scenarios.length === 3) {
            setActiveScenarios(data.scenarios);
            setAiGeneratedTag(true);
          }
        })
        .catch((err) => console.error("Dynamic scenarios generation error:", err))
        .finally(() => setIsGeneratingScenarios(false));
    }
  }, [career.id]);

  const totalScenarios = activeScenarios.length;
  const currentScenario = activeScenarios[currentScenarioIndex];

  // Current selection for active scenario if already answered
  const currentSelection = selections.find((s) => s.scenarioId === currentScenario?.id);
  const selectedChoice = currentScenario?.choices.find((c) => c.id === currentSelection?.choiceId);

  // Sync state changes to parent persistence
  const syncExperience = (
    newIndex: number,
    newSelections: WorkdaySelection[],
    newStatus: "not_started" | "in_progress" | "completed",
    newAnalysis: WorkdayAnalysis | null
  ) => {
    const updated: WorkdayExperience = {
      careerId: career.id,
      currentScenarioIndex: newIndex,
      selections: newSelections,
      status: newStatus,
      analysis: newAnalysis,
      updatedAt: new Date().toISOString()
    };
    onUpdateExperience(updated);
  };

  // Handle selecting an option A, B, C for the active scenario
  const handleSelectChoice = (choice: SimulationChoice) => {
    const newSelection: WorkdaySelection = {
      scenarioId: currentScenario.id,
      choiceId: choice.id,
      selectedAt: new Date().toISOString()
    };

    // Replace or add selection for current scenario
    const updatedSelections = selections.filter((s) => s.scenarioId !== currentScenario.id);
    updatedSelections.push(newSelection);

    setSelections(updatedSelections);
    syncExperience(currentScenarioIndex, updatedSelections, "in_progress", null);
  };

  // Handle clicking "Tình huống tiếp theo" or "Xem kết quả"
  const handleNextScenario = async () => {
    if (currentScenarioIndex < totalScenarios - 1) {
      const nextIdx = currentScenarioIndex + 1;
      setCurrentScenarioIndex(nextIdx);
      syncExperience(nextIdx, selections, "in_progress", null);
    } else {
      // Completed all 3 scenarios: trigger Gemini analysis
      setIsAnalyzing(true);

      // Prepare payload with selected choices details & signals
      const formattedSelections = selections.map((sel) => {
        const scenario = career.scenarios.find((s) => s.id === sel.scenarioId);
        const choice = scenario?.choices.find((c) => c.id === sel.choiceId);
        return {
          scenarioId: sel.scenarioId,
          scenarioTitle: scenario?.title,
          selectedChoiceId: sel.choiceId,
          selectedChoiceLabel: choice?.label,
          outcome: choice?.outcome,
          consideration: choice?.consideration,
          signals: choice?.signals
        };
      });

      try {
        const res = await fetch("/api/workday-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            careerId: career.id,
            careerTitle: career.title,
            scenarios: career.scenarios,
            userSelections: formattedSelections
          })
        });
        const data: WorkdayAnalysis = await res.json();
        setAnalysis(data);
        setStatus("completed");
        syncExperience(currentScenarioIndex, selections, "completed", data);
      } catch (err) {
        console.error("Failed to analyze workday simulation:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Allow going back to previous scenario
  const handlePrevScenario = () => {
    if (currentScenarioIndex > 0) {
      const prevIdx = currentScenarioIndex - 1;
      setCurrentScenarioIndex(prevIdx);
      syncExperience(prevIdx, selections, status, analysis);
    }
  };

  // Replay this specific career simulation
  const handleReplayThisCareer = () => {
    setCurrentScenarioIndex(0);
    setSelections([]);
    setStatus("in_progress");
    setAnalysis(null);
    syncExperience(0, [], "in_progress", null);
  };

  // Render Completed Result Screen
  if (status === "completed" && analysis && !isAnalyzing) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <WorkdayResult
          career={career}
          analysis={analysis}
          onReplay={handleReplayThisCareer}
          onSelectOtherCareer={onBackToPicker}
          onSaveToCareerJigsaw={onSaveToCareerJigsaw}
        />
      </div>
    );
  }

  // Render Loading AI Scenario Generation Screen
  if (isGeneratingScenarios) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#5B5FEF]/10 text-[#5B5FEF] flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-8 h-8 text-[#5B5FEF] animate-spin" />
        </div>
        <h3 className="text-xl font-extrabold text-[#1F2937]">
          AI Studio đang khởi tạo kịch bản...
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Đang gọi mô hình Gemini 3.5 Flash để tạo bộ 3 tình huống độc quyền theo chủ đề <strong>{career.title}</strong>.
        </p>
      </div>
    );
  }

  // Render Loading AI Analysis Screen
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#5B5FEF]/10 text-[#5B5FEF] flex items-center justify-center mx-auto animate-spin">
          <Loader2 className="w-8 h-8 text-[#5B5FEF]" />
        </div>
        <h3 className="text-xl font-extrabold text-[#1F2937]">
          Đang tổng hợp nhận xét ngày làm việc...
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Gemini AI đang phân tích các lựa chọn của bạn trong vai trò <strong>{career.title}</strong>.
        </p>
      </div>
    );
  }

  // Render Active Scenario Simulation Screen
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Simulation Header */}
      <SimulationHeader
        career={career}
        currentScenarioIndex={currentScenarioIndex}
        totalScenarios={totalScenarios}
        onBackToPicker={onBackToPicker}
      />

      {/* Scenario Card */}
      {currentScenario && (
        <ScenarioCard scenario={currentScenario} index={currentScenarioIndex} />
      )}

      {/* 3 Choice Buttons (A, B, C) */}
      {currentScenario && (
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
            Chọn một phương án xử lý:
          </p>
          <div className="space-y-2.5">
            {currentScenario.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                isSelected={selectedChoice?.id === choice.id}
                isLocked={!!selectedChoice}
                onSelect={handleSelectChoice}
              />
            ))}
          </div>
        </div>
      )}

      {/* Immediate Choice Feedback (Shown right below choice once selected) */}
      {selectedChoice && (
        <ChoiceFeedback
          choice={selectedChoice}
          isLastScenario={currentScenarioIndex === totalScenarios - 1}
          onNextScenario={handleNextScenario}
        />
      )}

      {/* Footer Controllers: Previous scenario button */}
      <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-black/[0.04]">
        {currentScenarioIndex > 0 ? (
          <button
            onClick={handlePrevScenario}
            className="text-[#1F2937]/60 hover:text-[#5B5FEF] flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#5B5FEF] rounded px-2 py-1 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tình huống trước</span>
          </button>
        ) : (
          <div />
        )}

        <span className="text-[11px] text-gray-400 font-mono">
          Tiến trình: {currentScenarioIndex + 1} / {totalScenarios}
        </span>
      </div>
    </div>
  );
}
