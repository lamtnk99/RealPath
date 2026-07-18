import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Search, Sparkles, Heart, Compass, Briefcase, Star, TrendingUp } from "lucide-react";
import { Career } from "../types";
import { PRESET_CAREERS, CITIES, CATEGORIES } from "../data";

interface TrendsViewProps {
  onSaveCareer: (career: Career) => void;
  savedCareers: string[];
  onGenerateRoadmapDirect: (career: Career) => void;
}

export default function TrendsView({ onSaveCareer, savedCareers, onGenerateRoadmapDirect }: TrendsViewProps) {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = PRESET_CAREERS.filter((career) => {
    const matchesCity =
      selectedCity === "all" ||
      career.cities.some(
        (c) =>
          c.toLowerCase() ===
          CITIES.find((item) => item.id === selectedCity)?.name.toLowerCase()
      );

    const matchesCategory = selectedCategory === "all" || career.category === CATEGORIES.find(item => item.id === selectedCategory)?.name;

    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white hero-gradient pb-32 px-6 pt-28">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center md:text-left mb-12">
          <span className="text-xs font-bold tracking-wider text-[#5B5FEF] uppercase font-mono bg-[#5B5FEF]/10 px-3 py-1.5 rounded-full">
            Airbnb-style Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-[#1F2937] tracking-tight mt-4 mb-3">
            Khám phá xu hướng nghề
          </h2>
          <p className="text-base text-[#1F2937]/60 max-w-xl leading-relaxed">
            Nắm bắt những xu hướng tuyển dụng bền vững nhất của nền kinh tế số Việt Nam. Dữ liệu thực chiến từ thị trường lao động cao cấp.
          </p>
        </div>

        {/* Filters and Search - Sleek Airbnb Floating bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-4 border border-white/50 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
          {/* Search bar inside the bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1F2937]/40" />
            <input
              type="text"
              placeholder="Tìm tên nghề, kỹ năng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm text-[#1F2937] placeholder-[#1F2937]/40 focus:ring-2 focus:ring-[#5B5FEF]/50 focus:outline-none"
            />
          </div>

          {/* City Pill filters */}
          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto overflow-x-auto py-1">
            {CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`pill-btn px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none whitespace-nowrap ${
                  selectedCity === city.id
                    ? "bg-[#5B5FEF] text-white shadow-md shadow-[#5B5FEF]/20"
                    : "bg-gray-50 hover:bg-[#5B5FEF]/5 text-[#1F2937]/70"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          {/* Category Pill filters */}
          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto overflow-x-auto py-1 border-t lg:border-t-0 lg:border-l border-black/[0.05] pt-3 lg:pt-0 lg:pl-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`pill-btn px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#B8A7FF] text-white shadow-md shadow-[#B8A7FF]/20"
                    : "bg-gray-50 hover:bg-[#B8A7FF]/5 text-[#1F2937]/70"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2.5rem] p-10 border border-black/[0.02]">
            <Compass className="w-12 h-12 text-[#1F2937]/20 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-[#1F2937] mb-1">Không tìm thấy ngành nghề phù hợp</h4>
            <p className="text-sm text-[#1F2937]/50 max-w-sm mx-auto">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc đổi bộ lọc thành phố khác.
            </p>
          </div>
        )}

        {/* Career Airbnb-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCareers.map((career, idx) => {
            const isSaved = savedCareers.includes(career.title);
            return (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card-hover bg-white rounded-[40px] overflow-hidden border border-white/50 shadow-sm flex flex-col justify-between"
                id={`career-card-${idx}`}
              >
                {/* Header Backdrop gradient card */}
                <div className={`h-40 ${career.image || "bg-gradient-to-tr from-[#5B5FEF]/20 to-[#B8A7FF]/20"} relative p-8 flex flex-col justify-end overflow-hidden`}>
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => onSaveCareer(career)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${
                        isSaved 
                          ? "bg-white text-[#FF8F70] scale-105 shadow-md" 
                          : "bg-white/30 backdrop-blur-md text-white hover:bg-white hover:text-[#FF8F70]"
                      }`}
                      title={isSaved ? "Bỏ lưu" : "Lưu nghề nghiệp"}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  
                  {/* Category Pill and Demand badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl uppercase tracking-wider font-mono">
                      {career.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      career.jobDemand === "Cao" 
                        ? "bg-[#8EE3C4]/90 text-[#1F2937]" 
                        : "bg-[#FF8F70]/90 text-white"
                    }`}>
                      Nhu cầu: {career.jobDemand}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-sans font-extrabold text-[#1F2937] tracking-tight group-hover:text-[#5B5FEF] transition-colors duration-300 mb-2">
                    {career.title}
                  </h3>
                  
                  {/* City indicators */}
                  <div className="flex items-center gap-1 text-[#1F2937]/50 text-xs font-medium mb-5">
                    <MapPin className="w-3.5 h-3.5 stroke-[2.5px] text-[#5B5FEF]" />
                    <span>{career.cities.join(" • ")}</span>
                  </div>

                  <p className="text-sm text-[#1F2937]/60 leading-relaxed mb-6">
                    {career.futureOutlook}
                  </p>

                  {/* Skills Section */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest mb-3 font-mono">
                      Kỹ năng cần có
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-medium text-[#1F2937]/70 bg-gray-50 px-3 py-1.5 rounded-xl border border-black/[0.02]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salary section */}
                  <div className="flex items-center justify-between border-t border-black/[0.03] pt-6 mt-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#1F2937]/40 uppercase tracking-widest font-mono">
                        Thu nhập trung bình
                      </span>
                      <p className="text-lg font-black text-[#5B5FEF]">
                        {career.salaryRange}
                      </p>
                    </div>

                    <button
                      onClick={() => onGenerateRoadmapDirect(career)}
                      className="pill-btn px-5 py-3 bg-[#5B5FEF]/10 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white text-xs font-semibold tracking-wide rounded-full transition-all duration-300 focus:outline-none flex items-center gap-1.5"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Lên lộ trình AI
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
