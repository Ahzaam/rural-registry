import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Chip, CircularProgress, useTheme, alpha, Paper, AppBar, Toolbar, useMediaQuery, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { getActiveAnnouncements } from '../../services/announcementService';
import { getFeatureFlags } from '../../services/featureFlagService';
import { Announcement } from '../../types/types';
import LoginIcon from '@mui/icons-material/Login';
import { Link as RouterLink, Navigate } from 'react-router-dom';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Helper function to format dates without date-fns
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState<boolean | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const flags = await getFeatureFlags();
        console.log(flags);
        if (!flags.enableLandingPage) {
          setShouldRedirect(true);
          return;
        }
        setShouldRedirect(false);
        loadAnnouncements();
      } catch (err) {
        console.error('Error checking feature flags:', err);
        setError('Failed to load. Please try again later.');
        setLoading(false);
      }
    };

    const loadAnnouncements = async () => {
      try {
        const data = await getActiveAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error loading announcements:', err);
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };

    checkFeatureFlag();
  }, []);

  // Show loading state while checking feature flag
  if (shouldRedirect === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 15, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" size={40} thickness={4} />
      </Container>
    );
  }

  // Immediate redirect if feature flag is disabled
  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'general':
        return 'General';
      case 'event':
        return 'Event';
      case 'prayer':
        return 'Prayer';
      case 'eid':
        return 'Eid';
      case 'ramadan':
        return 'Ramadan';
      default:
        return 'Announcement';
    }
  };

  // Modern Apple-style header
  const renderHeader = () => (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid',
        borderColor: alpha('#000', 0.1),
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                mr: 2
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'medium' }}>
                MM
              </Typography>
            </MotionBox>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ 
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.02em'
                }}
              >
                Masjidul Minhaj
              </Typography>
            </motion.div>
          </Box>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
              startIcon={<LoginIcon />}
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                px: 2,
                py: 0.75,
                fontWeight: 500,
                borderColor: alpha(theme.palette.primary.main, 0.6),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Admin Login
            </Button>
          </motion.div>
        </Toolbar>
      </Container>
    </AppBar>
  );

  if (loading) {
    return (
      <>
        {renderHeader()}
        <Container maxWidth="lg" sx={{ py: 15, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" size={40} thickness={4} />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        {renderHeader()}
        <Container maxWidth="lg" sx={{ py: 15, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: 500 }}>
            {error}
          </Typography>
        </Container>
      </>
    );
  }

  if (announcements.length === 0) {
    return (
      <>
        {renderHeader()}
        <Container maxWidth="lg" sx={{ py: 15, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: alpha(theme.palette.text.primary, 0.7) }}>
            No announcements available at this time.
          </Typography>
        </Container>
      </>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  const heroSection = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const featuredAnnouncement = announcements.find(a => a.priority === 'high');
  const regularAnnouncements = announcements.filter(a => a.priority !== 'high');

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#F5F5F7', // Apple's light background color
    }}>
      {renderHeader()}
      
      <Box component="main" sx={{ width: '100%', pt: 8 }}>
        {/* Hero Section - Apple Style */}
        <Box 
          sx={{ 
            py: { xs: 10, md: 12 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              variants={heroSection}
              initial="hidden"
              animate="show"
            >
              <Grid container spacing={5} alignItems="center">
                <Grid item xs={12} md={featuredAnnouncement ? 7 : 12} sx={{ zIndex: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Typography 
                      variant="h1" 
                      component="h1"
                      sx={{ 
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        fontWeight: 700,
                        mb: 1.5,
                        letterSpacing: '-0.025em',
                        color: '#1D1D1F', // Apple's dark text color
                        lineHeight: 1.1
                      }}
                    >
                      Welcome to <br/>Masjidul Minhaj
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ 
                        mb: 5, 
                        maxWidth: '600px',
                        fontWeight: 400,
                        opacity: 0.8,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        color: '#1D1D1F',
                        pr: 5
                      }}
                    >
                      Serving the community with faith, compassion, and unity through prayer, education, and aid.
                    </Typography>
                  </motion.div>
                  
                  {featuredAnnouncement && (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: { xs: 3, md: 4 }, 
                        borderRadius: 3,
                        backgroundColor: '#FFFFFF',
                        maxWidth: '600px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: getPriorityColor(featuredAnnouncement.priority) }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={getTypeText(featuredAnnouncement.type)} 
                          color="primary" 
                          size="small"
                          sx={{ 
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.main,
                            height: 24,
                            px: 0.5
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontWeight: 500 }}>
                          {formatDate(featuredAnnouncement.visibleFrom)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h5" component="h2" color="text.primary" sx={{ fontWeight: 600, mb: 2, letterSpacing: '-0.01em' }}>
                        {featuredAnnouncement.title}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {featuredAnnouncement.content}
                      </Typography>
                      
                      {featuredAnnouncement.linkUrl && (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          href={featuredAnnouncement.linkUrl}
                          sx={{ 
                            mt: 2,
                            borderRadius: 1,
                            py: 0.75,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 'none',
                              backgroundColor: alpha(theme.palette.primary.main, 0.9)
                            }
                          }}
                        >
                          {featuredAnnouncement.linkText || 'Learn More'}
                        </Button>
                      )}
                    </Paper>
                  )}
                </Grid>
                
                {!isMobile && featuredAnnouncement?.imageUrl && (
                  <Grid item xs={12} md={5}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    >
                      <Box 
                        component="img" 
                        src={featuredAnnouncement.imageUrl}
                        alt={featuredAnnouncement.title}
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          width: '100%',
                          height: 'auto',
                          borderRadius: 3,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          objectFit: 'cover',
                          aspectRatio: '4/3'
                        }}
                      />
                    </motion.div>
                  </Grid>
                )}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* Regular Announcements - Apple Style */}
        {regularAnnouncements.length > 0 && (
          <Box sx={{ 
            py: { xs: 6, md: 10 },
            backgroundColor: '#FFFFFF',
            borderRadius: { md: '40px 40px 0 0' },
            mt: { xs: 0, md: -4 },
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 -10px 40px rgba(0,0,0,0.05)'
          }}>
            <Container maxWidth="lg">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  component="h2" 
                  variant="h3" 
                  align="center"
                  sx={{ 
                    mb: { xs: 5, md: 6 }, 
                    fontWeight: 700,
                    color: '#1D1D1F',
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '1.75rem', md: '2.25rem' }
                  }}
                >
                  Latest News & Events
                </Typography>
              </motion.div>
              
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
              >
                <Grid container spacing={isTablet ? 2.5 : 3}>
                  {regularAnnouncements.map((announcement) => (
                    <Grid item key={announcement.id} xs={12} sm={6} md={4}>
                      <MotionCard
                        variants={item}
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          borderRadius: 3,
                          overflow: 'hidden',
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: alpha('#000', 0.06),
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                          },
                          position: 'relative'
                        }}
                      >
                        {announcement.imageUrl && (
                          <Box sx={{ position: 'relative', paddingTop: '66.67%' /* 3:2 aspect ratio */ }}>
                            <CardMedia
                              component="img"
                              image={announcement.imageUrl}
                              alt={announcement.title}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '100%',
                                background: `linear-gradient(to bottom, transparent 50%, ${alpha('#000', 0.5)} 100%)`,
                              }} 
                            />
                            <Chip
                              label={getTypeText(announcement.type)}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                bgcolor: alpha('#FFF', 0.85),
                                color: getPriorityColor(announcement.priority),
                                fontWeight: 500,
                                borderRadius: 1,
                                height: 24,
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        )}
                        
                        <CardContent sx={{ 
                          flexGrow: 1, 
                          p: 3,
                          pb: 2.5,
                          backgroundColor: '#FFFFFF'
                        }}>
                          {!announcement.imageUrl && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={getTypeText(announcement.type)} 
                                size="small"
                                sx={{ 
                                  borderRadius: 1,
                                  bgcolor: alpha(getPriorityColor(announcement.priority), 0.1),
                                  color: getPriorityColor(announcement.priority),
                                  fontWeight: 500,
                                  height: 24
                                }}
                              />
                            </Box>
                          )}
                          
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                            {formatDate(announcement.visibleFrom)}
                          </Typography>
                          
                          <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600, mt: 0.5, lineHeight: 1.3, letterSpacing: '-0.01em', fontSize: '1.1rem' }}>
                            {announcement.title}
                          </Typography>
                          
                          <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                            {announcement.content.length > 100 
                              ? `${announcement.content.substring(0, 100)}...` 
                              : announcement.content}
                          </Typography>
                          
                          {announcement.linkUrl && (
                            <Box sx={{ mt: 'auto' }}>
                              <Link
                                component="a"
                                href={announcement.linkUrl}
                                color="primary"
                                sx={{ 
                                  textDecoration: 'none',
                                  fontWeight: 500,
                                  fontSize: '0.875rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                {announcement.linkText || 'Learn More'}
                              </Link>
                            </Box>
                          )}
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Container>
          </Box>
        )}
      </Box>

      {/* Footer - Apple Style */}
      <Box 
        component="footer" 
        sx={{ 
          py: 5, 
          bgcolor: '#F5F5F7',
          borderTop: '0.5px solid',
          borderColor: alpha('#000', 0.1)
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.primary.main,
                    mr: 1.5
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                    MM
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
                  Masjidul Minhaj
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                Masjidul Minhaj is dedicated to serving the Muslim community through prayer, education, and charitable activities.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                Contact Us
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                123 Main Street<br />
                City, State 12345<br />
                Phone: (123) 456-7890<br />
                Email: contact@example.com
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                Quick Links
              </Typography>
              
              <Link component={RouterLink} to="/login" color="inherit" sx={{ display: 'block', mb: 1.5, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main }, fontSize: '0.9rem' }}>
                Admin Login
              </Link>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: '0.85rem' }}>
                © {new Date().getFullYear()} Masjidul Minhaj. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Branding */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 40, height: 40 }}>
            <svg width="40" height="40" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c6a55c" />
                  <stop offset="50%" stopColor="#f9d77f" />
                  <stop offset="100%" stopColor="#c6a55c" />
                </linearGradient>
              </defs>
              <path d="M350 250c0 55.23-44.77 100-100 100-55.23 0-100-44.77-100-100s44.77-100 100-100c30 0 56.79 13.43 75 34.58" 
                    stroke="url(#goldGradient)" 
                    stroke-width="24" 
                    fill="none" 
                    stroke-linecap="round"/>
              <line x1="295" y1="250" x2="350" y2="250" 
                    stroke="url(#goldGradient)" 
                    stroke-width="24" 
                    stroke-linecap="round"/>
            </svg>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#86868b',
                letterSpacing: '0.02em'
              }}
            >
              Powered by
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#1d1d1f',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}
            >
              Glide Ceylon
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              ml: 2,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'rgba(66, 133, 244, 0.1)'
            }}
          >
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjNDI4NWY0IiBkPSJNMjQgNGMtNy40NzMgMC0xMy41MjEgNi4wNDgtMTMuNTIxIDEzLjUyMSAwIDcuNDczIDYuMDQ4IDEzLjUyMSAxMy41MjEgMTMuNTIxIDcuNDczIDAgMTMuNTIxLTYuMDQ4IDEzLjUyMS0xMy41MjFDMzcuNTIxIDEwLjA0OCAzMS40NzMgNCAyNCA0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNCA5LjM3NWMzLjQyIDAgNi4yMzcgMi44MTcgNi4yMzcgNi4yMzdzLTIuODE3IDYuMjM3LTYuMjM3IDYuMjM3LTYuMjM3LTIuODE3LTYuMjM3LTYuMjM3UzIwLjU4IDkuMzc1IDI0IDkuMzc1eiIvPjwvc3ZnPg=="
              style={{ width: 14, height: 14 }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#4285f4',
                fontSize: '0.7rem',
                fontWeight: 500
              }}
            >
              Secured by Google Cloud
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Announcements;