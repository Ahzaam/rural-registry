/** @jsxImportSource @emotion/react */
import { type FC, useState, useCallback, JSX } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Close as CloseIcon, ErrorOutline, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface Props {
  onScan: (result: IDetectedBarcode[]) => void;
  onClose: () => void;
}

const EventQRScanner: FC<Props> = ({ onScan, onClose }): JSX.Element => {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleDecode = useCallback(
    (result: IDetectedBarcode[]) => {
      if (result) {
        // Show success animation
        setScanSuccess(true);
        setTimeout(() => {
          setScanSuccess(false);
          onScan(result);
        }, 1500);
      }
    },
    [onScan]
  );

  const handleError = useCallback((err) => {
    console.error(err);
    setError("Error accessing camera");
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "500px",
        mx: "auto",
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1d1d1f" }}>
          Scan QR Code
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Scanner */}
      <Box sx={{ position: "relative", aspectRatio: "1", p: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          <Scanner
            onScan={handleDecode}
            onError={handleError}
            scanDelay={500}
            constraints={{
              facingMode: "environment",
            }}
          />

          {/* Success animation overlay */}
          <AnimatePresence>
            {scanSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(4px)",
                  zIndex: 10,
                }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: "80px",
                      color: theme.palette.success.main,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan guides */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 1,
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                width: "50%",
                height: "50%",
                boxSizing: "border-box",
              },
              "&::before": {
                top: "10%",
                left: "10%",
                borderTop: "2px solid rgba(255,255,255,0.8)",
                borderLeft: "2px solid rgba(255,255,255,0.8)",
                borderTopLeftRadius: "12px",
              },
              "&::after": {
                bottom: "10%",
                right: "10%",
                borderBottom: "2px solid rgba(255,255,255,0.8)",
                borderRight: "2px solid rgba(255,255,255,0.8)",
                borderBottomRightRadius: "12px",
              },
            }}
          />
        </motion.div>
      </Box>

      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              textAlign: "center",
              padding: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: theme.palette.error.main,
                bgcolor: `${theme.palette.error.light}20`,
                py: 1,
                px: 2,
                borderRadius: "12px",
              }}
            >
              <ErrorOutline fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Typography
          sx={{
            p: 2,
            textAlign: "center",
            color: "#86868b",
            fontSize: "0.9rem",
          }}
        >
          Position the QR code within the frame to scan
        </Typography>
      </motion.div>
    </Box>
  );
};

export default EventQRScanner;
