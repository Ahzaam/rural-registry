import React from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../common/AnimatedButton";

interface DashboardHeaderProps {
  currentUser: { displayName: string; email?: string; photoURL?: string } | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentUser }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!currentUser?.displayName) return "?";
    return currentUser.displayName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.2, 
        duration: 0.6 
      }
    }
  };

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.3, 
        duration: 0.5, 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }
    }
  };

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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#1d1d1f",
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              letterSpacing: "-0.5px",
              backgroundImage: "linear-gradient(90deg, #0070c9, #5ac8fa)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}
          >
            Village Registry
          </Typography>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
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
        </motion.div>
      </Box>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={profileVariants}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: { xs: 1.5, md: 2 },
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <Avatar 
            src={currentUser?.photoURL || undefined}
            sx={{ 
              bgcolor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0, 112, 201, 0.25)",
              border: "2px solid white"
            }}
          >
            {getUserInitials()}
          </Avatar>
          
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#1d1d1f",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.displayName || "User"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#86868b",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentUser?.email || ""}
              </Typography>
              
              <AnimatedButton
                variant="text"
                size="small"
                onClick={logout}
                sx={{
                  fontSize: "0.8rem",
                  color: theme.palette.primary.main,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "rgba(0, 112, 201, 0.08)",
                  }
                }}
              >
                Logout
              </AnimatedButton>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default DashboardHeader;
