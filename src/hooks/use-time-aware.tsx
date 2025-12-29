import { useState, useEffect, useMemo } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeContext {
  timeOfDay: TimeOfDay;
  hour: number;
  greeting: string;
  sessionDuration: number; // in seconds
  isNewVisitor: boolean;
  visitCount: number;
}

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getGreeting(timeOfDay: TimeOfDay, visitCount: number): string {
  const isReturning = visitCount > 1;
  
  const greetings = {
    morning: isReturning ? 'Good morning, welcome back' : 'Good morning',
    afternoon: isReturning ? 'Good afternoon, nice to see you again' : 'Good afternoon',
    evening: isReturning ? 'Good evening, welcome back' : 'Good evening',
    night: isReturning ? 'Working late? Welcome back' : 'Burning the midnight oil?',
  };
  
  return greetings[timeOfDay];
}

export function useTimeAware(): TimeContext {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    // Track visit count
    const storedCount = localStorage.getItem('portfolio_visit_count');
    const count = storedCount ? parseInt(storedCount, 10) + 1 : 1;
    localStorage.setItem('portfolio_visit_count', count.toString());
    setVisitCount(count);

    // Track session duration
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const context = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = getTimeOfDay(hour);

    return {
      timeOfDay,
      hour,
      greeting: getGreeting(timeOfDay, visitCount),
      sessionDuration,
      isNewVisitor: visitCount === 1,
      visitCount,
    };
  }, [sessionDuration, visitCount]);

  return context;
}

// Time-based color suggestions (for components to use)
export function useTimeBasedStyles() {
  const { timeOfDay } = useTimeAware();

  const styles = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return {
          accentHue: 45, // warm golden
          intensity: 0.8,
          message: '☀️ Rise and shine',
        };
      case 'afternoon':
        return {
          accentHue: 200, // calm blue
          intensity: 1,
          message: '🌤️ Peak productivity hours',
        };
      case 'evening':
        return {
          accentHue: 280, // soft purple
          intensity: 0.9,
          message: '🌅 Winding down',
        };
      case 'night':
        return {
          accentHue: 240, // deep blue
          intensity: 0.7,
          message: '🌙 Night owl mode',
        };
    }
  }, [timeOfDay]);

  return styles;
}
