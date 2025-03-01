import React, { useEffect, useState } from 'react';
import { Container, Box, useTheme, useMediaQuery, Skeleton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getFamilies, deleteFamily } from '../services/familyService';
import { Family } from '../types/types';
import DashboardHeader from './dashboard/DashboardHeader';
import SearchActions from './dashboard/SearchActions';
import FamilyCard from './dashboard/FamilyCard';
import FamilyTable from './dashboard/FamilyTable';
import AnimatedPage from './common/AnimatedPage';
import AnimatedContainer from './common/AnimatedContainer';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

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
        setDeleteInProgress(id); // Track which family is being deleted
        await deleteFamily(id);
        setFamilies(families.filter(family => family.id !== id));
      } catch (error) {
        console.error('Error deleting family:', error);
      } finally {
        setDeleteInProgress(null);
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

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Skeleton loaders
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Box 
        key={index} 
        sx={{ 
          mb: 2, 
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ width: '100%' }}>
              <Skeleton width="60%" height={28} />
              <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
            </Box>
          </Box>
          <Skeleton width="90%" height={20} sx={{ mt: 2 }} />
          <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Skeleton width={80} height={36} sx={{ mr: 1, borderRadius: 2 }} />
            <Skeleton width={80} height={36} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    ));
  };

  return (
    <AnimatedPage>
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
            {/* Header Section with animation */}
            <AnimatedContainer animation="slide" delay={0.1}>
              <DashboardHeader currentUser={currentUser} />
            </AnimatedContainer>

            {/* Search and Add Section with animation */}
            <AnimatedContainer animation="slide" delay={0.2}>
              <SearchActions 
                searchTerm={searchTerm} 
                onSearchChange={(value) => setSearchTerm(value)} 
              />
            </AnimatedContainer>

            {/* Content Section */}
            <AnimatedContainer animation="fade" delay={0.3}>
              {loading ? (
                <Box sx={{ my: 2 }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isMobile ? (
                      renderSkeletons()
                    ) : (
                      <Box 
                        sx={{ 
                          backgroundColor: 'white',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                          p: 3
                        }}
                      >
                        <Skeleton width="100%" height={50} sx={{ mb: 2 }} />
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton key={index} width="100%" height={60} sx={{ mb: 1 }} />
                        ))}
                      </Box>
                    )}
                  </motion.div>
                </Box>
              ) : (
                <>
                  {/* Show empty state if no families match search */}
                  {filteredFamilies.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography variant="h5" sx={{ mb: 1, color: theme.palette.text.primary }}>
                        No families found
                      </Typography>
                      <Typography variant="body1" color="textSecondary" align="center">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Add a new family to get started'}
                      </Typography>
                    </motion.div>
                  ) : (
                    <>
                      {/* Mobile Cards View */}
                      {isMobile ? (
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="show"
                        >
                          <AnimatePresence mode="popLayout">
                            {filteredFamilies.map((family) => (
                              <motion.div
                                key={family.id}
                                variants={itemVariants}
                                layout
                                exit={{ 
                                  opacity: 0, 
                                  y: -20, 
                                  transition: { duration: 0.3 } 
                                }}
                              >
                                <FamilyCard 
                                  family={family} 
                                  onDelete={handleDeleteFamily}
                                  isDeleting={deleteInProgress === family.id} 
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        // Desktop Table View with animation
                        <FamilyTable 
                          families={filteredFamilies} 
                          onDelete={handleDeleteFamily}
                          deletingId={deleteInProgress}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </AnimatedContainer>
          </Box>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default Dashboard;
