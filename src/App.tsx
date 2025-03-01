import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import FamilyDetails from './components/FamilyDetails';
import AddFamily from './components/AddFamily';
import { AuthProvider } from './contexts/AuthContext';
import { AidEvents } from './components/aid/AidEvents';
import { ManageEventFamilies } from './components/aid/ManageEventFamilies';
import { theme } from '@/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/families/new" element={<AddFamily />} />
            <Route path="/families/:id" element={<FamilyDetails />} />
            <Route path="/aid-events" element={<AidEvents />} />
            <Route path="/aid-events/:eventId/manage-families" element={<ManageEventFamilies />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
