import { Clock, Calendar } from "lucide-react";
import { Card } from "./ui/card";

interface Session {
  start: string;
  end: string;
  duration_hours: number;
}

interface SessionHistoryProps {
  sessions: Record<string, Session[]>;
}

export const SessionHistory = ({ sessions }: SessionHistoryProps) => {
  const sortedDates = Object.keys(sessions).sort((a, b) => b.localeCompare(a));
  const recentSessions = sortedDates.slice(0, 5);

  if (recentSessions.length === 0) {
    return (
      <Card className="p-8 text-center animate-fade-in">
        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground text-lg">No sessions yet. Start tracking to see your history!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Clock className="w-6 h-6 text-primary" />
        Recent Sessions
      </h3>
      
      <div className="space-y-3">
        {recentSessions.map((date, idx) => {
          const daySessions = sessions[date];
          const dayTotal = daySessions.reduce((sum, s) => sum + s.duration_hours, 0);
          
          return (
            <Card
              key={date}
              className="p-5 hover:shadow-card transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-scale-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{date}</span>
                </div>
                <div className="text-primary font-bold text-lg">
                  {dayTotal.toFixed(2)} hrs
                </div>
              </div>
              
              <div className="space-y-2">
                {daySessions.map((session, sessionIdx) => (
                  <div
                    key={sessionIdx}
                    className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">
                        Session {sessionIdx + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {session.start} - {session.end}
                      </span>
                      <span className="font-medium text-foreground">
                        {session.duration_hours.toFixed(2)}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
