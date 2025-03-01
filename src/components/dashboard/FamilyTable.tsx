import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Family } from '../../types/types';

interface FamilyTableProps {
  families: Family[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families, onDelete, deletingId }) => {
  const navigate = useNavigate();

  // Animation variants for table rows
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  if (families.length === 0) {
    return (
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ 
          textAlign: 'center',
          py: 8,
          color: '#86868b',
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        }}
      >
        <Typography>No families found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ 
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: '#1d1d1f',
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              py: 3
            }}>Household</TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: '#1d1d1f',
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              py: 3
            }}>Head of Family</TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: '#1d1d1f',
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              py: 3
            }}>Location & Contact</TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: '#1d1d1f',
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              py: 3
            }}>Family Composition</TableCell>
            <TableCell sx={{ 
              fontWeight: 600, 
              color: '#1d1d1f',
              fontSize: '0.95rem',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              py: 3
            }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {families.map((family, index) => (
              <motion.tr
                key={family.id}
                custom={index}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                style={{ 
                  position: 'relative',
                  backgroundColor: deletingId === family.id ? 'rgba(255, 59, 48, 0.05)' : 'transparent' 
                }}
                whileHover={{ 
                  backgroundColor: deletingId === family.id ? 'rgba(255, 59, 48, 0.05)' : 'rgba(0, 112, 201, 0.04)'
                }}
              >
                <TableCell sx={{ py: 2.5 }}>
                  <Box>
                    <Typography sx={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#0070c9',
                      mb: 0.5
                    }}>
                      #{family.homeId}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem',
                      color: '#86868b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <Box 
                        component={motion.span}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: family.landOwnership === 'owned' ? '#34c759' : '#ff9f0a',
                          display: 'inline-block'
                        }} 
                      />
                      {family.landOwnership === 'owned' ? 'Owner' : 'Tenant'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {`${family.headOfFamily.firstName} ${family.headOfFamily.lastName}`}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#86868b' }}>
                      {family.headOfFamily.occupation || 'No occupation listed'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
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
                </TableCell>
                <TableCell sx={{ py: 2.5 }}>
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
                </TableCell>
                <TableCell>
                  {deletingId === family.id ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress size={24} sx={{ color: '#ff3b30' }} />
                    </Box>
                  ) : (
                    <Box 
                      className="action-buttons"
                      component={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (index * 0.05) + 0.3 }}
                      sx={{ 
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: 'inline-block' }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/families/${family.id}`)}
                          sx={{ 
                            color: '#0070c9',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 112, 201, 0.1)'
                            },
                            mr: 1
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: 'inline-block' }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => onDelete(family.id)}
                          disabled={!!deletingId}
                          sx={{ 
                            color: '#ff3b30',
                            '&:hover': { 
                              backgroundColor: 'rgba(255, 59, 48, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </motion.div>
                    </Box>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FamilyTable;