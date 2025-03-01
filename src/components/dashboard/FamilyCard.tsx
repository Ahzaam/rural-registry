import React, { useState } from 'react';
import { Card, CardContent, Stack, Box, Typography, Divider, Collapse, IconButton, CircularProgress } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, LocationOn as LocationIcon, People as PeopleIcon, Delete as DeleteIcon, GridView as GridViewIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
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
  
  // Animation for expanding/collapsing card content
  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <Card 
      component={motion.div}
      layout
      sx={{ 
        mb: 2,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s ease',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Deletion overlay */}
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
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
              backdropFilter: 'blur(2px)'
            }}
          >
            <CircularProgress size={32} sx={{ color: '#ff3b30' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Header - Always visible */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box 
              component={motion.div}
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <HomeIcon sx={{ color: '#0070c9', fontSize: '1.2rem' }} />
              <Box>
                <Typography sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#0070c9',
                }}>
                  #{family.homeId}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  <Typography sx={{ fontSize: '0.875rem', color: '#86868b' }}>
                    {family.landOwnership === 'owned' ? 'Owner' : 'Tenant'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <motion.div whileTap={{ rotate: expanded ? -180 : 180 }}>
              <IconButton 
                onClick={() => setExpanded(!expanded)}
                size="small"
                sx={{ 
                  ml: 1,
                  color: '#86868b',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </motion.div>
          </Box>

          {/* Head of Family - Always visible */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <PersonIcon sx={{ color: '#86868b', fontSize: '1.2rem' }} />
            <Box>
              <Typography sx={{ fontWeight: 500 }}>
                {`${family.headOfFamily.firstName} ${family.headOfFamily.lastName}`}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#86868b' }}>
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
                <Stack spacing={2}>
                  <Divider />
                  {/* Location & Contact */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationIcon sx={{ color: '#86868b', fontSize: '1.2rem' }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        {family.address}
                      </Typography>
                      {family.headOfFamily.contact && (
                        <Typography sx={{ 
                          fontSize: '0.875rem', 
                          color: '#0070c9',
                          mt: 0.5
                        }}>
                          {family.headOfFamily.contact}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Family Composition */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: '#86868b', fontSize: '1.2rem' }} />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <motion.div whileHover={{ y: -2 }}>
                        <Box sx={{
                          backgroundColor: 'rgba(0, 112, 201, 0.1)',
                          color: '#0070c9',
                          borderRadius: '20px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          Adults: {1 + (family.spouse ? 1 : 0)}
                        </Box>
                      </motion.div>
                      {family.children.length > 0 && (
                        <motion.div whileHover={{ y: -2 }}>
                          <Box sx={{
                            backgroundColor: 'rgba(88, 86, 214, 0.1)',
                            color: '#5856d6',
                            borderRadius: '20px',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            Children: {family.children.length}
                          </Box>
                        </motion.div>
                      )}
                      {family.otherMembers && family.otherMembers.length > 0 && (
                        <motion.div whileHover={{ y: -2 }}>
                          <Box sx={{
                            backgroundColor: 'rgba(52, 199, 89, 0.1)',
                            color: '#34c759',
                            borderRadius: '20px',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}>
                            Others: {family.otherMembers.length}
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <AnimatedButton
              variant="outlined"
              size="small"
              startIcon={<GridViewIcon />}
              onClick={() => navigate(`/families/${family.id}`)}
              sx={{ 
                borderRadius: '12px',
                borderColor: '#0070c9',
                color: '#0070c9',
                '&:hover': { 
                  borderColor: '#005ea3',
                  backgroundColor: 'rgba(0, 112, 201, 0.08)'
                }
              }}
            >
              View
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(family.id)}
              disabled={isDeleting}
              sx={{ 
                borderRadius: '12px',
                borderColor: '#ff3b30',
                color: '#ff3b30',
                '&:hover': { 
                  borderColor: '#ff2d55',
                  backgroundColor: 'rgba(255, 59, 48, 0.08)'
                }
              }}
            >
              Delete
            </AnimatedButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FamilyCard;