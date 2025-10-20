import { Box } from '@mui/material';

const GlowingStars = ({ count = 400 }) => (
  <>
    {/* Starfield - configurable count (default 400) */}
    {[...Array(count)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: `${Math.random() * 6 + 2}px`, // size randomized
          height: `${Math.random() * 6 + 2}px`, // size randomized
          background: `radial-gradient(circle, ${
            Math.random() > 0.6
              ? 'rgba(0, 210, 211, 0.95)'
              : Math.random() > 0.3
              ? 'rgba(162, 155, 254, 0.95)'
              : 'rgba(255, 184, 0, 0.9)'
          } 0%, transparent 70%)`,
          borderRadius: '50%',
          boxShadow: `0 0 ${Math.random() * 15 + 5}px ${ // Increased glow from 3-13px to 5-20px
            Math.random() > 0.6
              ? Math.random() > 0.3
                ? 'rgba(0, 210, 211, 0.9)'
                : 'rgba(162, 155, 254, 0.9)'
              : 'rgba(255, 184, 0, 0.8)'
          }`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 85}%`, // coverage randomized
          animation: `starFloat ${Math.random() * 25 + 20}s linear infinite`,
          animationDelay: `${Math.random() * 25}s`,
          zIndex: Math.random() > 0.9 ? 3 : Math.random() > 0.75 ? 2 : Math.random() > 0.5 ? 1 : 0, // More layering
          opacity: Math.random() * 0.9 + 0.1, // Slightly more opaque
          pointerEvents: 'none',
          transform: 'translateZ(0)',
        }}
      />
    ))}

    <style jsx global>{`
      @keyframes starFloat {
        0% {
          transform: translateY(0) scale(1);
          opacity: 0.8;
        }
        85% {
          transform: translateY(-120vh) scale(1.1);
          opacity: 0.9;
        }
        100% {
          transform: translateY(-140vh) scale(0);
          opacity: 0;
        }
      }
    `}</style>
  </>
);

export default function BlobBackground({ variant = 'default', starCount }) {
  const blobVariants = {
    default: (
      <>
        {/* Top Left Blob */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(162, 155, 254, 0.3) 0%, rgba(162, 155, 254, 0) 70%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(40px)',
            animation: 'blob 7s infinite',
            zIndex: 0,
          }}
        />

        {/* Top Right Blob */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '-5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 210, 211, 0.25) 0%, rgba(0, 210, 211, 0) 70%)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(40px)',
            animation: 'blob 8s infinite 2s',
            zIndex: 0,
          }}
        />

        {/* Bottom Blob */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '20%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.2) 0%, rgba(108, 92, 231, 0) 70%)',
            borderRadius: '70% 30% 50% 50% / 30% 50% 50% 70%',
            filter: 'blur(40px)',
            animation: 'blob 9s infinite 4s',
            zIndex: 0,
          }}
        />

  {/* Glowing Stars (configurable) */}
  <GlowingStars count={typeof starCount === 'number' ? starCount : undefined} />

        <style jsx global>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
        `}</style>
      </>
    ),
    card: (
      <>
        {/* Small decorative blob for cards */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(162, 155, 254, 0.4) 0%, rgba(162, 155, 254, 0) 70%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(20px)',
            zIndex: 0,
          }}
        />
      </>
    ),
    small: (
      <>
        {/* Tiny accent blob */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10px',
            left: '-10px',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(0, 210, 211, 0.3) 0%, rgba(0, 210, 211, 0) 70%)',
            borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%',
            filter: 'blur(15px)',
            zIndex: 0,
          }}
        />
      </>
    ),
  };

  return blobVariants[variant] || blobVariants.default;
}
