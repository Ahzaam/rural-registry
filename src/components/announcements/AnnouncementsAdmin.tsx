// filepath: f:\PROGRAMMING\JavaScript\rural-registry\src\components\announcements\AnnouncementsAdmin.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  CircularProgress,
  useTheme,
  Tooltip,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
// Removed date-fns import
import { getAllAnnouncements, deleteAnnouncement } from '../../services/announcementService';
import { Announcement } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import AnnouncementForm from './AnnouncementForm';
import { getFeatureFlags, updateFeatureFlags } from '../../services/featureFlagService';
import { Navigate } from 'react-router-dom';

// Helper function to format dates without date-fns
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const AnnouncementsAdmin: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const theme = useTheme();
  const { currentUser, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableLandingPage, setEnableLandingPage] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Add redirect if not authenticated
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const flags = await getFeatureFlags();
        setEnableLandingPage(flags.enableLandingPage);
      } catch (error) {
        console.error('Error loading feature flags:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load settings',
          severity: 'error'
        });
      }
    };

    loadFeatureFlags();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteAnnouncement(deleteId);
      setAnnouncements(announcements.filter(a => a.id !== deleteId));
      handleCloseDialog();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete the announcement.');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingAnnouncement(null);
    fetchAnnouncements();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general':
        return theme.palette.info.main;
      case 'event':
        return theme.palette.success.main;
      case 'prayer':
        return theme.palette.primary.main;
      case 'eid':
        return theme.palette.secondary.main;
      case 'ramadan':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleFeatureFlagChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    try {
      await updateFeatureFlags({ enableLandingPage: newValue });
      setEnableLandingPage(newValue);
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating feature flags:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update settings',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Announcements
        </Typography>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setOpenForm(true)}
            sx={{
              boxShadow: 3
            }}
          >
            <AddIcon />
          </Fab>
        </motion.div>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={enableLandingPage}
              onChange={handleFeatureFlagChange}
              color="primary"
            />
          }
          label="Enable Landing Page"
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TableContainer component={Paper} sx={{ 
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: 3,
          }}>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Visibility Period</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography sx={{ py: 2 }}>No announcements found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => {
                    const isActive = announcement.isActive && 
                      new Date(announcement.visibleFrom) <= new Date() && 
                      new Date(announcement.visibleUntil) >= new Date();
                    
                    return (
                      <TableRow 
                        key={announcement.id}
                        sx={{ 
                          '&:hover': { bgcolor: theme.palette.action.hover },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {announcement.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            size="small"
                            sx={{ 
                              bgcolor: `${getTypeColor(announcement.type)}20`, 
                              color: getTypeColor(announcement.type),
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={announcement.priority.toUpperCase()}
                            size="small"
                            sx={{ 
                              bgcolor: `${getPriorityColor(announcement.priority)}20`, 
                              color: getPriorityColor(announcement.priority),
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {/* Using our custom format function instead of date-fns */}
                            {formatDate(new Date(announcement.visibleFrom))} - {formatDate(new Date(announcement.visibleUntil))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={isActive ? 'Active' : 'Inactive'}
                            color={isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {/* Using our custom format function instead of date-fns */}
                            {formatDate(new Date(announcement.createdAt))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="Preview">
                              <IconButton 
                                size="small" 
                                color="info"
                                href={`/announcements/${announcement.id}`} 
                                target="_blank"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(announcement)} 
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleOpenDelete(announcement.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            boxShadow: 24
          }
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 28 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: 28 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Announcement Form Dialog */}
      <AnnouncementForm
        open={openForm}
        onClose={handleFormClose}
        announcement={editingAnnouncement}
        userId={currentUser?.uid || ''}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AnnouncementsAdmin;