import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import FamilyDetails from './components/FamilyDetails';
import AddFamily from './components/AddFamily';
import { AuthProvider } from './contexts/AuthContext';
import { AnimationProvider } from './contexts/AnimationContext';
import { AidEvents } from './components/aid/AidEvents';
import { ManageEventFamilies } from './components/aid/ManageEventFamilies';
import { theme } from './theme';

// AnimatePresence requires location from useLocation, which must be used inside Router
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<QRScanner />} />
        <Route path="/families/new" element={<AddFamily />} />
        <Route path="/families/:id" element={<FamilyDetails />} />
        <Route path="/aid-events" element={<AidEvents />} />
        <Route path="/aid-events/:eventId/manage-families" element={<ManageEventFamilies />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AnimationProvider>
        <AuthProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </AuthProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
};

export default App;
