import React, { useState } from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const QRScannerComponent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: IDetectedBarcode[]) => {
    if (data) {
      console.log(data);
      // Extract family ID from QR code
      const familyId = data[0].rawValue.split("-")[1];
      if (familyId) {
        navigate(`/families/${familyId}`);
      } else {
        setError("Invalid QR code format");
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
    setError("Error accessing camera");
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
    </Container>
  );
};

export default QRScannerComponent;
