import React from 'react';
import { Terminal, Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export default function ToastNotification({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200 font-mono">
      <div className="bg-[#121414] border border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.3)] px-4 py-3 flex items-center gap-3 text-xs text-white">
        <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_6px_#00FF41] animate-pulse" />
        <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />
        <span>{message}</span>
      </div>
    </div>
  );
}
