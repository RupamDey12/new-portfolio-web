import React from 'react';
import { X, Sliders, Sparkles, Monitor, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shaderEnabled: boolean;
  onToggleShader: () => void;
  shaderIntensity: number;
  onChangeIntensity: (val: number) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  shaderEnabled,
  onToggleShader,
  shaderIntensity,
  onChangeIntensity,
  scanlinesEnabled,
  onToggleScanlines,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="w-full max-w-md bg-[#121414] border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#1A1C1C] text-xs">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sliders className="w-4 h-4 text-[#00F3FF]" />
            <span>SYSTEM PREFERENCES</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs text-gray-300">
          {/* Matrix shader toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-white font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                <span>WebGL Matrix Shader</span>
              </div>
              <div className="text-[11px] text-gray-400">
                Live GPU particle and mouse reactive grid
              </div>
            </div>
            <button
              onClick={onToggleShader}
              className={`px-3 py-1 border text-xs font-bold transition-all ${
                shaderEnabled
                  ? 'bg-[#00FF41] text-black border-[#00FF41]'
                  : 'bg-[#1A1C1C] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {shaderEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Shader Intensity */}
          {shaderEnabled && (
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Shader Glow Intensity</span>
                <span className="text-[#00FF41]">{Math.round(shaderIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={shaderIntensity}
                onChange={(e) => onChangeIntensity(parseFloat(e.target.value))}
                className="w-full accent-[#00FF41] bg-[#1A1C1C] h-1.5 cursor-pointer"
              />
            </div>
          )}

          {/* Scanlines toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <div className="space-y-0.5">
              <div className="text-white font-medium flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#00F3FF]" />
                <span>CRT Scanline Overlay</span>
              </div>
              <div className="text-[11px] text-gray-400">
                Retro terminal raster lines
              </div>
            </div>
            <button
              onClick={onToggleScanlines}
              className={`px-3 py-1 border text-xs font-bold transition-all ${
                scanlinesEnabled
                  ? 'bg-[#00F3FF] text-black border-[#00F3FF]'
                  : 'bg-[#1A1C1C] text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {scanlinesEnabled ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          {/* Keyboard shortcuts table */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-white font-medium flex items-center gap-1.5 mb-2">
              <Keyboard className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>KEYBOARD SHORTCUTS</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Command Palette</span>
                <kbd className="bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10 text-white">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Interactive Shell</span>
                <kbd className="bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10 text-white">T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">View Resume</span>
                <kbd className="bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10 text-white">R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Close Modals</span>
                <kbd className="bg-[#1A1C1C] px-1.5 py-0.5 border border-white/10 text-white">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
