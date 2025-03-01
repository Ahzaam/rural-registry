import React, { useState } from 'react';
import { Card, CardContent, Stack, Box, Typography, Divider, IconButton, CircularProgress } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, LocationOn as LocationIcon, People as PeopleIcon, 
  Delete as DeleteIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Family } from '../../types/types';
import AnimatedButton from '../common/AnimatedButton';

interface FamilyCardProps {
  family: Family;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const FamilyCard: React.FC<FamilyCardProps> = ({ family, onDelete, isDeleting = false }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <Card 
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      sx={{ 
        mb: 2,
        borderRadius: '16px',
        boxShadow: expanded 
          ? '0 8px 24px rgba(0,0,0,0.12)'
          : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: expanded ? '#ffffff' : '#fafafa',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 10,
              backdropFilter: 'blur(4px)'
            }}
          >
            <CircularProgress size={32} sx={{ color: '#ff3b30' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{ 
                  backgroundColor: 'rgba(0, 112, 201, 0.1)',
                  p: 1,
                  borderRadius: '12px'
                }}
              >
                <HomeIcon sx={{ color: '#0070c9', fontSize: '1.4rem' }} />
              </Box>
              <Box>
                <Typography sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#1d1d1f',
                  letterSpacing: '-0.01em'
                }}>
                  #{family.homeId}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Box 
                    component={motion.span} 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: family.landOwnership === 'owned' ? '#34c759' : '#ff9f0a'
                    }} 
                  />
                  <Typography sx={{ fontSize: '0.875rem', color: '#86868b', fontWeight: 500 }}>
                    {family.landOwnership === 'owned' ? 'Owner' : 'Tenant'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRightIcon sx={{ color: '#86868b' }} />
            </motion.div>
          </Box>

          {/* Head of Family */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(142, 142, 147, 0.1)',
                p: 1,
                borderRadius: '12px'
              }}
            >
              <PersonIcon sx={{ color: '#8e8e93', fontSize: '1.4rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500, color: '#1d1d1f' }}>
                {`${family.headOfFamily.firstName} ${family.headOfFamily.lastName}`}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#86868b', mt: 0.5 }}>
                {family.headOfFamily.occupation || 'No occupation listed'}
              </Typography>
            </Box>
          </Box>

          {/* Expandable Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <Stack spacing={2.5}>
                  <Divider sx={{ my: 1 }} />
                  
                  {/* Location & Contact */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box 
                      sx={{ 
                        backgroundColor: 'rgba(255, 159, 10, 0.1)',
                        p: 1,
                        borderRadius: '12px'
                      }}
                    >
                      <LocationIcon sx={{ color: '#ff9f0a', fontSize: '1.4rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.925rem', color: '#1d1d1f', lineHeight: 1.5 }}>
                        {family.address}
                      </Typography>
                      {family.headOfFamily.contact && (
                        <Typography sx={{ 
                          fontSize: '0.875rem', 
                          color: '#0070c9',
                          mt: 0.5,
                          fontWeight: 500
                        }}>
                          {family.headOfFamily.contact}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Family Composition */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box 
                      sx={{ 
                        backgroundColor: 'rgba(88, 86, 214, 0.1)',
                        p: 1,
                        borderRadius: '12px'
                      }}
                    >
                      <PeopleIcon sx={{ color: '#5856d6', fontSize: '1.4rem' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <motion.div whileHover={{ y: -2 }}>
                        <Box sx={{
                          backgroundColor: 'rgba(0, 112, 201, 0.1)',
                          color: '#0070c9',
                          borderRadius: '20px',
                          px: 2,
                          py: 0.75,
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}>
                          {1 + (family.spouse ? 1 : 0)} Adults
                        </Box>
                      </motion.div>
                      {family.children.length > 0 && (
                        <motion.div whileHover={{ y: -2 }}>
                          <Box sx={{
                            backgroundColor: 'rgba(88, 86, 214, 0.1)',
                            color: '#5856d6',
                            borderRadius: '20px',
                            px: 2,
                            py: 0.75,
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {family.children.length} Children
                          </Box>
                        </motion.div>
                      )}
                      {family.otherMembers && family.otherMembers.length > 0 && (
                        <motion.div whileHover={{ y: -2 }}>
                          <Box sx={{
                            backgroundColor: 'rgba(52, 199, 89, 0.1)',
                            color: '#34c759',
                            borderRadius: '20px',
                            px: 2,
                            py: 0.75,
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {family.otherMembers.length} Others
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1.5, 
                    mt: 1,
                    pt: 2,
                    borderTop: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <AnimatedButton
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/families/${family.id}`);
                      }}
                      sx={{ 
                        borderRadius: '12px',
                        backgroundColor: '#0070c9',
                        color: '#fff',
                        px: 3,
                        '&:hover': { 
                          backgroundColor: '#005ea3',
                        }
                      }}
                    >
                      View Details
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(family.id);
                      }}
                      disabled={isDeleting}
                      sx={{ 
                        borderRadius: '12px',
                        borderColor: '#ff3b30',
                        color: '#ff3b30',
                        px: 3,
                        '&:hover': { 
                          backgroundColor: 'rgba(255, 59, 48, 0.08)',
                          borderColor: '#ff2d55',
                        }
                      }}
                    >
                      Delete Family
                    </AnimatedButton>
                  </Box>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FamilyCard;