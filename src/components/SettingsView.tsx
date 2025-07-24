import { useState } from 'react';
import { Settings, Target, Bell, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getSettings, saveSettings, getStats, saveStats, type AppSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface SettingsViewProps {
  onStatsReset: () => void;
}

const SettingsView = ({ onStatsReset }: SettingsViewProps) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettings(settings);
    setHasChanges(false);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });

    // Request notification permission if notifications are enabled
    if (settings.notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            toast({
              title: "Notifications enabled",
              description: "You'll receive daily reading reminders",
            });
          }
        });
      }
    }
  };

  const handleResetProgress = () => {
    const defaultStats = {
      totalTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessions: [],
      dailyGoal: settings.dailyGoal,
    };
    
    saveStats(defaultStats);
    onStatsReset();
    
    toast({
      title: "Progress reset",
      description: "All your reading data has been cleared",
      variant: "destructive"
    });
  };

  const stats = getStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Reading Goals */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Reading Goals</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Daily Goal (minutes)</Label>
              <Input
                id="dailyGoal"
                type="number"
                min="1"
                max="480"
                value={settings.dailyGoal}
                onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value) || 15)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="streakThreshold">Streak Threshold (minutes)</Label>
              <Input
                id="streakThreshold"
                type="number"
                min="1"
                max="120"
                value={settings.streakThreshold}
                onChange={(e) => handleSettingChange('streakThreshold', parseInt(e.target.value) || 10)}
                className="bg-background"
              />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Set your daily reading goal and minimum time needed to maintain your streak.
          </p>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Daily Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded to read at your chosen time
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
            />
          </div>
          
          {settings.notificationsEnabled && (
            <div className="space-y-2">
              <Label htmlFor="notificationTime">Reminder Time</Label>
              <Input
                id="notificationTime"
                type="time"
                value={settings.notificationTime}
                onChange={(e) => handleSettingChange('notificationTime', e.target.value)}
                className="bg-background w-48"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-secondary border-border shadow-card">
        <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.sessions.length}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{Math.floor(stats.totalTime / 3600)}h</div>
            <div className="text-sm text-muted-foreground">Hours Read</div>
          </div>
        </div>

        {/* Reset Progress */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Progress</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your reading sessions, streaks, and statistics. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetProgress} className="bg-destructive hover:bg-destructive/90">
                Reset Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button 
            onClick={handleSave}
            size="lg"
            className="bg-gradient-primary hover:scale-105 transition-bounce shadow-premium"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsView;