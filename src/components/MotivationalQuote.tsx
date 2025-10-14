import { Sparkles, Award } from "lucide-react";

const dayQuotes = [
  "Start Strong",
  "Stay in Motion",
  "Push Through",
  "Focus Mode",
  "Halfway There",
  "Level Up",
  "Rest Smartly",
  "Renew Drive",
  "Prove Yourself",
  "Streak Winner",
];

interface MotivationalQuoteProps {
  dayCount: number;
}

export const MotivationalQuote = ({ dayCount }: MotivationalQuoteProps) => {
  const getQuote = () => {
    if (dayCount === 0) return "Start Strong";
    if (dayCount > 10) return "Streak Winner";
    return dayQuotes[dayCount - 1];
  };

  const getMeterLevel = () => {
    if (dayCount > 10) return 10;
    return dayCount;
  };

  return (
    <div className="relative bg-gradient-secondary rounded-3xl p-10 shadow-elegant hover:shadow-glow-secondary transition-all duration-500 overflow-hidden group border border-white/20">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-float blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 animate-float blur-2xl" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-secondary-foreground animate-pulse" />
            </div>
            <span className="text-secondary-foreground font-bold text-2xl tracking-wide drop-shadow">Daily Motivation</span>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
            <Award className="w-6 h-6 text-secondary-foreground" />
            <span className="text-secondary-foreground font-bold text-xl">
              Day {dayCount > 10 ? "10+" : dayCount}
            </span>
          </div>
        </div>
        
        <p className="text-3xl font-black text-secondary-foreground transition-all duration-300 leading-relaxed drop-shadow-lg mb-6">
          "{getQuote()}"
        </p>

        {/* Consistency Meter */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary-foreground/90 font-semibold text-sm uppercase tracking-wider">Consistency Meter</span>
            <span className="text-secondary-foreground font-bold text-lg">{getMeterLevel()}/10+</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-success to-success-foreground transition-all duration-1000 rounded-full shadow-glow-success"
              style={{ width: `${Math.min((getMeterLevel() / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-xl" />
    </div>
  );
};
