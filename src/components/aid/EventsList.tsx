import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { AidEvent } from '../../types/types';
import { EventDetails } from './EventDetails';

interface Props {
  events: AidEvent[];
  onEventUpdated: () => void;
}

export const EventsList: React.FC<Props> = ({ events, onEventUpdated }) => {
  const [selectedEvent, setSelectedEvent] = useState<AidEvent | null>(null);

  const getStatusColor = (status: AidEvent['status']) => {
    switch (status) {
      case 'planned':
        return { color: 'warning.main', bgcolor: 'warning.lighter' };
      case 'ongoing':
        return { color: 'info.main', bgcolor: 'info.lighter' };
      case 'completed':
        return { color: 'success.main', bgcolor: 'success.lighter' };
      default:
        return { color: 'text.secondary', bgcolor: 'grey.100' };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '80px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow 
                key={event.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(0, 0, 0, 0.01)',
                    '& .row-actions': { opacity: 1 }
                  }
                }}
              >
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.type === 'distribution' ? 'Distribution' : 'Collection'}
                    size="small"
                    sx={{ 
                      borderRadius: '12px',
                      bgcolor: event.type === 'distribution' ? 'primary.lighter' : 'secondary.lighter',
                      color: event.type === 'distribution' ? 'primary.main' : 'secondary.main',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.status}
                    size="small"
                    sx={{ 
                      borderRadius: '12px',
                      ...getStatusColor(event.status),
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box 
                    className="row-actions" 
                    sx={{ 
                      opacity: 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setSelectedEvent(event)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { 
                          bgcolor: 'primary.lighter',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={onEventUpdated}
        />
      )}
    </>
  );
};