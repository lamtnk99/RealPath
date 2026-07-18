import React from "react";
import { WORKDAY_CAREERS } from "../../data/workdayCareers";
import CareerOptionCard from "./CareerOptionCard";
import { WorkdayExperience } from "../../types";
import { Briefcase } from "lucide-react";

interface WorkdayCareerPickerProps {
  experiences: Record<string, WorkdayExperience>;
  onSelectCareer: (careerId: string) => void;
  onResetAll?: () => void;
}

export default function WorkdayCareerPicker({ experiences, onSelectCareer, onResetAll }: WorkdayCareerPickerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Centered Title & Intro Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#5B5FEF]/10 text-[#5B5FEF] px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          <Briefcase className="w-4 h-4" aria-hidden="true" />
          <span>Mô phỏng thực tế</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-[#1F2937] tracking-tight">
          💼 Trải nghiệm: Ngày làm việc mô phỏng
        </h1>

        <p className="text-sm md:text-base text-[#1F2937]/70 leading-relaxed">
          Lựa chọn một nghề và thử xử lý những tình huống thường gặp trong một ngày làm việc.
        </p>
      </div>

      {/* 5 Career Cards Responsive Layout: Desktop 5 cols, Tablet 3 cols, Mobile 2 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4 items-stretch">
        {WORKDAY_CAREERS.map((career, index) => {
          const isLastItemOnOddMobile = index === WORKDAY_CAREERS.length - 1;
          return (
            <div
              key={career.id}
              className={`${isLastItemOnOddMobile ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <CareerOptionCard
                career={career}
                experience={experiences[career.id]}
                onSelect={onSelectCareer}
              />
            </div>
          );
        })}
      </div>

      {/* Reset all progress action (if needed) */}
      {onResetAll && Object.keys(experiences).length > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={onResetAll}
            className="text-xs font-mono text-gray-400 hover:text-gray-600 underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded px-2 py-1"
          >
            Bắt đầu lại toàn bộ các nghề
          </button>
        </div>
      )}
    </div>
  );
}
