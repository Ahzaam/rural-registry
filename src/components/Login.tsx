import React, { useState } from "react";
import { Typography, Alert, Stack, Paper, TextField, Divider, Box, Button, Container } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { Google as GoogleIcon, Announcement as AnnouncementIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import AnimatedButton from "./common/AnimatedButton";
import AnimatedPage from "./common/AnimatedPage";
import AnimatedContainer from "./common/AnimatedContainer";

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, currentUser, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during authentication");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during authentication");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (currentUser) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            {/* Organization Logo & Name */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1d1d1f',
                  mb: 2
                }}
              >
                Masjidul-Minhaj
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#86868b',
                }}
              >
                Family Management System
              </Typography>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleEmailAuth}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  autoComplete="username"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  autoComplete="current-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <AnimatedButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  fullWidth
                  size="large"
                  sx={{
                    py: "14px",
                    backgroundColor: "#1F4C6B",
                    "&:hover": { backgroundColor: "#153449" },
                  }}
                >
                  Sign In
                </AnimatedButton>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>or</Divider>

            <AnimatedButton
              variant="outlined"
              onClick={handleGoogleSignIn}
              loading={isGoogleLoading}
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              sx={{
                py: "14px",
                borderColor: "#dadce0",
                color: "#3c4043",
                "&:hover": {
                  borderColor: "#dadce0",
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              Continue with Google
            </AnimatedButton>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Typography variant="body2" className="mt-10 text-center text-gray-500 text-sm">
                Only authorized administrators can access this system.
              </Typography>
            </motion.div>

            {/* Software Company Credit */}
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 24, height: 24 }}>
                  <svg width="24" height="24" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c6a55c" />
                        <stop offset="50%" stopColor="#f9d77f" />
                        <stop offset="100%" stopColor="#c6a55c" />
                      </linearGradient>
                    </defs>
                    <path d="M350 250c0 55.23-44.77 100-100 100-55.23 0-100-44.77-100-100s44.77-100 100-100c30 0 56.79 13.43 75 34.58" 
                          stroke="url(#goldGradient)" 
                          stroke-width="24" 
                          fill="none" 
                          stroke-linecap="round"/>
                    <line x1="295" y1="250" x2="350" y2="250" 
                          stroke="url(#goldGradient)" 
                          stroke-width="24" 
                          stroke-linecap="round"/>
                  </svg>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#86868b',
                      letterSpacing: '0.02em'
                    }}
                  >
                    Powered by
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1d1d1f',
                      fontWeight: 500,
                      letterSpacing: '0.02em'
                    }}
                  >
                    Glide Ceylon
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'rgba(66, 133, 244, 0.1)'
                }}
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjNDI4NWY0IiBkPSJNMjQgNGMtNy40NzMgMC0xMy41MjEgNi4wNDgtMTMuNTIxIDEzLjUyMSAwIDcuNDczIDYuMDQ4IDEzLjUyMSAxMy41MjEgMTMuNTIxIDcuNDczIDAgMTMuNTIxLTYuMDQ4IDEzLjUyMS0xMy41MjFDMzcuNTIxIDEwLjA0OCAzMS40NzMgNCAyNCA0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNCA5LjM3NWMzLjQyIDAgNi4yMzcgMi44MTcgNi4yMzcgNi4yMzdzLTIuODE3IDYuMjM3LTYuMjM3IDYuMjM3LTYuMjM3LTIuODE3LTYuMjM3LTYuMjM3UzIwLjU4IDkuMzc1IDI0IDkuMzc1eiIvPjwvc3ZnPg=="
                  style={{ width: 14, height: 14 }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#4285f4',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}
                >
                  Secured by Google Cloud
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
