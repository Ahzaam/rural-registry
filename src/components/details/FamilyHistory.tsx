import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Grid, Chip, IconButton, Container, CircularProgress } from '@mui/material';
import { Family, HomeHistory, PaymentRecord } from '../../types/types';
import { formatDate } from '../../utils/dateUtils';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getFamilyById } from '../../services/familyService';
import { ChevronLeft } from '@mui/icons-material';
import AnimatedPage from '../common/AnimatedPage';
import { Timestamp } from 'firebase/firestore';

const FamilyHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamily = async () => {
      if (id) {
        try {
          const familyData = await getFamilyById(id);
          setFamily(familyData);
        } catch (error) {
          console.error("Error fetching family details:", error);
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFamily();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!family) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">Family not found</Typography>
      </Box>
    );
  }

  const sortedHomeHistory = [...(family.homeHistory || [])].sort((a, b) => {
    const dateA = a.fromDate instanceof Timestamp ? a.fromDate.toDate() : a.fromDate;
    const dateB = b.fromDate instanceof Timestamp ? b.fromDate.toDate() : b.fromDate;
    return dateB.getTime() - dateA.getTime();
  });

  const sortedPaymentHistory = [...(family.paymentHistory || [])].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toDate() : a.date;
    const dateB = b.date instanceof Timestamp ? b.date.toDate() : b.date;
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <AnimatedPage>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)" }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => navigate(`/families/${family.id}`)}
                sx={{
                  mr: 2,
                  color: "#0070c9",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
            </motion.div>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.5rem", md: "2rem" },
                color: "#1d1d1f",
              }}
            >
              Family History
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#1d1d1f" }}>
              {family.headOfFamily.firstName} {family.headOfFamily.lastName}'s Family
            </Typography>
            <Typography variant="body1" sx={{ color: "#86868b" }}>
              Home ID: #{family.homeId}
            </Typography>
          </Box>

          {/* Home History Section */}
          <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200 mb-6">
            <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <Typography variant="h6" className="font-medium text-gray-800">
                Home History
              </Typography>
            </Box>
            <Box className="p-6">
              {sortedHomeHistory.length > 0 ? (
                <Grid container spacing={3}>
                  {sortedHomeHistory.map((history, index) => (
                    <Grid item xs={12} key={index}>
                      <Box 
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-100 rounded-lg"
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {history.address}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Chip 
                            label={history.landOwnership}
                            size="small"
                            color={history.landOwnership === 'owned' ? 'success' : 'primary'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(history.fromDate instanceof Timestamp ? history.fromDate.toDate() : history.fromDate)} - 
                            {history.toDate ? formatDate(history.toDate instanceof Timestamp ? history.toDate.toDate() : history.toDate) : 'Present'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" align="center">No home history available</Typography>
              )}
            </Box>
          </Paper>

          {/* Payment History Section */}
          <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
            <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <Typography variant="h6" className="font-medium text-gray-800">
                Payment History
              </Typography>
            </Box>
            <Box className="p-6">
              {sortedPaymentHistory.length > 0 ? (
                <Grid container spacing={3}>
                  {sortedPaymentHistory.map((payment, index) => (
                    <Grid item xs={12} key={index}>
                      <Box 
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-100 rounded-lg"
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {payment.eventName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                          <Chip 
                            label={payment.type}
                            size="small"
                            color={payment.type === 'distribution' ? 'info' : 'warning'}
                          />
                          <Chip 
                            label={payment.status}
                            size="small"
                            color={
                              payment.status === 'paid' || payment.status === 'distributed'
                                ? 'success'
                                : payment.status === 'excused'
                                ? 'warning'
                                : 'error'
                            }
                          />
                              {payment.amount !== undefined && payment.amount > 0 && (
                                <Typography variant="body2">
                                  Amount: Rs. {payment.amount}
                                </Typography>
                              )}
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(payment.date instanceof Timestamp ? payment.date.toDate() : payment.date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary" align="center">No payment history available</Typography>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default FamilyHistory;