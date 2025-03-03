import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AidEvent, Family, Distribution, MonthlyContribution } from '../../types/types';
import { getDistributionsByEvent, getContributionsByEvent } from '../../services/aidEventService';
import { getFamilies } from '../../services/familyService';

interface Props {
  event: AidEvent;
  onClose: () => void;
  onEventUpdated: (event: AidEvent) => void;
}

export const EventDetails: React.FC<Props> = ({ event, onClose, onEventUpdated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState<Family[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [contributions, setContributions] = useState<MonthlyContribution[]>([]);

  useEffect(() => {
    loadData();
  }, [event.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedFamilies, fetchedRecords] = await Promise.all([
        getFamilies(),
        event.type === 'distribution' 
          ? getDistributionsByEvent(event.id)
          : getContributionsByEvent(event.id)
      ]);

      setFamilies(fetchedFamilies);
      if (event.type === 'distribution') {
        setDistributions(fetchedRecords as Distribution[]);
      } else {
        setContributions(fetchedRecords as MonthlyContribution[]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFamilyName = (familyId: string) => {
    const family = families.find(f => f.id === familyId);
    return family ? `${family.headOfFamily.firstName} ${family.headOfFamily.lastName}` : 'Unknown';
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {event.name}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/aid-events/${event.id}/manage-families`)}
            sx={{ 
              borderRadius: '12px',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Manage Families
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#0070c9' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Family</TableCell>
                  <TableCell>Status</TableCell>
                  {event.type === 'collection' && <TableCell align="right">Amount</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {(event.type === 'distribution' ? distributions : contributions).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{getFamilyName(record.familyId)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={record.status}
                        size="small"
                        sx={{ 
                          borderRadius: '12px',
                          bgcolor: record.status === 'distributed' || record.status === 'paid' 
                            ? 'success.lighter'
                            : record.status === 'skipped' || record.status === 'excused'
                            ? 'warning.lighter'
                            : 'info.lighter',
                          color: record.status === 'distributed' || record.status === 'paid'
                            ? 'success.main'
                            : record.status === 'skipped' || record.status === 'excused'
                            ? 'warning.main'
                            : 'info.main',
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    {event.type === 'collection' && (
                      <TableCell align="right">
                        Rs. {(record as MonthlyContribution).amount || 0}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};