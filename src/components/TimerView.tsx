import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, BookOpen, Flame, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  formatTimeDetailed, 
  saveCurrentSession, 
  getCurrentSession, 
  clearCurrentSession,
  getStats,
  saveStats,
  getSettings,
  getTodaysSessions,
  type ReadingSession 
} from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface TimerViewProps {
  onStatsUpdate: () => void;
}

const TimerView = ({ onStatsUpdate }: TimerViewProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionNote, setSessionNote] = useState('');
  const { toast } = useToast();
  
  const settings = getSettings();
  const stats = getStats();
  const todaysSessions = getTodaysSessions(stats.sessions);
  const todaysTotal = todaysSessions.reduce((sum, session) => sum + session.duration, 0);
  const goalProgress = Math.min((todaysTotal / (settings.dailyGoal * 60)) * 100, 100);
  const goalReached = todaysTotal >= settings.dailyGoal * 60;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  // Check for existing session on mount
  useEffect(() => {
    const existingSession = getCurrentSession();
    if (existingSession) {
      const elapsed = Math.floor((Date.now() - existingSession.startTime) / 1000);
      setSeconds(elapsed);
      setSessionNote(existingSession.note || '');
      setIsRunning(true);
    }
  }, []);

  // Save session state when running
  useEffect(() => {
    if (isRunning && seconds > 0) {
      saveCurrentSession({ 
        startTime: Date.now() - (seconds * 1000), 
        note: sessionNote 
      });
    }
  }, [isRunning, seconds, sessionNote]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    saveCurrentSession({ startTime: Date.now(), note: sessionNote });
    
    // Haptic feedback (vibration on mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast({
      title: "Reading session started",
      description: "Focus on your book and let the wisdom flow 📚",
    });
  }, [sessionNote, toast]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (seconds < 60) {
      toast({
        title: "Session too short",
        description: "Read for at least 1 minute to save your session",
        variant: "destructive"
      });
      setIsRunning(false);
      setSeconds(0);
      clearCurrentSession();
      return;
    }

    // Save the completed session
    const newSession: ReadingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: seconds,
      note: sessionNote.trim() || undefined
    };

    const currentStats = getStats();
    const updatedSessions = [...currentStats.sessions, newSession];
    
    // Calculate new streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    const todayTotal = getTodaysSessions(updatedSessions).reduce((sum, s) => sum + s.duration, 0);
    const meetsThreshold = todayTotal >= settings.streakThreshold * 60;
    
    let newStreak = currentStats.currentStreak;
    if (meetsThreshold) {
      if (currentStats.lastReadDate === yesterday || !currentStats.lastReadDate) {
        newStreak = currentStats.currentStreak + 1;
      } else if (currentStats.lastReadDate !== today) {
        newStreak = 1;
      }
    }

    const updatedStats = {
      ...currentStats,
      totalTime: currentStats.totalTime + seconds,
      currentStreak: newStreak,
      longestStreak: Math.max(currentStats.longestStreak, newStreak),
      sessions: updatedSessions,
      lastReadDate: today
    };

    saveStats(updatedStats);
    clearCurrentSession();
    onStatsUpdate();

    // Celebratory feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    const sessionMinutes = Math.floor(seconds / 60);
    toast({
      title: goalReached ? "🎉 Daily goal completed!" : "📖 Session complete!",
      description: `Great session! You read for ${sessionMinutes} ${sessionMinutes === 1 ? 'minute' : 'minutes'}`,
    });

    // Reset timer
    setIsRunning(false);
    setSeconds(0);
    setSessionNote('');
  }, [seconds, sessionNote, settings.streakThreshold, onStatsUpdate, toast, goalReached]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Today's Progress */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Today's Progress</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Goal</span>
            <span className={goalReached ? "text-primary font-semibold" : "text-foreground"}>
              {Math.floor(todaysTotal / 60)}m / {settings.dailyGoal}m
            </span>
          </div>
          
          <Progress 
            value={goalProgress} 
            className="h-2"
          />
          
          {goalReached && (
            <div className="text-primary text-sm font-medium animate-pulse">
              🎉 Goal achieved! Keep the momentum going!
            </div>
          )}
        </div>
      </Card>

      {/* Main Timer */}
      <Card className={`p-8 text-center bg-gradient-secondary border-border shadow-card transition-smooth ${
        isRunning ? 'timer-glow pulse-reading' : ''
      }`}>
        <div className="space-y-6">
          {/* Timer display */}
          <div className="relative">
            <div className={`text-6xl font-mono font-bold ${
              isRunning ? 'text-primary' : 'text-foreground'
            } transition-smooth`}>
              {formatTimeDetailed(seconds)}
            </div>
            
            {isRunning && (
              <div className="absolute inset-0 text-6xl font-mono font-bold text-primary opacity-20 blur-sm">
                {formatTimeDetailed(seconds)}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            <BookOpen className={`w-5 h-5 ${isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            <span className="text-muted-foreground">
              {isRunning ? 'Reading in progress...' : 'Ready to start reading'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-primary hover:scale-105 transition-bounce shadow-premium"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Reading
              </Button>
            ) : (
              <>
                <Button
                  onClick={handlePause}
                  variant="secondary"
                  size="lg"
                  className="transition-bounce hover:scale-105"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
                
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="lg"
                  className="transition-bounce hover:scale-105"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Current Streak */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Current Streak</h3>
              <p className="text-sm text-muted-foreground">Keep it burning!</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">
              {stats.currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimerView;