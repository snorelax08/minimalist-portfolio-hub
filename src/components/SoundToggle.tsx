import { Volume2, VolumeX } from 'lucide-react';
import { useProceduralSound } from '@/hooks/use-procedural-sound';

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className = '' }: SoundToggleProps) {
  const { isEnabled, toggle, init, playClick } = useProceduralSound();

  const handleClick = async () => {
    await init();
    toggle();
    if (!isEnabled) {
      playClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/20 transition-all duration-300 ${className}`}
      aria-label={isEnabled ? 'Disable sound' : 'Enable sound'}
    >
      {isEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
      
      {/* Pulse animation when enabled */}
      {isEnabled && (
        <div className="absolute inset-0 rounded-full border border-foreground/20 animate-ping opacity-30" />
      )}
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isEnabled ? 'Sound on' : 'Sound off'}
      </span>
    </button>
  );
}
