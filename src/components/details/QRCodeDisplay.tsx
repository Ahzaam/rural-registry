import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Family } from '../../types/types';

interface QRCodeDisplayProps {
  family: Family;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ family }) => {
  // Simple unique identifier combining homeId and docId
  const familyCode = `${family.homeId}-${family.id}`;
  console.log(familyCode);
  const handleDownload = () => {
    const svg = document.getElementById('family-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `family-${family.homeId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ color: '#1d1d1f', fontWeight: 600 }}>
          Family QR Code
        </Typography>
        
        <Box sx={{ 
          p: 3,
          borderRadius: '12px',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <QRCodeSVG
            id="family-qr-code"
            value={familyCode}
            size={200}
            level="M"
            includeMargin
          />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1d1d1f',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontSize: '1.125rem',
            }}
          >
            {family.homeId}
          </Typography>
          <Typography variant="caption" sx={{ color: '#86868b', display: 'block', mt: 0.5 }}>
            Family Reference Code
          </Typography>
        </Box>

        <IconButton
          onClick={handleDownload}
          sx={{ 
            color: '#0070c9',
            '&:hover': {
              backgroundColor: 'rgba(0, 112, 201, 0.08)'
            }
          }}
          title="Download QR Code"
        >
          <DownloadIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default QRCodeDisplay;