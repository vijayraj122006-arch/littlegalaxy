import { useState, useEffect } from 'react';

export function useTimeOfDay(): number {
  const [timeFactor, setTimeFactor] = useState<number>(0.2);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;

      // Dusk/sunset around 17:00 to 19:30 -> peak warmth (1.0)
      // Night around 21:00 to 04:00 -> deep midnight (0.0)
      // Dawn around 05:00 to 07:00 -> soft rose (0.6)
      let factor = 0.0;
      if (hour >= 17 && hour <= 20) {
        // Evening / sunset
        factor = 0.7 + 0.3 * Math.sin(((hour - 17) / 3) * Math.PI);
      } else if (hour > 20 && hour < 23) {
        // Transition to deep night
        factor = 0.5 * (1 - (hour - 20) / 3);
      } else if (hour >= 5 && hour <= 8) {
        // Morning dawn
        factor = 0.5 * Math.sin(((hour - 5) / 3) * Math.PI);
      } else {
        factor = 0.1;
      }
      setTimeFactor(factor);
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, []);

  return timeFactor;
}
