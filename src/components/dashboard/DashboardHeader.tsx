import React, { useState } from "react";
import { Box, Typography, Button, IconButton, AppBar, Toolbar, Paper, Slide } from "@mui/material";
import { Logout as LogoutIcon, Close } from "@mui/icons-material";
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
      </Box>
    </Box>
  );
};

export default DashboardHeader;
