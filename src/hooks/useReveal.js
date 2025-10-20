import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect when a component enters the viewport for reveal animations.
 * @param {Object} options
 * @param {number} [options.threshold=0.1] - Percentage of visibility needed to trigger (0 to 1).
 * @param {boolean} [options.triggerOnce=true] - Whether the animation should only run once.
 * @param {string} [options.rootMargin='0px'] - Margin around the root.
 * @returns {{ref: React.RefObject<HTMLDivElement>, isVisible: boolean}}
 */
export const useReveal = (options = {}) => {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    let localIsVisible = false; // State to track visibility locally for the effect run

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          localIsVisible = true;
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(ref.current);

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, rootMargin]);

  return { ref, isVisible };
};