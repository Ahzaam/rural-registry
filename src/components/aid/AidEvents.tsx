import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  IconButton,
  useTheme
} from '@mui/material';
import { ArrowBack, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AidEvent } from '../../types/types';
import { getAidEvents, createAidEvent } from '../../services/aidEventService';
import { EventsList } from './EventsList';
import { CreateEventModal } from './CreateEventModal';
import { motion } from 'framer-motion';
import AnimatedPage from '../common/AnimatedPage';

export const AidEvents: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [events, setEvents] = useState<AidEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await getAidEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (event: Omit<AidEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createAidEvent(event);
      await loadEvents();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
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
            gap: { xs: 3, md: 4 },
          }}>
            {/* Header Section */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: { xs: 2, md: 0 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton 
                    onClick={() => navigate('/dashboard')}
                    sx={{ 
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </motion.div>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1d1d1f',
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      backgroundImage: "linear-gradient(90deg, #0070c9, #5ac8fa)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 1px 2px rgba(0,0,0,0.04)"
                    }}
                  >
                     Events
                  </Typography>
               
                </Box>
              </Box>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsCreateModalOpen(true)}
                  sx={{ 
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: '0 4px 12px rgba(0, 112, 201, 0.25)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: '0 6px 16px rgba(0, 112, 201, 0.35)'
                    },
                    alignSelf: { xs: 'stretch', md: 'auto' },
                    fontWeight: 500
                  }}
                >
                  Create New Event
                </Button>
              </motion.div>
            </Box>

            {/* Content Section */}
            {loading ? (
              <Box 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '300px',
                  gap: 2
                }}
              >
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ color: '#86868b' }}>Loading aid events...</Typography>
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <EventsList 
                  events={events} 
                  onEventUpdated={loadEvents}
                />
              </motion.div>
            )}
          </Box>
        </Container>

        {isCreateModalOpen && (
          <CreateEventModal
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateEvent}
          />
        )}
      </Box>
    </AnimatedPage>
  );
};