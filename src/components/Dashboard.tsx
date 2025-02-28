import React, { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getFamilies, deleteFamily } from '../services/familyService';
import { Family } from '../types/types';
import DashboardHeader from './dashboard/DashboardHeader';
import SearchActions from './dashboard/SearchActions';
import FamilyCard from './dashboard/FamilyCard';
import FamilyTable from './dashboard/FamilyTable';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const data = await getFamilies();
        setFamilies(data);
      } catch (error) {
        console.error('Error loading families:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, []);

  const handleDeleteFamily = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this family record?')) {
      try {
        await deleteFamily(id);
        setFamilies(families.filter(family => family.id !== id));
      } catch (error) {
        console.error('Error deleting family:', error);
      }
    }
  };

  const filteredFamilies = families.filter(family => {
    const searchLower = searchTerm.toLowerCase();
    return (
      family.homeId.toLowerCase().includes(searchLower) ||
      family.address.toLowerCase().includes(searchLower) ||
      family.headOfFamily.firstName.toLowerCase().includes(searchLower) ||
      family.headOfFamily.lastName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
      pt: { xs: 2, md: 4 },
      pb: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 4 },
        }}>
          {/* Header Section */}
          <DashboardHeader currentUser={currentUser} />

          {/* Search and Add Section */}
          <SearchActions 
            searchTerm={searchTerm} 
            onSearchChange={(value) => setSearchTerm(value)} 
          />

          {/* Content Section */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '300px'
            }}>
              <CircularProgress sx={{ color: '#0070c9' }} />
            </Box>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <Box sx={{ mt: 2 }}>
                  {filteredFamilies.map((family) => (
                    <FamilyCard 
                      key={family.id} 
                      family={family} 
                      onDelete={handleDeleteFamily}
                    />
                  ))}
                </Box>
              ) : (
                // Desktop Table View
                <FamilyTable 
                  families={filteredFamilies} 
                  onDelete={handleDeleteFamily} 
                />
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
