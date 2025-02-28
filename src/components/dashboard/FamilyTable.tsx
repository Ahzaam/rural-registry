import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Family } from '../../types/types';

interface FamilyTableProps {
  families: Family[];
  onDelete: (id: string) => void;
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families, onDelete }) => {
  const navigate = useNavigate();

  if (families.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center',
          py: 8,
          color: '#86868b'
        }}
      >
        <Typography>No families found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
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
          {families.map((family) => (
            <TableRow 
              key={family.id} 
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(0, 112, 201, 0.04)',
                  '& .action-buttons': {
                    opacity: 1
                  }
                },
                transition: 'background-color 0.2s ease'
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
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: family.landOwnership === 'owned' ? '#34c759' : '#ff9f0a',
                      display: 'inline-block'
                    }} />
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
                  {family.children.length > 0 && (
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
                  )}
                  {family.otherMembers && family.otherMembers.length > 0 && (
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
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  className="action-buttons"
                  sx={{ 
                    opacity: { xs: 1, md: 0 },
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/families/${family.id}`)}
                    sx={{ 
                      color: '#0070c9',
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 112, 201, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease',
                      mr: 1
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(family.id)}
                    sx={{ 
                      color: '#ff3b30',
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FamilyTable;