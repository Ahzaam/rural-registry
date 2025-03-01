import React, { useState } from "react";
import { Box, Container, Typography, Paper, Slide, IconButton, useTheme } from "@mui/material";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Home as HomeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  ErrorOutline,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { Family } from "../types/types";
import { getFamilyById } from "../services/familyService";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "./common/AnimatedPage";
import AnimatedButton from "./common/AnimatedButton";

const QRScannerComponent: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [scannedFamilyId, setScannedFamilyId] = useState<string | null>(null);
  const [scannedFamily, setScannedFamily] = useState<Family | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = async (data: IDetectedBarcode[]) => {
    if (data && data.length > 0 && data[0].rawValue) {
      // Extract family ID from QR code
      const qrValue = data[0].rawValue;
      const parts = qrValue.split("-");
      
      if (parts.length === 2) {
        const familyId = parts[1];
        
        try {
          setIsLoading(true);
          setError(null);
          
          // Show success animation
          setScanSuccess(true);
          setTimeout(() => setScanSuccess(false), 1500);
          
          // Load family data
          const family = await getFamilyById(familyId);
          if (family) {
            setScannedFamily(family);
            setScannedFamilyId(familyId);
            setShowPanel(true);
          } else {
            setError("Family not found in database");
          }
        } catch (error) {
          console.error("Error fetching family:", error);
          setError("Error fetching family details");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Invalid QR code format");
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
    setError("Error accessing camera");
  };

  const handleVisitProfile = () => {
    if (scannedFamilyId) {
      navigate(`/families/${scannedFamilyId}`);
    }
  };
  
  const handleReset = () => {
    setShowPanel(false);
    setScannedFamily(null);
    setScannedFamilyId(null);
    setError(null);
  };

  // Animated scanner frame
  const scannerFrameVariants = {
    scanning: {
      boxShadow: [
        "0 0 0 4px rgba(0, 112, 201, 0.1)",
        "0 0 0 8px rgba(0, 112, 201, 0.1)",
        "0 0 0 4px rgba(0, 112, 201, 0.1)"
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  return (
    <AnimatedPage>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        pt: { xs: 2, md: 4 },
        pb: { xs: 4, md: 8 }
      }}>
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton
                onClick={() => navigate("/dashboard")}
                sx={{
                  mr: 2,
                  color: theme.palette.primary.main,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#1d1d1f",
                  fontSize: { xs: '1.75rem', md: '2.2rem' }
                }}
              >
                QR Scanner
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <Box sx={{ position: "relative" }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600, 
                      textAlign: "center",
                      color: theme.palette.text.primary 
                    }}
                  >
                    Scan Family QR Code
                  </Typography>
                </motion.div>
                
                <Box
                  sx={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "24px",
                  }}
                >
                  <Box
                    component={motion.div}
                    variants={scannerFrameVariants}
                    animate="scanning"
                    sx={{
                      position: "relative",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow: "0 0 0 4px rgba(0, 112, 201, 0.1)",
                      "& video": {
                        display: "block",
                        width: "100% !important",
                        height: "auto !important",
                        borderRadius: "16px",
                      },
                    }}
                  >
                    <Scanner 
                      onScan={handleScan} 
                      onError={handleError} 
                      scanDelay={500}
                      constraints={{
                        facingMode: "environment"
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
                            zIndex: 10
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
                                color: theme.palette.success.main
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
                        '&::before, &::after': {
                          content: '""',
                          position: 'absolute',
                          width: '50%',
                          height: '50%',
                          boxSizing: 'border-box'
                        },
                        '&::before': {
                          top: '10%',
                          left: '10%',
                          borderTop: '2px solid rgba(255,255,255,0.8)',
                          borderLeft: '2px solid rgba(255,255,255,0.8)',
                          borderTopLeftRadius: '12px'
                        },
                        '&::after': {
                          bottom: '10%',
                          right: '10%',
                          borderBottom: '2px solid rgba(255,255,255,0.8)',
                          borderRight: '2px solid rgba(255,255,255,0.8)',
                          borderBottomRightRadius: '12px'
                        }
                      }}
                    />

                    {/* Scan line */}
                    <Box
                      component={motion.div}
                      animate={{
                        y: ["0%", "100%", "0%"],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        y: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                        },
                        opacity: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }
                      }}
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: `0 0 8px 2px ${theme.palette.primary.main}`,
                        zIndex: 1
                      }}
                    />
                  </Box>
                </Box>
                
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        overflow: 'hidden',
                        textAlign: 'center',
                        marginTop: '16px'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          color: theme.palette.error.main,
                          backgroundColor: `${theme.palette.error.light}20`,
                          py: 1,
                          px: 2,
                          borderRadius: '12px'
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
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Typography 
                    sx={{ 
                      mt: 3, 
                      textAlign: "center", 
                      color: "#86868b",
                      fontSize: "0.9rem"
                    }}
                  >
                    Position the QR code within the frame to scan
                  </Typography>
                </motion.div>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Sliding Family Information Panel */}
      <Slide direction="up" in={showPanel}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2, sm: 3 },
            pt: { xs: 3, sm: 4 },
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
            zIndex: 1100,
            maxHeight: "80vh",
            overflowY: "auto",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleReset}
              sx={{
                position: "absolute",
                top: -12,
                right: -8,
                color: theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Box sx={{ width: '40px', height: '5px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '5px', margin: '0 auto', mb: 3 }} />

            {isLoading ? (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  gap: 3,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      border: `3px solid ${theme.palette.primary.main}`,
                      borderTopColor: "transparent",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(0deg)",
                        },
                        "100%": {
                          transform: "rotate(360deg)",
                        },
                      },
                    }}
                  />
                </motion.div>
                <Typography sx={{ color: "#86868b", fontWeight: 500 }}>
                  Looking up family details...
                </Typography>
              </Box>
            ) : error ? (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                  gap: 2,
                }}
              >
                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <ErrorOutline sx={{ fontSize: 60, color: "error.main" }} />
                </Box>
                <Typography sx={{ color: "error.main", fontWeight: 500, textAlign: "center" }}>
                  {error}
                </Typography>
                <AnimatedButton
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderRadius: "12px",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                  onClick={handleReset}
                >
                  Try Again
                </AnimatedButton>
              </Box>
            ) : (
              scannedFamily && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      component={motion.h2}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{ 
                        textAlign: 'center',
                        fontWeight: 600,
                        color: '#1d1d1f',
                        mb: 1
                      }}
                    >
                      Family Details
                    </Typography>

                    {/* Household Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 112, 201, 0.1)'
                          }}
                        >
                          <HomeIcon sx={{ color: "#0070c9", fontSize: "1.3rem" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#0070c9" }}>
                            #{scannedFamily.homeId}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              component={motion.span}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: scannedFamily.landOwnership === "owned" ? "#34c759" : "#ff9f0a",
                              }}
                            />
                            <Typography sx={{ fontSize: "0.875rem", color: "#86868b" }}>
                              {scannedFamily.landOwnership === "owned" ? "Owner" : "Tenant"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Head of Family */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(88, 86, 214, 0.1)'
                          }}
                        >
                          <PersonIcon sx={{ color: "#5856d6", fontSize: "1.3rem" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>
                            {`${scannedFamily.headOfFamily.firstName} ${scannedFamily.headOfFamily.lastName}`}
                          </Typography>
                          <Typography sx={{ fontSize: "0.875rem", color: "#86868b" }}>
                            {scannedFamily.headOfFamily.occupation || "No occupation listed"}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Location & Contact */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 149, 0, 0.1)'
                          }}
                        >
                          <LocationIcon sx={{ color: "#ff9500", fontSize: "1.3rem" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.875rem" }}>{scannedFamily.address}</Typography>
                          {scannedFamily.headOfFamily.contact && (
                            <Typography sx={{ fontSize: "0.875rem", color: "#0070c9", mt: 0.5 }}>
                              {scannedFamily.headOfFamily.contact}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Family Composition */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(52, 199, 89, 0.1)'
                          }}
                        >
                          <PeopleIcon sx={{ color: "#34c759", fontSize: "1.3rem" }} />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                          <motion.div whileHover={{ y: -2 }}>
                            <Box
                              sx={{
                                backgroundColor: "rgba(0, 112, 201, 0.1)",
                                color: "#0070c9",
                                borderRadius: "20px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Adults: {1 + (scannedFamily.spouse ? 1 : 0)}
                            </Box>
                          </motion.div>
                          
                          {scannedFamily.children.length > 0 && (
                            <motion.div whileHover={{ y: -2 }}>
                              <Box
                                sx={{
                                  backgroundColor: "rgba(88, 86, 214, 0.1)",
                                  color: "#5856d6",
                                  borderRadius: "20px",
                                  px: 1.5,
                                  py: 0.5,
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Children: {scannedFamily.children.length}
                              </Box>
                            </motion.div>
                          )}
                          
                          {scannedFamily.otherMembers && scannedFamily.otherMembers.length > 0 && (
                            <motion.div whileHover={{ y: -2 }}>
                              <Box
                                sx={{
                                  backgroundColor: "rgba(52, 199, 89, 0.1)",
                                  color: "#34c759",
                                  borderRadius: "20px",
                                  px: 1.5,
                                  py: 0.5,
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Others: {scannedFamily.otherMembers.length}
                              </Box>
                            </motion.div>
                          )}
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <AnimatedButton
                          variant="outlined"
                          fullWidth
                          onClick={handleReset}
                          sx={{
                            borderRadius: "14px",
                            borderColor: "rgba(0,0,0,0.15)",
                            color: "text.secondary",
                            py: 1.2,
                            "&:hover": {
                              borderColor: "rgba(0,0,0,0.3)",
                              backgroundColor: "rgba(0,0,0,0.03)",
                            }
                          }}
                        >
                          Scan Again
                        </AnimatedButton>
                        
                        <AnimatedButton
                          variant="contained"
                          fullWidth
                          onClick={handleVisitProfile}
                          sx={{
                            borderRadius: "14px",
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            py: 1.2,
                            boxShadow: "0 4px 12px rgba(0,112,201,0.3)",
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                              boxShadow: "0 6px 16px rgba(0,112,201,0.4)",
                            }
                          }}
                        >
                          View Full Profile
                        </AnimatedButton>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              )
            )}
          </Box>
        </Paper>
      </Slide>
    </AnimatedPage>
  );
};

export default QRScannerComponent;
