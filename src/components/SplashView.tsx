import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

const SplashView = ({ onComplete }: SplashViewProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-secondary flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse" />
      
      {/* Main content */}
      <div className="relative text-center animate-scale-in">
        {/* Logo with rotating animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-premium animate-float">
            <BookOpen className="w-12 h-12 text-primary-foreground animate-rotate-slow" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-primary rounded-3xl blur-xl opacity-50 animate-pulse" />
        </div>
        
        {/* App name */}
        <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-fade-in">
          Lumen
        </h1>
        
        {/* Tagline */}
        <p className="text-muted-foreground text-lg mb-12 animate-fade-in">
          Illuminate your reading journey
        </p>
        
        {/* Loading indicator */}
        <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-primary animate-pulse rounded-full" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-muted-foreground text-sm animate-fade-in">
          Made by Arseniy Cherednichenko
        </p>
      </div>
    </div>
  );
};

export default SplashView;