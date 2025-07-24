// Local storage management for Lumen reading tracker
export interface ReadingSession {
  id: string;
  date: string;
  duration: number; // in seconds
  note?: string;
}

export interface ReadingStats {
  totalTime: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  sessions: ReadingSession[];
  dailyGoal: number; // in minutes
  lastReadDate?: string;
}

export interface AppSettings {
  dailyGoal: number; // in minutes
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  streakThreshold: number; // minimum minutes to count as streak day
}

const STORAGE_KEYS = {
  STATS: 'lumen_reading_stats',
  SETTINGS: 'lumen_settings',
  CURRENT_SESSION: 'lumen_current_session'
};

// Default values
const DEFAULT_STATS: ReadingStats = {
  totalTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  sessions: [],
  dailyGoal: 15, // 15 minutes default
};

const DEFAULT_SETTINGS: AppSettings = {
  dailyGoal: 15,
  notificationsEnabled: true,
  notificationTime: '19:00',
  streakThreshold: 10 // 10 minutes minimum
};

// Storage functions
export const getStats = (): ReadingStats => {
  const stored = localStorage.getItem(STORAGE_KEYS.STATS);
  return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
};

export const saveStats = (stats: ReadingStats): void => {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Session management
export const saveCurrentSession = (sessionData: { startTime: number, note?: string }): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
};

export const getCurrentSession = (): { startTime: number, note?: string } | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  return stored ? JSON.parse(stored) : null;
};

export const clearCurrentSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
};

// Utility functions
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

export const formatTimeDetailed = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const isToday = (dateString: string): boolean => {
  const today = new Date().toDateString();
  const date = new Date(dateString).toDateString();
  return today === date;
};

export const getTodaysSessions = (sessions: ReadingSession[]): ReadingSession[] => {
  const today = new Date().toDateString();
  return sessions.filter(session => new Date(session.date).toDateString() === today);
};