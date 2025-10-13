import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !text) return;

    // Split text into characters manually
    const chars = text.split('');
    const charElements = [];

    // Clear existing content and create character spans
    textRef.current.innerHTML = '';

    chars.forEach((char, index) => {
      if (char === ' ') {
        // Handle spaces
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.style.display = 'inline-block';
        textRef.current.appendChild(spaceSpan);
        charElements.push(spaceSpan);
      } else {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        textRef.current.appendChild(charSpan);
        charElements.push(charSpan);
      }
    });

    // Set initial state
    gsap.set(charElements, from);

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: `top bottom-=${rootMargin}`,
        end: `bottom top+=${rootMargin}`,
        toggleActions: 'play none none reverse'
      }
    });

    // Animate each character
    charElements.forEach((char, index) => {
      tl.to(char, {
        ...to,
        duration: duration,
        ease: ease,
        delay: (index * delay) / 1000,
      }, 0);
    });

    // Call completion callback when all animations finish
    if (onLetterAnimationComplete) {
      tl.call(onLetterAnimationComplete);
    }

    return () => {
      tl.kill();
      // Clean up the DOM elements
      if (textRef.current) {
        textRef.current.innerHTML = '';
      }
    };
  }, [text, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        textAlign,
        display: 'inline-block',
        width: '100%',
        lineHeight: 1.2,
      }}
    >
    </div>
  );
};

export default SplitText;
