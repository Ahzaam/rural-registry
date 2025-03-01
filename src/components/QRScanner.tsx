import React, { useState } from "react";
import { Box, Container, Typography, Button, Paper, Slide, CircularProgress } from "@mui/material";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Home as HomeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  ErrorOutline,
} from "@mui/icons-material";
import { Family } from "../types/types";
import { getFamilyById } from "../services/familyService";

const QRScannerComponent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [scannedFamilyId, setScannedFamilyId] = useState<string | null>(null);
  const [scannedFamily, setScannedFamily] = useState<Family | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (data: IDetectedBarcode[]) => {
    if (data) {
      console.log(data);
      // Extract family ID from QR code
      const familyId = data[0].rawValue.split("-")[1];
      if (familyId) {
        try {
          setIsLoading(true);
          setError(null);
          setShowPanel(true);

          const family = await getFamilyById(familyId);
          if (family) {
            setScannedFamily(family);
            setScannedFamilyId(familyId);
          } else {
            setError("Family not found");
            setScannedFamily(null);
          }
        } catch (error) {
          console.error("Error fetching family:", error);
          setError("Error fetching family details");
          setScannedFamily(null);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{
            color: "#0070c9",
            mb: 2,
          }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
            Scan Family QR Code
          </Typography>
          <Box
            sx={{
              maxWidth: "500px",
              margin: "0 auto",
              "& video": {
                borderRadius: "16px",
                width: "100% !important",
                height: "auto !important",
              },
            }}
          >
            <Scanner onScan={handleScan} onError={handleError} />
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
          <Typography sx={{ mt: 3, textAlign: "center", color: "#86868b" }}>
            Position the QR code within the frame to scan
          </Typography>
        </Paper>
      </Box>

      {/* Sliding Family Information Panel */}
      <Slide direction="up" in={showPanel}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            boxShadow: "0 -10px 30px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                gap: 2,
              }}
            >
              <CircularProgress size={40} sx={{ color: "primary.main" }} />
              <Typography sx={{ color: "#86868b" }}>Looking up family details...</Typography>
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                gap: 2,
              }}
            >
              <ErrorOutline sx={{ fontSize: 48, color: "error.main" }} />
              <Typography sx={{ color: "error.main", fontWeight: 500 }}>{error}</Typography>
              <Button
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  borderColor: "grey.300",
                  color: "grey.700",
                  "&:hover": {
                    borderColor: "grey.400",
                    bgcolor: "grey.50",
                  },
                }}
                onClick={() => {
                  setShowPanel(false);
                  setScannedFamily(null);
                  setScannedFamilyId(null);
                  setError(null);
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            scannedFamily && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Household Info */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HomeIcon sx={{ color: "#0070c9", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#0070c9" }}>#{scannedFamily.homeId}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="span"
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

                {/* Head of Family */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <PersonIcon sx={{ color: "#86868b", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {`${scannedFamily.headOfFamily.firstName} ${scannedFamily.headOfFamily.lastName}`}
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "#86868b" }}>
                      {scannedFamily.headOfFamily.occupation || "No occupation listed"}
                    </Typography>
                  </Box>
                </Box>

                {/* Location & Contact */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationIcon sx={{ color: "#86868b", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem" }}>{scannedFamily.address}</Typography>
                    {scannedFamily.headOfFamily.contact && (
                      <Typography sx={{ fontSize: "0.875rem", color: "#0070c9", mt: 0.5 }}>
                        {scannedFamily.headOfFamily.contact}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Family Composition */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PeopleIcon sx={{ color: "#86868b", fontSize: "1.2rem" }} />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                    {scannedFamily.children.length > 0 && (
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
                    )}
                    {scannedFamily.otherMembers && scannedFamily.otherMembers.length > 0 && (
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
                    )}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleVisitProfile}
                    sx={{
                      flex: 3,
                      borderRadius: "12px",
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    Visit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderRadius: "12px",
                      borderColor: "grey.300",
                      color: "grey.700",
                      "&:hover": {
                        borderColor: "grey.400",
                        bgcolor: "grey.50",
                      },
                    }}
                    onClick={() => {
                      setShowPanel(false);
                      setScannedFamily(null);
                      setScannedFamilyId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )
          )}
        </Paper>
      </Slide>
    </Container>
  );
};

export default QRScannerComponent;
