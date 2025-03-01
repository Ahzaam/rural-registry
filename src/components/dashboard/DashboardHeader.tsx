import React, { useState } from "react";
import { Box, Typography, Button, IconButton, AppBar, Toolbar, Paper, Slide } from "@mui/material";
import { Logout as LogoutIcon, QrCode as QrCodeIcon, Close } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import QRScanner from "../QRScanner";
import { Family } from "/src/types/types";

interface DashboardHeaderProps {
  currentUser: { displayName: string } | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentUser }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedFamily, setScannedFamily] = useState<Family | null>(null);
  const [showFamilyPanel, setShowFamilyPanel] = useState(false);

  const ScannerOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.paper",
        zIndex: 9999,
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => {
              setShowQRScanner(false);
              setScannedFamily(null);
              setShowFamilyPanel(false);
            }}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Scan QR Code
          </Typography>
        </Toolbar>
      </AppBar>

      <QRScanner />

      <Slide direction="up" in={showFamilyPanel}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: 3,
          }}
        >
          {scannedFamily && (
            <>
              <Typography variant="h6" gutterBottom>
                {scannedFamily.headOfFamily.firstName} {scannedFamily.headOfFamily.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Home ID: {scannedFamily.homeId}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ flex: 3 }}
                  onClick={() => {
                    navigate(`/family/${scannedFamily.id}`);
                    setShowQRScanner(false);
                    setScannedFamily(null);
                    setShowFamilyPanel(false);
                  }}
                >
                  Visit Profile
                </Button>
                <Button
                  variant="outlined"
                  sx={{ flex: 1 }}
                  onClick={() => {
                    setShowFamilyPanel(false);
                    setScannedFamily(null);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Slide>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        gap: { xs: 2, md: 0 },
        mb: { xs: 1, md: 2 },
      }}
    >
      <Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#1d1d1f",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            letterSpacing: "-0.5px",
          }}
        >
          Village Registry
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#86868b",
            fontWeight: 500,
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          Manage and track family records efficiently
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          alignItems: { xs: "center", md: "flex-end" },
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#86868b",
            fontWeight: 500,
          }}
        >
          Welcome, {currentUser?.displayName}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: "20px",
            borderColor: "#0070c9",
            color: "#0070c9",
            px: { xs: 2, md: 3 },
            "&:hover": {
              borderColor: "#005ea3",
              backgroundColor: "rgba(0, 112, 201, 0.08)",
              transform: "scale(1.02)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => setShowQRScanner(true)}
          startIcon={<QrCodeIcon />}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#0070c9",
            color: "#fff",
            px: { xs: 2, md: 3 },
            "&:hover": {
              backgroundColor: "#005ea3",
              transform: "scale(1.02)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Scan QR
        </Button>
      </Box>
      {showQRScanner && <ScannerOverlay />}
    </Box>
  );
};

export default DashboardHeader;
