import React, { useState } from "react";
import { Typography, Alert, Stack, Paper, TextField, Divider, Box, Button } from "@mui/material";
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
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <Paper 
          elevation={0} 
          className="w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-xl"
          sx={{ 
            overflow: 'hidden',
            borderRadius: '24px' 
          }}
        >
         

          <div className="px-8 pt-12 pb-16 bg-white">
            <AnimatedContainer animation="slide" delay={0.1}>
              {/* Logo with subtle animation */}
              <motion.div 
                className="flex justify-center mb-10"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 
                }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-[#1F4C6B] flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Typography variant="h4" className="text-white font-bold">
                    MM
                  </Typography>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Typography 
                  component="h1" 
                  className="text-center text-3xl font-medium text-gray-900 tracking-tight mb-3"
                  sx={{ fontWeight: 600 }}
                >
                  Masjidul Minhaj
                </Typography>

                <Typography 
                  className="text-center text-gray-500 mb-8" 
                  variant="subtitle1"
                >
                  Admin Portal
                </Typography>
              </motion.div>
            </AnimatedContainer>

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

            <AnimatedContainer animation="fade" delay={0.4}>
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
            </AnimatedContainer>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Typography variant="body2" className="mt-10 text-center text-gray-500 text-sm">
                Only authorized administrators can access this system.
              </Typography>
            </motion.div>
          </div>
        </Paper>
      </div>
    </AnimatedPage>
  );
};

export default Login;
