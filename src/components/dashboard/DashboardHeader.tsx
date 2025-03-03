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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { User } from "firebase/auth";
import { motion } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import {QrCode as QrCodeIcon} from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useAuth } from "../../contexts/AuthContext";

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#1F4C6B",
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            backgroundImage: "linear-gradient(90deg, #1F4C6B, #2D6E9B)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          Masjidul Minhaj
        </Typography>
      </motion.div>

      {/* Navigation Links for desktop */}
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
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(31, 76, 107, 0.08)',
              }
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
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(31, 76, 107, 0.08)',
              }
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
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(31, 76, 107, 0.08)',
                }
              }}
            >
              Announcements
            </Button>
          )}
        </Box>
      )}

      {isMobile ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
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
                overflow: 'hidden',
              }
            }}
          >
            <MenuItem 
              onClick={handleClose}
              component={RouterLink}
              to="/dashboard"
              sx={{ py: 1.5, px: 2 }}
            >
              <QrCodeIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: "#1F4C6B" }} />
              <Typography variant="body1">Scan</Typography>
            </MenuItem>
            
            <MenuItem 
              onClick={handleClose}
              component={RouterLink}
              to="/aid-events"
              sx={{ py: 1.5, px: 2 }}
            >
              <VolunteerActivismIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: "#1F4C6B" }} />
              <Typography variant="body1">Aid Events</Typography>
            </MenuItem>
            
            {isAdmin && (
              <MenuItem 
                onClick={handleClose}
                component={RouterLink}
                to="/admin/announcements"
                sx={{ py: 1.5, px: 2 }}
              >
                <AnnouncementIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: "#1F4C6B" }} />
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
              <LogoutIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: "#DC3545" }} />
              <Typography variant="body1" color="#DC3545">Logout</Typography>
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
      )}
    </Box>
  );
};

export default DashboardHeader;
