import { useState, useEffect } from "react";
import { Play, Square, Download, RotateCcw, TrendingUp, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimerDisplay } from "@/components/TimerDisplay";
import { StatCard } from "@/components/StatCard";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { ConsistencyMeter } from "@/components/ConsistencyMeter";
import { SessionHistory } from "@/components/SessionHistory";
import { UsageCalendar } from "@/components/UsageCalendar";
import { HoursGraph } from "@/components/HoursGraph";
import { toast } from "sonner";

interface Session {
  start: string;
  end: string;
  duration_hours: number;
}

interface UsageData {
  [date: string]: Session[];
}

interface UserData {
  [userId: string]: UsageData;
}

// Generate a unique user ID for this browser/device
const getUserId = (): string => {
  let userId = localStorage.getItem("grindmaster_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("grindmaster_user_id", userId);
  }
  return userId;
};

const Index = () => {
  const [userId] = useState<string>(getUserId());
  const [usageData, setUsageData] = useState<UsageData>(() => {
    const saved = localStorage.getItem("usage_data_all");
    const allData: UserData = saved ? JSON.parse(saved) : {};
    return allData[userId] || {};
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("usage_data_all");
    const allData: UserData = saved ? JSON.parse(saved) : {};
    allData[userId] = usageData;
    localStorage.setItem("usage_data_all", JSON.stringify(allData));
  }, [usageData, userId]);

  const startSession = () => {
    if (isRunning && !isPaused) {
      toast.error("A session is already running!");
      return;
    }
    
    const now = new Date();
    if (isPaused) {
      // Resume from pause
      setStartTime(new Date(now.getTime() - elapsedSeconds * 1000));
      setIsPaused(false);
      toast.success("Session resumed!");
    } else {
      // Start new session
      setStartTime(now);
      setElapsedSeconds(0);
      toast.success("Session started!", {
        description: `Started at ${now.toLocaleTimeString()}`,
      });
    }
    setIsRunning(true);
  };

  const pauseSession = () => {
    if (!isRunning || isPaused) return;
    
    const now = new Date();
    if (startTime) {
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }
    setIsRunning(false);
    setIsPaused(true);
    toast.info("Session paused");
  };

  const endSession = () => {
    if (!startTime) {
      toast.error("Start a session first!");
      return;
    }

    const endTime = new Date();
    const totalElapsed = isPaused 
      ? elapsedSeconds 
      : (endTime.getTime() - startTime.getTime()) / 1000;
    const duration = totalElapsed / 3600;
    
    const sessionStartTime = isPaused 
      ? new Date(endTime.getTime() - elapsedSeconds * 1000)
      : startTime;
    const dateStr = sessionStartTime.toISOString().split("T")[0];

    const session: Session = {
      start: sessionStartTime.toLocaleTimeString(),
      end: endTime.toLocaleTimeString(),
      duration_hours: Math.round(duration * 100) / 100,
    };

    setUsageData((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), session],
    }));

    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setElapsedSeconds(0);

    toast.success("Session completed!", {
      description: `Duration: ${session.duration_hours.toFixed(2)} hours`,
    });
  };

  const exportCSV = () => {
    if (Object.keys(usageData).length === 0) {
      toast.error("No data to export!");
      return;
    }

    let csv = "Date,Session No,Start Time,End Time,Duration (hours)\n";
    Object.entries(usageData).forEach(([date, sessions]) => {
      sessions.forEach((session, idx) => {
        csv += `${date},${idx + 1},${session.start},${session.end},${session.duration_hours}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laptop-usage-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast.success("Data exported successfully!");
  };

  const resetToday = () => {
    if (window.confirm("Are you sure you want to reset today's sessions?")) {
      const today = new Date().toISOString().split("T")[0];
      const newData = { ...usageData };
      delete newData[today];
      setUsageData(newData);
      toast.success("Today's sessions have been cleared!");
    }
  };

  const resetData = () => {
    if (window.confirm("Are you sure you want to delete all your usage data?")) {
      setUsageData({});
      const saved = localStorage.getItem("usage_data_all");
      const allData: UserData = saved ? JSON.parse(saved) : {};
      delete allData[userId];
      localStorage.setItem("usage_data_all", JSON.stringify(allData));
      toast.success("All your data has been cleared!");
    }
  };

  const getTodayTotal = () => {
    const today = new Date().toISOString().split("T")[0];
    return usageData[today]?.reduce((sum, s) => sum + s.duration_hours, 0) || 0;
  };

  const getTotalDays = () => Object.keys(usageData).length;

  const getTotalHours = () =>
    Object.values(usageData).reduce(
      (sum, sessions) => sum + sessions.reduce((s, session) => s + session.duration_hours, 0),
      0
    );

  const getConsecutiveDays = () => {
    const dates = Object.keys(usageData).sort();
    if (dates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toISOString().split("T")[0];
    
    // Check if today has data, if not start from yesterday
    let currentDate = new Date(dates.includes(today) ? today : dates[dates.length - 1]);
    
    for (let i = dates.length - 2; i >= 0; i--) {
      const prevDate = new Date(dates[i]);
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-primary bg-clip-text text-transparent mb-4 drop-shadow-lg tracking-tight">
            GrindMaster
          </h1>
          <p className="text-2xl text-foreground/80 font-semibold tracking-wide">
            Track your productivity and stay motivated! 🚀✨
          </p>
        </header>

        {/* Motivational Quote - Moved Up */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <MotivationalQuote />
        </div>

        {/* Timer Section */}
        <div className="mb-16 animate-scale-in" style={{ animationDelay: "300ms" }}>
          <TimerDisplay startTime={startTime} isRunning={isRunning} isPaused={isPaused} elapsedSeconds={elapsedSeconds} />
          
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Button
              onClick={startSession}
              disabled={isRunning && !isPaused}
              variant="success"
              size="lg"
              className="group relative overflow-hidden"
            >
              <Play className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">{isPaused ? "Resume" : "Start Session"}</span>
            </Button>
            {isRunning && !isPaused && (
              <Button
                onClick={pauseSession}
                variant="secondary"
                size="lg"
                className="group relative overflow-hidden"
              >
                <Square className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Pause</span>
              </Button>
            )}
            <Button
              onClick={endSession}
              disabled={!isRunning && !isPaused}
              variant="destructive"
              size="lg"
              className="group relative overflow-hidden"
            >
              <Square className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">End Session</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard
            title="Today's Total"
            value={`${getTodayTotal().toFixed(2)}h`}
            icon={Clock}
            gradient="primary"
            delay={300}
          />
          <StatCard
            title="Total Days"
            value={getTotalDays()}
            icon={Calendar}
            gradient="accent"
            delay={400}
          />
          <StatCard
            title="Total Hours"
            value={`${getTotalHours().toFixed(2)}h`}
            icon={TrendingUp}
            gradient="success"
            delay={500}
          />
        </div>

        {/* Usage Calendar and Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <UsageCalendar usageData={usageData} />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "650ms" }}>
            <HoursGraph usageData={usageData} />
          </div>
        </div>

        {/* Session History */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
          <SessionHistory sessions={usageData} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up mb-16" style={{ animationDelay: "800ms" }}>
          <Button
            onClick={resetToday}
            variant="secondary"
            size="lg"
            className="group"
          >
            <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Reset Today
          </Button>
          <Button
            onClick={exportCSV}
            variant="info"
            size="lg"
            className="group"
          >
            <Download className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
            Export CSV
          </Button>
          <Button
            onClick={resetData}
            variant="outline"
            size="default"
            className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Reset All
          </Button>
        </div>

        {/* Consistency Meter at Bottom */}
        <div className="animate-fade-in-up pb-8" style={{ animationDelay: "900ms" }}>
          <ConsistencyMeter dayCount={getConsecutiveDays()} />
        </div>
      </div>
    </div>
  );
};

export default Index;
