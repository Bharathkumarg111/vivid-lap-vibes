import { Award, Flame } from "lucide-react";

interface ConsistencyMeterProps {
  dayCount: number;
}

export const ConsistencyMeter = ({ dayCount }: ConsistencyMeterProps) => {
  const getMeterLevel = () => {
    if (dayCount > 10) return 10;
    return dayCount;
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/20 via-accent/20 to-success/20 rounded-3xl p-8 shadow-elegant hover:shadow-glow transition-all duration-500 overflow-hidden group border border-white/10 backdrop-blur-sm">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 animate-float blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-success/20 rounded-full -ml-16 -mb-16 animate-float blur-2xl" style={{ animationDelay: "1.5s" }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-success rounded-2xl flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-success-foreground" />
            </div>
            <div>
              <h3 className="text-foreground font-bold text-xl tracking-wide">Consistency Streak</h3>
              <p className="text-foreground/70 text-sm">Keep the momentum going!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gradient-primary rounded-2xl px-5 py-3 shadow-lg">
            <Award className="w-6 h-6 text-primary-foreground" />
            <span className="text-primary-foreground font-black text-2xl">
              {dayCount > 10 ? "10+" : dayCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground/80 font-semibold text-sm uppercase tracking-wider">Progress</span>
            <span className="text-foreground font-bold text-lg">{getMeterLevel()}/10+</span>
          </div>
          <div className="h-4 bg-background/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-success via-primary to-accent transition-all duration-1000 rounded-full shadow-glow-success relative overflow-hidden"
              style={{ width: `${Math.min((getMeterLevel() / 10) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
            </div>
          </div>
          <p className="text-foreground/60 text-xs text-center italic">
            {dayCount === 0 && "Start your journey today!"}
            {dayCount > 0 && dayCount <= 3 && "Great start! Keep it up!"}
            {dayCount > 3 && dayCount <= 7 && "You're building momentum!"}
            {dayCount > 7 && dayCount <= 10 && "Incredible consistency!"}
            {dayCount > 10 && "🔥 Unstoppable legend! 🔥"}
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-foreground/20 rounded-tl-lg" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-foreground/20 rounded-br-lg" />
    </div>
  );
};
