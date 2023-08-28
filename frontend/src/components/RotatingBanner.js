import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
function RotatingBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bannerImages = ['/images/banner1.png', '/images/banner2.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh',
      }}
    >
      <img
        src={bannerImages[currentImageIndex]}
        alt={`Banner ${currentImageIndex + 1}`}
        style={{
          width: '70%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </Box>
  );
}

export default RotatingBanner;
