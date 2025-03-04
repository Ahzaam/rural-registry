import React from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Fade,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { QrCode as QrCodeIcon } from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types/types";
interface DashboardHeaderProps {
  currentUser: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentUser }) => {
  const { logout, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
      <Toolbar>
        {/* Organization Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1d1d1f",
              fontSize: "1.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Masjidul-Minhaj
          </Typography>
        </Box>

        {/* Existing user menu */}
        {!isMobile && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              display: "flex",
              gap: 2,
              mx: "auto",
            }}
          >
            <Button
              component={RouterLink}
              to="/scanner"
              startIcon={<QrCodeIcon />}
              sx={{
                color: "#1F4C6B",
                fontWeight: 500,
                borderRadius: 28,
                px: 2,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(31, 76, 107, 0.08)",
                },
              }}
            >
              Scan
            </Button>

            <Button
              component={RouterLink}
              to="/aid-events"
              startIcon={<VolunteerActivismIcon />}
              sx={{
                color: "#1F4C6B",
                fontWeight: 500,
                borderRadius: 28,
                px: 2,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(31, 76, 107, 0.08)",
                },
              }}
            >
              Aid Events
            </Button>

            {isAdmin && (
              <Button
                component={RouterLink}
                to="/admin/announcements"
                startIcon={<AnnouncementIcon />}
                sx={{
                  color: "#1F4C6B",
                  fontWeight: 500,
                  borderRadius: 28,
                  px: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "rgba(31, 76, 107, 0.08)",
                  },
                }}
              >
                Announcements
              </Button>
            )}
          </Box>
        )}

        {isMobile ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                backgroundColor: "rgba(31, 76, 107, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(31, 76, 107, 0.15)",
                },
                mr: 1,
              }}
            >
              <MenuIcon sx={{ color: "#1F4C6B" }} />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: 2,
                  minWidth: 200,
                  mt: 1.5,
                  py: 1,
                  overflow: "hidden",
                },
              }}
            >
              <MenuItem onClick={handleClose} component={RouterLink} to="/dashboard" sx={{ py: 1.5, px: 2 }}>
                <QrCodeIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: "#1F4C6B" }} />
                <Typography variant="body1">Scan</Typography>
              </MenuItem>

              <MenuItem onClick={handleClose} component={RouterLink} to="/aid-events" sx={{ py: 1.5, px: 2 }}>
                <VolunteerActivismIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: "#1F4C6B" }} />
                <Typography variant="body1">Aid Events</Typography>
              </MenuItem>

              {isAdmin && (
                <MenuItem onClick={handleClose} component={RouterLink} to="/admin/announcements" sx={{ py: 1.5, px: 2 }}>
                  <AnnouncementIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: "#1F4C6B" }} />
                  <Typography variant="body1">Announcements</Typography>
                </MenuItem>
              )}

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
                sx={{ py: 1.5, px: 2 }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: "1.2rem", color: "#DC3545" }} />
                <Typography variant="body1" color="#DC3545">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>

            <IconButton
              onClick={logout}
              sx={{
                backgroundColor: "rgba(31, 76, 107, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(31, 76, 107, 0.15)",
                },
              }}
            >
              <LogoutIcon sx={{ color: "#1F4C6B" }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "rgba(31, 76, 107, 0.1)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#1F4C6B", fontWeight: 500 }}>
                {currentUser?.email}
              </Typography>
              <IconButton
                size="small"
                onClick={logout}
                sx={{
                  color: "#1F4C6B",
                  "&:hover": { color: "#DC3545" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>

            {/* Software Company Credit */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                opacity: 0.7,
              }}
            >
              <Box sx={{ width: 24, height: 24 }}>
                <svg width="24" height="24" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c6a55c" />
                      <stop offset="50%" stopColor="#f9d77f" />
                      <stop offset="100%" stopColor="#c6a55c" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M350 250c0 55.23-44.77 100-100 100-55.23 0-100-44.77-100-100s44.77-100 100-100c30 0 56.79 13.43 75 34.58"
                    stroke="url(#goldGradient)"
                    stroke-width="24"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <line
                    x1="295"
                    y1="250"
                    x2="350"
                    y2="250"
                    stroke="url(#goldGradient)"
                    stroke-width="24"
                    stroke-linecap="round"
                  />
                </svg>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#86868b",
                  letterSpacing: "0.02em",
                }}
              >
                by Glide Ceylon
              </Typography>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
