import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface TimerDisplayProps {
  startTime: Date | null;
  isRunning: boolean;
}

export const TimerDisplay = ({ startTime, isRunning }: TimerDisplayProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
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
  }, [isRunning, startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="relative">
      <div className={`text-center p-12 rounded-3xl bg-gradient-primary shadow-glow transition-all duration-300 ${
        isRunning ? "animate-pulse-glow scale-105" : "scale-100"
      }`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Timer className={`w-8 h-8 text-primary-foreground ${isRunning ? "animate-spin" : ""}`} />
          <span className="text-xl font-semibold text-primary-foreground">
            {isRunning ? "Session Active" : "Ready to Track"}
          </span>
        </div>
        <div className="text-7xl font-bold text-primary-foreground tracking-wider">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <div className="text-lg text-primary-foreground/80 mt-4 font-medium">
          hours : minutes : seconds
        </div>
      </div>
    </div>
  );
};
