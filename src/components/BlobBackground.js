import { Box } from '@mui/material';

export default function BlobBackground({ variant = 'default' }) {
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
