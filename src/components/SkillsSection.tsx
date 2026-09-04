import React from 'react';
import { SKILLS_DATA } from '../data/portfolioData';

export default function SkillsSection() {
  return (
    <section id="stack-section" className="w-full py-8 font-mono">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-bold text-[#00FF41] flex items-center gap-2">
          <span>&gt; cat skills.json</span>
        </h2>
      </div>

      {/* 4-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILLS_DATA.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#121414] border border-white/10 hover:border-[#00F3FF]/40 p-4 transition-all duration-150 hover:-translate-y-0.5 group"
          >
            {/* Syntax comment line */}
            <div className="text-xs text-[#84967e] mb-2 font-mono group-hover:text-[#00F3FF] transition-colors">
              {skill.comment}
            </div>

            {/* Title / Description */}
            <div className="text-sm sm:text-base font-semibold text-white tracking-tight font-display">
              {skill.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
