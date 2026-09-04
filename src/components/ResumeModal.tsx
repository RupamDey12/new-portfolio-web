import React from 'react';
import { X, Download, Printer, ExternalLink, Mail, MapPin } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCE_DATA, SKILLS_DATA, PROJECTS_DATA } from '../data/portfolioData';
import { Project } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  projects?: Project[];
}

export default function ResumeModal({ isOpen, onClose, onShowToast, projects }: ResumeModalProps) {
  if (!isOpen) return null;

  const activeProjects = projects && projects.length > 0 ? projects : PROJECTS_DATA;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple text download of curriculum vitae
    const textContent = `
RUPAM DEY
${PERSONAL_INFO.role}
Email: ${PERSONAL_INFO.email} | GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}

=======================================================
SUMMARY
=======================================================
${PERSONAL_INFO.bio}

=======================================================
EXPERIENCE & EDUCATION
=======================================================
${EXPERIENCE_DATA.map(
  (e) => `[${e.period}] ${e.role} @ ${e.organization}
${e.description}
Keywords: ${e.tags.join(', ')}
`
).join('\n')}

=======================================================
FEATURED PROJECTS
=======================================================
${activeProjects.map(
  (p) => `${p.title} (${p.language}) - ${p.subtitle}
${p.description}
URL: ${p.githubUrl}
`
).join('\n')}

=======================================================
TECHNICAL SKILLS
=======================================================
${SKILLS_DATA.map((s) => `${s.comment}: ${s.title}`).join('\n')}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Rupam_Dey_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Resume downloaded successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#121414] border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.9)] font-mono my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#1A1C1C] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full" />
            <span className="font-bold text-white tracking-wider">
              CURRICULUM VITAE // {PERSONAL_INFO.name.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00FF41] text-black font-bold text-xs hover:bg-[#72ff70] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-gray-300">
          {/* Header */}
          <div className="border-b border-white/10 pb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight mb-1">
                {PERSONAL_INFO.name}
              </h1>
              <div className="text-sm text-[#00FF41] mb-2">{PERSONAL_INFO.role}</div>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#00F3FF]" />
                  {PERSONAL_INFO.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00FF41]" />
                  {PERSONAL_INFO.location}
                </span>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#00FF41] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  GitHub Profile
                </a>
              </div>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-[#1A1C1C]">
              <img
                src={PERSONAL_INFO.avatarUrl}
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PERSONAL_INFO.fallbackAvatarUrl;
                }}
              />
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-2">
              &gt; 01 // SUMMARY
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-3">
              &gt; 02 // EXPERIENCE &amp; EDUCATION
            </h2>
            <div className="space-y-4">
              {EXPERIENCE_DATA.map((item) => (
                <div key={item.id} className="border-l-2 border-white/10 pl-3">
                  <div className="flex flex-wrap justify-between items-baseline gap-1 mb-1">
                    <span className="text-white font-bold">{item.role}</span>
                    <span className="text-gray-500 text-[11px]">{item.period}</span>
                  </div>
                  <div className="text-[#00F3FF] text-[11px] mb-1">{item.organization}</div>
                  <p className="text-gray-400 text-[11px] leading-relaxed mb-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-[#1A1C1C] text-[10px] text-gray-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h2 className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-3">
              &gt; 03 // CORE PROJECTS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeProjects.map((p) => (
                <div key={p.id} className="bg-[#1A1C1C] p-3 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-white font-bold">{p.title}</span>
                      {p.isLiveGithub && (
                        <span className="text-[9px] text-[#00FF41] bg-[#00FF41]/10 px-1 border border-[#00FF41]/30">
                          GITHUB
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#84967e] mb-1.5">{p.subtitle}</div>
                    <p className="text-gray-400 text-[10px] leading-relaxed mb-2">{p.description}</p>
                  </div>
                  <div className="text-[9px] text-gray-500 font-mono flex items-center justify-between pt-1 border-t border-white/5">
                    <span>{p.language}</span>
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00F3FF] hover:underline"
                    >
                      repo &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matrix */}
          <div>
            <h2 className="text-xs font-bold text-[#00FF41] tracking-widest uppercase mb-2">
              &gt; 04 // TECHNICAL COMPETENCIES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKILLS_DATA.map((s) => (
                <div key={s.id} className="p-2 bg-[#1A1C1C] border border-white/5">
                  <div className="text-[10px] text-[#00F3FF]">{s.comment}</div>
                  <div className="text-white font-semibold text-[11px]">{s.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
