import React, { useState } from "react";
import { Button, Typography, CircularProgress, Fade, Paper, TextField, Divider, Alert, Stack } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Google as GoogleIcon } from "@mui/icons-material";

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, currentUser, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      await signInWithGoogle();
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

  if (currentUser) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <Fade in={true} timeout={800}>
        <Paper elevation={0} className="w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-xl">
          <div className="px-8 pt-16 pb-16 bg-white">
            {/* Logo placeholder */}
            <div className="flex justify-center mb-10">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                <Typography variant="h4" className="text-white font-bold">
                  HR
                </Typography>
              </div>
            </div>

            <Typography component="h1" className="text-center text-3xl font-medium text-gray-900 tracking-tight mb-3">
              Hapugastalawa Village Registry
            </Typography>

            <Typography className="text-center text-gray-500 mb-8" variant="subtitle1">
              Admin Portal
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    py: "14px",
                    backgroundColor: "#0070c9",
                    "&:hover": { backgroundColor: "#005ea3" },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
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
            </Button>

            <Typography variant="body2" className="mt-10 text-center text-gray-500 text-sm">
              Only authorized administrators can access this system.
            </Typography>
          </div>
        </Paper>
      </Fade>
    </div>
  );
};

export default Login;
