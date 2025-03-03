import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Button,
  Stack,
  Dialog,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AidEvent, Distribution, MonthlyContribution, Family } from '../../types/types';
import { getAidEvent, subscribeToEventRecords, updateAidEvent } from '../../services/aidEventService';
import { getFamilies } from '../../services/familyService';
import { ChevronLeft } from '@mui/icons-material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AnimatedPage from '../common/AnimatedPage';
import EventSummaryPDF from './EventSummaryPDF';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const EventSummary = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<AidEvent | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [records, setRecords] = useState<(Distribution | MonthlyContribution)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  // Calculate contribution totals
  const getContributionMetrics = () => {
    if (event?.type !== 'collection') return null;
    
    const totalExpected = event.targetAmount ? event.targetAmount * records.length : 0;
    const totalCollected = (records as MonthlyContribution[])
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    const pending = (records as MonthlyContribution[])
      .filter(r => r.status === 'pending')
      .length;
    const excused = (records as MonthlyContribution[])
      .filter(r => r.status === 'excused')
      .length;
    const paid = (records as MonthlyContribution[])
      .filter(r => r.status === 'paid')
      .length;

    return {
      totalExpected,
      totalCollected,
      pending,
      excused,
      paid
    };
  };

  const handleCompleteEvent = async () => {
    if (!event || !eventId) return;
    try {
      await updateAidEvent(eventId, {
        ...event,
        status: 'completed'
      });
      navigate('/aid-events');
    } catch (error) {
      console.error('Error completing event:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!eventId) return;
      try {
        const [fetchedEvent, fetchedFamilies] = await Promise.all([
          getAidEvent(eventId),
          getFamilies()
        ]);
        setEvent(fetchedEvent);
        setFamilies(fetchedFamilies);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !event?.type) return;

    const unsubscribe = subscribeToEventRecords(
      eventId,
      event.type as "distribution" | "collection",
      (updatedRecords) => {
        setRecords(updatedRecords);
      }
    );

    return () => unsubscribe();
  }, [eventId, event?.type]);

  if (loading || !event) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const completedRecords = records.filter(
    r => r.status === 'distributed' || r.status === 'paid'
  );
  const percentageComplete = (completedRecords.length / records.length) * 100;

  // For distribution events, calculate items distributed
  const itemsSummary = event.type === 'distribution' && event.items
    ? event.items.map(item => {
        const distributedCount = (records as Distribution[])
          .filter(r => r.status === 'distributed' && r.distributedItems)
          .reduce((sum, r) => {
            const matchingItem = r.distributedItems?.find(i => i.itemName === item.name);
            return sum + (matchingItem?.quantity || 0);
          }, 0);
        
        return {
          ...item,
          distributed: distributedCount,
          remaining: (item.quantity || 0) - distributedCount
        };
      })
    : [];

  const contributionMetrics = getContributionMetrics();

  return (
    <AnimatedPage>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)' }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
          {/* Header with back button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={() => navigate('/aid-events')}
                  sx={{
                    mr: 2,
                    color: '#0070c9',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': { backgroundColor: 'white' },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
              </motion.div>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    color: '#1d1d1f',
                  }}
                >
                  {event.name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#86868b' }}>
                  Event Summary
                </Typography>
              </Box>
            </Box>
            
            {/* Add Export PDF Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => setShowPDF(true)}
                startIcon={<FileDownloadIcon />}
                sx={{
                  bgcolor: '#0070c9',
                  '&:hover': { bgcolor: '#005ea3' },
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,112,201,0.2)',
                }}
              >
                Export PDF
              </Button>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {/* Progress Overview */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Overall Progress</Typography>
                  {event.status !== 'completed' && records.length > 0 && (
                    event.type === 'distribution' ?
                      completedRecords.length === records.length && (
                        <Button 
                          variant="contained" 
                          onClick={handleCompleteEvent}
                          sx={{ 
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            borderRadius: 2
                          }}
                        >
                          Complete Event
                        </Button>
                      )
                    :
                      // For collection events, check both completion and amount
                      records.every(r => r.status === 'paid' || r.status === 'excused') &&
                      contributionMetrics?.totalCollected >= (contributionMetrics?.totalExpected || 0) && (
                        <Button 
                          variant="contained" 
                          onClick={handleCompleteEvent}
                          sx={{ 
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                            borderRadius: 2
                          }}
                        >
                          Complete Event
                        </Button>
                      )
                  )}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentageComplete}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0070c9',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {completedRecords.length} of {records.length} families
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {percentageComplete.toFixed(1)}% Complete
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Collection Stats for collection events */}
            {event.type === 'collection' && contributionMetrics && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Collection Summary</Typography>
                  <Grid container spacing={3}>
                    {/* Metrics */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
                        <Paper 
                          elevation={0} 
                          sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}
                        >
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                            Amount per Family
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                            Rs. {event.targetAmount || 0}
                          </Typography>
                        </Paper>

                        <Paper 
                          elevation={0} 
                          sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}
                        >
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                            Total Expected
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                            Rs. {contributionMetrics.totalExpected}
                          </Typography>
                        </Paper>

                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 3, 
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                            Total Collected
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                            Rs. {contributionMetrics.totalCollected}
                          </Typography>
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              left: 0, 
                              right: 0, 
                              height: 4,
                              bgcolor: contributionMetrics.totalCollected >= contributionMetrics.totalExpected ? 'success.main' : 'warning.main'
                            }} 
                          />
                        </Paper>
                      </Box>

                      {/* Status Summary */}
                      <Box sx={{ mt: 3, display: 'flex', gap: 3 }}>
                        <Paper 
                          elevation={0} 
                          sx={{ p: 3, flex: 1, bgcolor: 'background.default', borderRadius: 2 }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Paid
                            </Typography>
                            <Typography variant="h6">
                              {contributionMetrics.paid} families
                            </Typography>
                          </Box>
                        </Paper>

                        <Paper 
                          elevation={0} 
                          sx={{ p: 3, flex: 1, bgcolor: 'background.default', borderRadius: 2 }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Excused
                            </Typography>
                            <Typography variant="h6">
                              {contributionMetrics.excused} families
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Items Distribution Status */}
            {event.type === 'distribution' && itemsSummary.length > 0 && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom>Items Distribution Status</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Total Quantity</TableCell>
                          <TableCell align="right">Distributed</TableCell>
                          <TableCell align="right">Remaining</TableCell>
                          <TableCell align="right">Progress</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemsSummary.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                            <TableCell align="right">{item.distributed} {item.unit}</TableCell>
                            <TableCell align="right">{item.remaining} {item.unit}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={(item.distributed / (item.quantity || 1)) * 100}
                                  sx={{
                                    width: 100,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#0070c9',
                                    },
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {((item.distributed / (item.quantity || 1)) * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Family</TableCell>
                        <TableCell>Status</TableCell>
                        {event.type === 'collection' && <TableCell align="right">Amount</TableCell>}
                        <TableCell align="right">Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.slice(0, 10).map((record) => {
                        const family = families.find(f => f.id === record.familyId);
                        if (!family) return null;

                        return (
                          <TableRow key={record.id}>
                            <TableCell>
                              {family.headOfFamily.firstName} {family.headOfFamily.lastName}
                              <Typography variant="caption" display="block" color="text.secondary">
                                #{family.homeId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={record.status}
                                size="small"
                                sx={{
                                  borderRadius: '8px',
                                  bgcolor:
                                    record.status === 'distributed' || record.status === 'paid'
                                      ? 'success.lighter'
                                      : record.status === 'skipped' || record.status === 'excused'
                                      ? 'warning.lighter'
                                      : 'info.lighter',
                                  color:
                                    record.status === 'distributed' || record.status === 'paid'
                                      ? 'success.main'
                                      : record.status === 'skipped' || record.status === 'excused'
                                      ? 'warning.main'
                                      : 'info.main',
                                }}
                              />
                            </TableCell>
                            {event.type === 'collection' && (
                              <TableCell align="right">
                                Rs. {(record as MonthlyContribution).amount || 0}
                              </TableCell>
                            )}
                            <TableCell align="right">
                              {record.updatedAt ? new Date(record.updatedAt).toLocaleTimeString() : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* PDF Preview Dialog */}
          <Dialog
            open={showPDF}
            onClose={() => setShowPDF(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                height: '90vh',
                maxHeight: '90vh',
                borderRadius: 3,
              }
            }}
          >
            <EventSummaryPDF
              event={event}
              records={records}
              families={families}
              contributionMetrics={contributionMetrics}
              itemsSummary={itemsSummary}
            />
          </Dialog>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default EventSummary;