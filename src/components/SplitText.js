import { useMemo } from 'react';

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 600,
}) => {
  // Split text into characters and create animated spans
  const animatedChars = useMemo(() => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              width: '0.3em',
              animationDelay: `${index * delay}ms`,
            }}
          >
            &nbsp;
          </span>
        );
      }

      return (
        <span
          key={index}
          className="animate-char"
          style={{
            display: 'inline-block',
            animationDelay: `${index * delay}ms`,
            animationDuration: `${duration}ms`,
            animationFillMode: 'both',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {char}
        </span>
      );
    });
  }, [text, delay, duration]);

  return (
    <span className={className} style={{ display: 'inline-block', width: '100%' }}>
      {animatedChars}
      <style jsx>{`
        .animate-char {
          opacity: 0;
          transform: translateY(20px) rotateX(-90deg);
          animation-name: charEnter;
        }

        @keyframes charEnter {
          0% {
            opacity: 0;
            transform: translateY(20px) rotateX(-90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
      `}</style>
    </span>
  );
};

export default SplitText;
