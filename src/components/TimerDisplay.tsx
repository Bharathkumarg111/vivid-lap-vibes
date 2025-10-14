import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface TimerDisplayProps {
  startTime: Date | null;
  isRunning: boolean;
  isPaused?: boolean;
  elapsedSeconds?: number;
}

export const TimerDisplay = ({ startTime, isRunning, isPaused = false, elapsedSeconds = 0 }: TimerDisplayProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isPaused) {
      setElapsed(elapsedSeconds);
      return;
    }
    
    if (!isRunning || !startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, isPaused, elapsedSeconds]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="relative px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className={`relative overflow-hidden text-center p-16 rounded-[2.5rem] bg-gradient-primary shadow-glow backdrop-blur-sm transition-all duration-500 border border-white/20 ${
        isRunning ? "animate-pulse-glow scale-[1.02]" : "scale-100"
      }`}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`w-3 h-3 rounded-full ${
            isPaused ? "bg-warning" : isRunning ? "bg-success animate-pulse" : "bg-white/50"
          }`} />
          <Timer className={`w-10 h-10 text-primary-foreground drop-shadow-lg ${isRunning && !isPaused ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
          <span className="text-2xl font-bold text-primary-foreground tracking-wide uppercase drop-shadow-lg">
            {isPaused ? "⏸️ Paused" : isRunning ? "⚡ Session Active" : "Ready to Track"}
          </span>
          <div className={`w-3 h-3 rounded-full ${
            isPaused ? "bg-warning" : isRunning ? "bg-success animate-pulse" : "bg-white/50"
          }`} />
        </div>

        {/* Timer display */}
        <div className="relative">
          <div className="text-[7rem] md:text-[8rem] lg:text-[9rem] font-black text-primary-foreground tracking-tight leading-none drop-shadow-2xl">
            <span className="inline-block hover:scale-110 transition-transform">{String(hours).padStart(2, "0")}</span>
            <span className="inline-block animate-pulse mx-2">:</span>
            <span className="inline-block hover:scale-110 transition-transform">{String(minutes).padStart(2, "0")}</span>
            <span className="inline-block animate-pulse mx-2">:</span>
            <span className="inline-block hover:scale-110 transition-transform">{String(seconds).padStart(2, "0")}</span>
          </div>
          <div className="flex justify-center gap-8 text-xl text-primary-foreground/90 mt-6 font-semibold tracking-widest uppercase">
            <span className="drop-shadow">Hours</span>
            <span className="drop-shadow">Minutes</span>
            <span className="drop-shadow">Seconds</span>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/40 rounded-tl-2xl" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/40 rounded-tr-2xl" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/40 rounded-bl-2xl" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/40 rounded-br-2xl" />
      </div>
    </div>
  );
};
