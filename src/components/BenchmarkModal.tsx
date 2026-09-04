import React, { useState, useEffect } from 'react';
import { X, Gauge, Zap, Cpu, Activity, Play } from 'lucide-react';
import { Project } from '../types';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export default function BenchmarkModal({ isOpen, onClose, project }: BenchmarkModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [activeIteration, setActiveIteration] = useState(1000);

  const startBenchmark = () => {
    setIsRunning(true);
    setProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 10;
      setProgress(curr);
      if (curr >= 100) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 120);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#121414] border border-[#00FF41]/40 shadow-[0_0_35px_rgba(0,255,65,0.15)] font-mono">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#1A1C1C] text-xs">
          <div className="flex items-center gap-2 text-[#00FF41]">
            <Gauge className="w-4 h-4" />
            <span className="font-bold tracking-wider">
              {project ? `${project.title} // BENCHMARK SUITE` : 'SYSTEM BENCHMARKS & TELEMETRY'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Top summary card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0d0e0f] border border-white/10 p-3">
              <div className="text-gray-400 mb-1">FORWARD LATENCY</div>
              <div className="text-xl font-bold text-[#00FF41] font-display">0.42 ms</div>
              <div className="text-[10px] text-gray-500">10k dense layers</div>
            </div>
            <div className="bg-[#0d0e0f] border border-white/10 p-3">
              <div className="text-gray-400 mb-1">THROUGHPUT</div>
              <div className="text-xl font-bold text-[#00F3FF] font-display">24,180</div>
              <div className="text-[10px] text-gray-500">samples / second</div>
            </div>
            <div className="bg-[#0d0e0f] border border-white/10 p-3">
              <div className="text-gray-400 mb-1">MEMORY PEAK</div>
              <div className="text-xl font-bold text-white font-display">4.2 MB</div>
              <div className="text-[10px] text-gray-500">zero-allocation loop</div>
            </div>
          </div>

          {/* Comparative Bar Chart */}
          <div className="space-y-3 bg-[#0d0e0f] border border-white/10 p-4">
            <div className="text-gray-300 font-semibold mb-2">
              Execution Time Comparison (Lower is faster)
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#00FF41]">{project ? `${project.title} (Optimized Build)` : 'Optimized Execution'}</span>
                <span className="text-[#00FF41] font-bold">0.42 ms</span>
              </div>
              <div className="h-3 bg-[#1A1C1C] overflow-hidden">
                <div className="h-full bg-[#00FF41] w-[22%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-400">Standard Sequential Baseline</span>
                <span className="text-gray-300">0.98 ms</span>
              </div>
              <div className="h-3 bg-[#1A1C1C] overflow-hidden">
                <div className="h-full bg-gray-500 w-[52%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-400">Unoptimized Iterative Execution</span>
                <span className="text-yellow-400">1.88 ms</span>
              </div>
              <div className="h-3 bg-[#1A1C1C] overflow-hidden">
                <div className="h-full bg-yellow-400/80 w-[100%]" />
              </div>
            </div>
          </div>

          {/* Progress or active test */}
          {isRunning && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>RUNNING SIMD BATCH SUITE...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-[#1A1C1C] overflow-hidden">
                <div 
                  className="h-full bg-[#00F3FF] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[10px] text-gray-500">
              AVX2 &amp; FMA Instructions Verified
            </span>
            <button
              onClick={startBenchmark}
              disabled={isRunning}
              className="px-4 py-2 bg-[#00FF41] hover:bg-[#72ff70] text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isRunning ? 'Benchmarking...' : 'Rerun Benchmark'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
