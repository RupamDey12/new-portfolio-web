import React from 'react';
import { Building2, GraduationCap, Trophy, Bookmark } from 'lucide-react';
import { EXPERIENCE_DATA } from '../data/portfolioData';

export default function ExperienceSection() {
  return (
    <section id="experience-section" className="w-full py-8 font-mono">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-base sm:text-lg font-bold text-[#00FF41] flex items-center gap-2">
          <span>&gt; cat experience.log</span>
        </h2>
        <span className="text-xs text-gray-400 font-mono tracking-wider">
          [STATUS: ACTIVE_DEV]
        </span>
      </div>

      {/* Experience List Container */}
      <div className="flex flex-col gap-4">
        {EXPERIENCE_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-[#121414] border border-white/10 hover:border-white/25 p-4 sm:p-5 transition-all group"
          >
            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Period or Award badge */}
                <div
                  className={`px-2.5 py-1 text-xs font-mono font-medium border ${
                    item.isAward
                      ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold shadow-[0_0_8px_rgba(0,255,65,0.3)]'
                      : 'bg-[#1A1C1C] text-gray-300 border-white/15'
                  }`}
                >
                  {item.period}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white font-display">
                  {item.role}
                </h3>
              </div>

              {/* Organization */}
              <div className="flex items-center gap-1.5 text-xs text-[#00F3FF]">
                {item.id === 'exp-1' && <Building2 className="w-3.5 h-3.5" />}
                {item.id === 'exp-2' && <GraduationCap className="w-3.5 h-3.5" />}
                {item.id === 'exp-3' && <Trophy className="w-3.5 h-3.5 text-[#00FF41]" />}
                <span className={item.isAward ? 'text-gray-300' : 'text-[#00F3FF]'}>
                  {item.organization}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Tech / Course Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] bg-[#1A1C1C] border border-white/10 text-gray-300 group-hover:border-[#00FF41]/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
