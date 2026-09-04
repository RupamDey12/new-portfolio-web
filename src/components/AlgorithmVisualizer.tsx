import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, BarChart3, FastForward } from 'lucide-react';
import { SortAlgorithm } from '../types';

interface AlgorithmVisualizerProps {
  onSelectAlgorithm?: (algo: SortAlgorithm) => void;
}

export default function AlgorithmVisualizer({ onSelectAlgorithm }: AlgorithmVisualizerProps) {
  const DEFAULT_SIZE = 28;
  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [comparisons, setComparisons] = useState<number>(0);

  const isRunningRef = useRef(isRunning);
  const speedRef = useRef(speed);
  isRunningRef.current = isRunning;
  speedRef.current = speed;

  // Generate initial random array
  const generateArray = useCallback(() => {
    const newArr: number[] = [];
    for (let i = 0; i < DEFAULT_SIZE; i++) {
      // Scale from 15 to 95
      newArr.push(Math.floor(Math.random() * 80) + 15);
    }
    setArray(newArr);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisons(0);
  }, []);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Sleep helper that respects current speed and isRunning flag
  const sleep = (ms: number) => {
    const adjusted = ms / speedRef.current;
    return new Promise((resolve) => setTimeout(resolve, adjusted));
  };

  // Run bubble sort loop
  useEffect(() => {
    if (!isRunning || array.length === 0) return;

    let cancelled = false;

    async function runBubbleSort() {
      const arr = [...array];
      const n = arr.length;
      let comps = comparisons;

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (!isRunningRef.current || cancelled) return;

          setComparing([j, j + 1]);
          comps++;
          setComparisons(comps);
          await sleep(60);

          if (arr[j] > arr[j + 1]) {
            setSwapping([j, j + 1]);
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            setArray([...arr]);
            await sleep(60);
            setSwapping([]);
          }
        }
        setSortedIndices((prev) => [...prev, n - i - 1]);
      }
      setComparing([]);
      setSwapping([]);
      setIsRunning(false);

      // Brief delay before looping with a new array for a living feel
      await sleep(1800);
      if (!cancelled) {
        generateArray();
        setIsRunning(true);
      }
    }

    runBubbleSort();

    return () => {
      cancelled = true;
    };
  }, [isRunning, array.length === 0]);

  const complexityMap: Record<SortAlgorithm, string> = {
    bubble: 'O(N²)',
    quick: 'O(N log N)',
    insertion: 'O(N²)',
    selection: 'O(N²)',
  };

  const getBarColor = (index: number) => {
    if (swapping.includes(index)) {
      return 'bg-[#00FF41] shadow-[0_0_12px_#00FF41]'; // Glowing matrix green on swap
    }
    if (comparing.includes(index)) {
      return 'bg-[#00F3FF] shadow-[0_0_12px_#00F3FF]'; // Glowing cyan on compare
    }
    if (sortedIndices.includes(index)) {
      return 'bg-[#3b4b37] hover:bg-[#00FF41]/60 transition-colors';
    }
    return 'bg-[#292a2a] hover:bg-[#343535]';
  };

  return (
    <div className="w-full bg-[#121414] border border-white/10 p-3 sm:p-4 flex flex-col justify-between font-mono relative overflow-hidden group">
      {/* Top terminal-style bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#00FF41]" />
          <span className="text-white font-medium">visualizer.exe</span>
          <span className="text-[#00FF41] bg-[#00FF41]/10 px-1.5 py-0.5 border border-[#00FF41]/30 text-[10px]">
            {complexityMap[algorithm]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-[11px] hidden sm:inline">
            [Running: <span className="text-white capitalize">{algorithm} Sort</span>]
          </span>

          {/* Speed switch */}
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <span>SPEED:</span>
            <button
              onClick={() => setSpeed(1)}
              className={`px-1.5 py-0.5 border transition-all ${
                speed === 1
                  ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold'
                  : 'bg-[#1A1C1C] text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(2)}
              className={`px-1.5 py-0.5 border transition-all ${
                speed === 2
                  ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold'
                  : 'bg-[#1A1C1C] text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              className={`px-1.5 py-0.5 border transition-all ${
                speed === 4
                  ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold'
                  : 'bg-[#1A1C1C] text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              4x
            </button>
          </div>
        </div>
      </div>

      {/* Main Bars Canvas Container */}
      <div className="h-44 sm:h-52 flex items-end justify-between gap-1 px-1 py-2 bg-[#0d0e0f] border border-white/5 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

        {array.map((val, idx) => (
          <div
            key={idx}
            className={`flex-1 transition-all duration-75 ${getBarColor(idx)}`}
            style={{ height: `${val}%` }}
            title={`idx: ${idx}, val: ${val}`}
          />
        ))}
      </div>

      {/* Footer bar with controls and live metrics */}
      <div className="flex items-center justify-between pt-2.5 mt-2 text-[11px] text-[#84967e] border-t border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1 text-white hover:text-[#00FF41] transition-colors"
            title={isRunning ? 'Pause' : 'Resume'}
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3 text-[#00F3FF]" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#00FF41]" />
                <span>RESUME</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              generateArray();
              setTimeout(() => setIsRunning(true), 150);
            }}
            className="flex items-center gap-1 text-[#84967e] hover:text-white transition-colors"
            title="Randomize array"
          >
            <Shuffle className="w-3 h-3" />
            <span>SHUFFLE</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[10px]">
            COMPS: <span className="text-white font-mono">{comparisons}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-ping" />
            <span className="text-[#00FF41]">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
