import { useTimeAware } from '@/hooks/use-time-aware';

interface TimeGreetingProps {
  className?: string;
}

export function TimeGreeting({ className = '' }: TimeGreetingProps) {
  const { greeting, sessionDuration, visitCount, timeOfDay } = useTimeAware();

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return '☀️';
      case 'afternoon': return '🌤️';
      case 'evening': return '🌅';
      case 'night': return '🌙';
    }
  };

  return (
    <div className={`text-foreground/60 text-sm ${className}`}>
      <span className="mr-1">{getTimeIcon()}</span>
      <span>{greeting}</span>
      {visitCount > 1 && (
        <span className="ml-2 text-foreground/40">
          (Visit #{visitCount})
        </span>
      )}
      {sessionDuration > 30 && (
        <span className="ml-2 text-foreground/40">
          · {formatDuration(sessionDuration)}
        </span>
      )}
    </div>
  );
}
