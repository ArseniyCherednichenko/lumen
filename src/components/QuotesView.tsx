import { useState, useEffect } from 'react';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getRandomQuote, type Quote } from '@/lib/quotes';

const QuotesView = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getRandomQuote());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNewQuote();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNewQuote = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 animate-fade-in overflow-auto">
      {/* Header */}
      <div className="text-center space-y-2 pt-4">
        <h2 className="text-xl md:text-2xl font-bold">Literary Inspiration</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Words of wisdom from the greatest minds
        </p>
      </div>

      {/* Main Quote Card */}
      <Card className="p-8 bg-gradient-reading border-border shadow-premium min-h-[300px] flex items-center">
        <div className={`w-full transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          {/* Quote Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <QuoteIcon className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Quote Text */}
          <blockquote className="text-center space-y-6">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
              "{currentQuote.text}"
            </p>
            
            <footer className="text-primary font-semibold text-lg">
              — {currentQuote.author}
            </footer>
          </blockquote>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex justify-center">
        <Button
          onClick={handleNewQuote}
          variant="outline"
          size="lg"
          className="transition-bounce hover:scale-105"
          disabled={isTransitioning}
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isTransitioning ? 'animate-spin' : ''}`} />
          New Quote
        </Button>
      </div>

      {/* Quote Collection Info */}
      <Card className="p-4 bg-gradient-secondary border-border shadow-card">
        <div className="text-center space-y-2">
          <h3 className="font-semibold">About These Quotes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each quote is carefully selected from renowned authors, philosophers, and literary figures 
            who understood the transformative power of reading. Let their words inspire your own reading journey.
          </p>
        </div>
      </Card>

      {/* Floating Animation Elements */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute top-4 left-4 w-2 h-2 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-primary/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default QuotesView;