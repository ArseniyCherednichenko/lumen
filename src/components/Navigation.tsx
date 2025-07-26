import { Timer, BarChart3, Quote, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'quotes', label: 'Quotes', icon: Quote },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-card border-t border-border z-40 ios-safe-bottom">
      <div className="flex justify-around items-center h-16 px-4 safe-area-padding">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;