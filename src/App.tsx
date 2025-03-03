import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import QRScanner from "./components/QRScanner";
import FamilyDetails from "./components/FamilyDetails";
import AddFamily from "./components/AddFamily";
import BatchCreate from "./components/BatchCreate";
import BatchReview from "./components/BatchReview";
import ProfileVerification from "./components/ProfileVerification";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { AidEvents } from "./components/aid/AidEvents";
import { ManageEventFamilies } from "./components/aid/ManageEventFamilies";
import Announcements from "./components/announcements/Announcements";
import AnnouncementsAdmin from "./components/announcements/AnnouncementsAdmin";
import FamilyHistory from "./components/details/FamilyHistory";
import { theme } from "./theme";
import { getFeatureFlags } from "./services/featureFlagService";
import { CircularProgress, Container } from "@mui/material";
import EventSummary from "./components/aid/EventSummary";
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return null;
  }

  return currentUser && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [landingEnabled, setLandingEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeatureFlags = async () => {
      try {
        const flags = await getFeatureFlags();
        setLoading(false);
        if (flags.enableLandingPage === undefined) {
          flags.enableLandingPage = false;
        }

        setLandingEnabled(flags.enableLandingPage);
      } catch (error) {
        console.error("Error checking feature flags:", error);
        setLoading(false);
        setLandingEnabled(false);
      }
    };

    checkFeatureFlags();
  }, []);

  if (landingEnabled === null) {
    return null;
  }

  const LoadingComponent = () => {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 15,
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <React.Fragment>
          <svg width={0} height={0}>
            <defs>
              <linearGradient
                id="my_gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e01cd5" />
                <stop offset="100%" stopColor="#1CB5E0" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </React.Fragment>
      </Container>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <AnimationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    <LoadingComponent />
                  ) : landingEnabled ? (
                    <Announcements />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/verify/:token" element={<ProfileVerification />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scanner" element={<QRScanner />} />
                <Route path="/families/new" element={<AddFamily />} />
                <Route path="/batch-create" element={<BatchCreate />} />
                <Route path="/batch-review" element={<BatchReview />} />
                <Route path="/families/:id" element={<FamilyDetails />} />
                <Route path="/families/:id/history" element={<FamilyHistory />} />
                <Route path="/aid-events" element={<AidEvents />} />
                <Route
                  path="/aid-events/:eventId/manage-families"
                  element={<ManageEventFamilies />}
                />
                <Route path="/aid-events/:eventId/summary" element={<EventSummary />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route
                  path="/admin/announcements"
                  element={<AnnouncementsAdmin />}
                />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
};

export default App;
