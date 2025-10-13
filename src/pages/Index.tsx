import { useState, useEffect } from "react";
import { Play, Square, Download, RotateCcw, TrendingUp, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimerDisplay } from "@/components/TimerDisplay";
import { StatCard } from "@/components/StatCard";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { SessionHistory } from "@/components/SessionHistory";
import { toast } from "sonner";

interface Session {
  start: string;
  end: string;
  duration_hours: number;
}

interface UsageData {
  [date: string]: Session[];
}

const Index = () => {
  const [usageData, setUsageData] = useState<UsageData>(() => {
    const saved = localStorage.getItem("usage_data");
    return saved ? JSON.parse(saved) : {};
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("usage_data", JSON.stringify(usageData));
  }, [usageData]);

  const startSession = () => {
    if (isRunning) {
      toast.error("A session is already running!");
      return;
    }
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    toast.success("Session started!", {
      description: `Started at ${now.toLocaleTimeString()}`,
    });
  };

  const endSession = () => {
    if (!startTime) {
      toast.error("Start a session first!");
      return;
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const dateStr = startTime.toISOString().split("T")[0];

    const session: Session = {
      start: startTime.toLocaleTimeString(),
      end: endTime.toLocaleTimeString(),
      duration_hours: Math.round(duration * 100) / 100,
    };

    setUsageData((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), session],
    }));

    setIsRunning(false);
    setStartTime(null);

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

  const resetData = () => {
    if (window.confirm("Are you sure you want to delete all usage data?")) {
      setUsageData({});
      localStorage.removeItem("usage_data");
      toast.success("All data has been cleared!");
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

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            Laptop Usage Tracker
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Track your productivity and stay motivated! 🚀
          </p>
        </header>

        {/* Timer Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <TimerDisplay startTime={startTime} isRunning={isRunning} />
          
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={startSession}
              disabled={isRunning}
              size="lg"
              className="bg-gradient-success hover:scale-105 transition-all duration-300 shadow-card hover:shadow-glow text-lg px-8 py-6 rounded-xl"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Session
            </Button>
            <Button
              onClick={endSession}
              disabled={!isRunning}
              size="lg"
              className="bg-gradient-accent hover:scale-105 transition-all duration-300 shadow-card hover:shadow-glow text-lg px-8 py-6 rounded-xl"
            >
              <Square className="w-6 h-6 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Today's Total"
            value={`${getTodayTotal().toFixed(2)}h`}
            icon={Clock}
            gradient="primary"
            delay={200}
          />
          <StatCard
            title="Total Days"
            value={getTotalDays()}
            icon={Calendar}
            gradient="accent"
            delay={300}
          />
          <StatCard
            title="Total Hours"
            value={`${getTotalHours().toFixed(2)}h`}
            icon={TrendingUp}
            gradient="success"
            delay={400}
          />
        </div>

        {/* Motivational Quote */}
        <div className="mb-12">
          <MotivationalQuote />
        </div>

        {/* Session History */}
        <div className="mb-12">
          <SessionHistory sessions={usageData} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <Button
            onClick={exportCSV}
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={resetData}
            variant="outline"
            size="lg"
            className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
