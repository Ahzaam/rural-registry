import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  IconButton
} from '@mui/material';
import { ArrowBack, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AidEvent } from '../../types/types';
import { getAidEvents, createAidEvent } from '../../services/aidEventService';
import { EventsList } from './EventsList';
import { CreateEventModal } from './CreateEventModal';

export const AidEvents: React.FC = () => {
  const navigate = useNavigate();
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
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'grey.50',
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
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 2, md: 0 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  color: 'primary.main',
                  bgcolor: 'primary.lighter',
                  '&:hover': { bgcolor: 'primary.light' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1d1d1f',
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                  }}
                >
                  Aid Events
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#86868b',
                    fontWeight: 500,
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Manage distributions and collections
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateModalOpen(true)}
              sx={{ 
                borderRadius: '12px',
                px: 3,
                py: 1,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                alignSelf: { xs: 'stretch', md: 'auto' }
              }}
            >
              Create New Event
            </Button>
          </Box>

          {/* Content Section */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '300px'
            }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : (
            <EventsList 
              events={events} 
              onEventUpdated={loadEvents}
            />
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
  );
};