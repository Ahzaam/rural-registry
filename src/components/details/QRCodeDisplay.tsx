import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Paper, Typography, Tooltip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Download as DownloadIcon, ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { Family } from '../../types/types';
import { motion } from 'framer-motion';
import AnimatedButton from '../common/AnimatedButton';

interface QRCodeDisplayProps {
  family: Family;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ family }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Simple unique identifier combining homeId and docId
  const familyCode = `${family.homeId}-${family.id}`;
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    const svg = document.getElementById('family-qr-code');
    if (svg) {
      try {
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
          setIsDownloading(false);
        };
        img.onerror = () => {
          console.error('Error loading image for QR code download');
          setIsDownloading(false);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      } catch (error) {
        console.error('Error downloading QR code:', error);
        setIsDownloading(false);
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(familyCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Animation variants for QR code
  const qrCodeVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    hover: { 
      scale: 1.02,
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <Paper 
      elevation={0} 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        p: 3,
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.07)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        <Typography 
          variant="h6" 
          component={motion.h2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{ 
            color: '#1d1d1f', 
            fontWeight: 600,
            fontSize: '1.25rem'
          }}
        >
          Family QR Code
        </Typography>
        
        <motion.div
          variants={qrCodeVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Box sx={{ 
            p: 4,
            borderRadius: '24px',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative'
          }}>
            <QRCodeSVG
              id="family-qr-code"
              value={familyCode}
              size={200}
              level="H"
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#1d1d1f"
            />
            
            {/* Apple-style subtle gradient overlay */}
            <Box 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
                borderRadius: '24px',
                pointerEvents: 'none'
              }}
            />
          </Box>
        </motion.div>

        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            sx={{ 
              color: '#1d1d1f',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontSize: '1.25rem',
            }}
          >
            #{family.homeId}
          </Typography>
          <Typography 
            variant="body2" 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            sx={{ 
              color: '#86868b', 
              display: 'block', 
              mt: 0.5,
              cursor: 'pointer',
              '&:hover': { color: '#0070c9' }
            }}
            onClick={handleCopyCode}
          >
            <Tooltip title={copied ? "Copied!" : "Click to copy"}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                {familyCode}
                {copied ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
              </Box>
            </Tooltip>
          </Typography>
        </Box>

        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          sx={{ 
            width: '100%', 
            display: 'flex',
            gap: 2
          }}
        >
          <AnimatedButton
            onClick={handleDownload}
            loading={isDownloading}
            startIcon={<DownloadIcon />}
            variant="contained"
            fullWidth
            sx={{ 
              borderRadius: '12px',
              backgroundColor: '#0070c9',
              '&:hover': { backgroundColor: '#005ea3' }
            }}
          >
            Download
          </AnimatedButton>
        </Box>
      </Box>
      
      <Snackbar 
        open={copied} 
        autoHideDuration={2000} 
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '12px' }}>
          Code copied to clipboard
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default QRCodeDisplay;