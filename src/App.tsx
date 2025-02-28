import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddFamily from './components/AddFamily';
import Login from './components/Login';
import FamilyDetails from './components/FamilyDetails';
import QRScannerComponent from './components/QRScanner';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/families/new" element={<AddFamily />} />
          <Route path="/families/:id" element={<FamilyDetails />} />
          <Route path="/scanner" element={<QRScannerComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
