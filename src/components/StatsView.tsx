import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, TrendingUp, Flame, Calendar } from 'lucide-react';
import { getStats, getSettings, formatTime, getTodaysSessions } from '@/lib/storage';

const StatsView = () => {
  const stats = getStats();
  const settings = getSettings();
  
  // Calculate average session length
  const averageSession = stats.sessions.length > 0 
    ? Math.floor(stats.totalTime / stats.sessions.length)
    : 0;
  
  // Get last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const dayStats = stats.sessions.filter(session => 
      new Date(session.date).toDateString() === dateStr
    );
    
    const totalMinutes = Math.floor(
      dayStats.reduce((sum, session) => sum + session.duration, 0) / 60
    );
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: totalMinutes,
      goalMet: totalMinutes >= settings.dailyGoal
    };
  }).reverse();
  
  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), settings.dailyGoal);
  
  // Today's sessions
  const todaysSessions = getTodaysSessions(stats.sessions);
  const todaysTotal = todaysSessions.reduce((sum, session) => sum + session.duration, 0);

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 animate-fade-in overflow-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card className="p-4 bg-gradient-secondary border-border shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Total Time</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
        </Card>

        <Card className="p-4 bg-gradient-secondary border-border shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Best Streak</span>
          </div>
          <div className="text-2xl font-bold">{stats.longestStreak} days</div>
        </Card>

        <Card className="p-4 bg-gradient-secondary border-border shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Avg Session</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(averageSession)}</div>
        </Card>

        <Card className="p-4 bg-gradient-secondary border-border shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <div className="text-2xl font-bold">{stats.sessions.length}</div>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Last 7 Days</h3>
        </div>
        
        <div className="space-y-4">
          {last7Days.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{day.date}</span>
                <span className={`font-medium ${day.goalMet ? 'text-primary' : 'text-foreground'}`}>
                  {day.minutes}m
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={(day.minutes / maxMinutes) * 100} 
                  className="h-2"
                />
                {/* Goal line indicator */}
                <div 
                  className="absolute top-0 w-0.5 h-2 bg-primary/50"
                  style={{ left: `${(settings.dailyGoal / maxMinutes) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Goal: {settings.dailyGoal} minutes daily
        </div>
      </Card>

      {/* Today's Sessions */}
      {todaysSessions.length > 0 && (
        <Card className="p-6 bg-gradient-secondary border-border shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Today's Sessions</h3>
          </div>
          
          <div className="space-y-3">
            {todaysSessions.map((session, index) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <div className="font-medium">Session {index + 1}</div>
                  {session.note && (
                    <div className="text-sm text-muted-foreground mt-1">
                      "{session.note}"
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatTime(session.duration)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Total Today:</span>
                <span className="text-primary">{formatTime(todaysTotal)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsView;