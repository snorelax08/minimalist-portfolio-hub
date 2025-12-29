import { useState, useEffect, useCallback } from 'react';

interface RevealState {
  level: number;
  maxLevel: number;
  hasInteracted: boolean;
  sectionsVisited: Set<string>;
  scrollDepth: number;
  timeOnPage: number;
}

export function useProgressiveRevelation() {
  const [state, setState] = useState<RevealState>({
    level: 0,
    maxLevel: 3,
    hasInteracted: false,
    sectionsVisited: new Set<string>(),
    scrollDepth: 0,
    timeOnPage: 0,
  });

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      
      setState(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollDepth),
        level: calculateLevel(prev.sectionsVisited.size, scrollDepth, prev.timeOnPage, prev.hasInteracted),
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      setState(prev => ({
        ...prev,
        timeOnPage,
        level: calculateLevel(prev.sectionsVisited.size, prev.scrollDepth, timeOnPage, prev.hasInteracted),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateLevel = (sections: number, scroll: number, time: number, interacted: boolean): number => {
    let level = 0;
    
    // Level 1: Basic exploration (scrolled 20% or spent 10s)
    if (scroll > 20 || time > 10) level = 1;
    
    // Level 2: Engaged (visited 2+ sections or scrolled 50%)
    if (sections >= 2 || scroll > 50) level = 2;
    
    // Level 3: Deep engagement (visited 3+ sections, interacted, scrolled 80%+)
    if (sections >= 3 && interacted && scroll > 80) level = 3;
    
    return level;
  };

  const markSectionVisited = useCallback((sectionId: string) => {
    setState(prev => {
      const newSections = new Set(prev.sectionsVisited);
      newSections.add(sectionId);
      return {
        ...prev,
        sectionsVisited: newSections,
        level: calculateLevel(newSections.size, prev.scrollDepth, prev.timeOnPage, prev.hasInteracted),
      };
    });
  }, []);

  const markInteraction = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasInteracted: true,
      level: calculateLevel(prev.sectionsVisited.size, prev.scrollDepth, prev.timeOnPage, true),
    }));
  }, []);

  const shouldReveal = useCallback((requiredLevel: number) => {
    return state.level >= requiredLevel;
  }, [state.level]);

  return {
    ...state,
    markSectionVisited,
    markInteraction,
    shouldReveal,
  };
}
