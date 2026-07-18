export interface LocalJobPosting {
  id: string;
  companyName: string;
  jobTitle: string;
  category: string;
  city: string;
  salaryRange: string;
  jobType: string;
  skillsRequired: string[];
  preferenceTag: string;
  companyPerks?: string;
  contactLink?: string;
}

export interface Career {
  title: string;
  category: string;
  salaryRange: string;
  jobDemand: "Cao" | "Trung bình" | "Thấp";
  futureOutlook: string;
  skillsRequired: string[];
  matchReason: string;
  whyRecommended?: string; // AI generated personalized reason explaining why based on user's tasks
  beginnerFriendlyAnalysis?: string; // Easy plain language explanation for beginners
  strategicPreferenceAdvice?: string; // Decision trade-off advice based on user goals
  cities: string[];
  shortageNote?: string; // Tình trạng khát nhân lực thực tế
  image?: string; // custom gradient/image tag
  matchedJobs?: LocalJobPosting[]; // Matched local company job opportunities
}

export interface AnalysisFactor {
  name: string;
  evidence: string;
  analysis: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export interface AssessmentResult {
  targetDomain?: string;
  domainShortageReason?: string;
  beginnerFriendlyAnalysis?: string;
  strategicPreferenceAdvice?: string;
  careerOptions: Career[];
  primaryCareer?: Career;
  topCareers?: Career[];
  strengths: AnalysisFactor[];
  thinkingStyles: AnalysisFactor[];
  skillGaps: AnalysisFactor[];
  naturalLanguageExplanation: string;
  userInputsMemory?: Record<string, any>;
  riskAnalysis?: RiskItem[];
  matchedJobs?: LocalJobPosting[];
}

export interface RoadmapStep {
  stage: string;
  title: string;
  duration: string;
  skillsToLearn: string[];
  recommendedProjects: string[];
  certifications: string[];
  colleges: string[];
  vocationalSchools: string[];
  tips: string;
}

export interface RoadmapResponse {
  steps: RoadmapStep[];
}

export interface SavedResult {
  date: string;
  primaryCareerTitle: string;
  category: string;
  matchScore?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isRegistered?: boolean;
}

// ----------------------------------------------------
// CAREER JIGSAW 4-STEP WIZARD GAME TYPES
// ----------------------------------------------------

export interface TimeManagementTask {
  id: string;
  label: string;
  icon: string;
  type: "logic" | "creative" | "social" | "operational";
  description: string;
  cardRank?: string; // "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"
  cardSuit?: string; // "♥", "♦", "♣", "♠"
  cardValueOrder?: number; // Numeric rank+suit value order (Hearts=4, Diamonds=3, Clubs=2, Spades=1)
  importanceLevel?: "Rất cao" | "Cao" | "Trung bình" | "Tiêu chuẩn";
}

export interface StyleOption {
  value: string;
  label: string;
}

export interface StyleQuestion {
  id: string;
  title: string;
  options: StyleOption[];
}

export interface JigsawIndustry {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  awesome: string;
  terrible: string;
  details: Career;
}

export interface JigsawGameData {
  tasks: TimeManagementTask[];
  styleQuestions: StyleQuestion[];
  industries: JigsawIndustry[];
}

export interface JigsawGameState {
  story: string;
  taskAssignments: Record<string, "doNow" | "delegate" | "skip">; // e.g. { "soan-so-lieu": "doNow" }
  styles: Record<string, string>; // e.g. { "workStyle": "collaborative" }
  userType?: "student" | "undergrad";
}

export interface JigsawRecommendation {
  title: string;
  category: string;
  reason: string;
  whyRecommended?: string; // AI generated personalized reason explaining why based on user's tasks
  beginnerFriendlyAnalysis?: string;
  strategicPreferenceAdvice?: string;
  salaryRange: string;
  skillsRequired: string[];
  cities: string[];
  image?: string;
  matchedJobs?: LocalJobPosting[];
}

export interface JigsawGuessResponse {
  targetDomain?: string;
  domainShortageReason?: string;
  beginnerFriendlyAnalysis?: string;
  strategicPreferenceAdvice?: string;
  extractedSkills: string[];
  inferredFromTasks: string[];
  inferredFromStyles: string[];
  strengths?: Array<{ name: string; evidence: string; analysis: string }>;
  thinkingStyles?: Array<{ name: string; evidence: string; analysis: string }>;
  skillGaps?: Array<{ name: string; evidence: string; analysis: string }>;
  recommendations: JigsawRecommendation[];
  matchedJobs?: LocalJobPosting[];
}

export interface QuizOption {
  value: string;
  label: string;
  icon: string;
  description?: string;
  imageClass?: string;
}

export interface QuizQuestion {
  id: string;
  type: string;
  title: string;
  description: string;
  options: QuizOption[];
}

export interface SimulatedStep {
  time: string;
  scenario: string;
  options: {
    text: string;
    insight: string;
  }[];
}

// ----------------------------------------------------
// WORKDAY SIMULATION EXPERIENCE TYPES
// ----------------------------------------------------

export interface SimulationChoice {
  id: string; // "A" | "B" | "C"
  label: string;
  outcome: string;
  consideration: string;
  signals: string[];
}

export interface WorkdayScenario {
  id: string;
  time: string;
  title: string;
  description: string;
  choices: SimulationChoice[];
}

export interface WorkdayCareer {
  id: "ai-engineer" | "graphic-designer" | "auditor" | "growth-marketer" | "hr-manager";
  title: string;
  iconName: string;
  bgColorClass: string;
  intro: string;
  scenarios: WorkdayScenario[];
}

export interface WorkdayAnalysisObservation {
  title: string;
  evidence: string;
  caveat: string;
}

export interface WorkdayInterestSignal {
  name: string;
  reason: string;
}

export interface WorkdaySmallExperiment {
  title: string;
  description: string;
  estimatedTime: string;
}

export interface WorkdayAnalysis {
  careerId: string;
  summary: string;
  observations: WorkdayAnalysisObservation[];
  interestSignals: WorkdayInterestSignal[];
  smallExperiment: WorkdaySmallExperiment;
  disclaimer: string;
}

export interface WorkdaySelection {
  scenarioId: string;
  choiceId: string;
  selectedAt: string;
}

export interface WorkdayExperience {
  careerId: string;
  currentScenarioIndex: number;
  selections: WorkdaySelection[];
  status: "not_started" | "in_progress" | "completed";
  analysis: WorkdayAnalysis | null;
  updatedAt: string;
}

