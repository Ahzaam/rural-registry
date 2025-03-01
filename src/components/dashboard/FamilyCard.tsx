import React, { useState } from 'react';
import { Card, CardContent, Stack, Box, Typography, Button, Divider, Collapse, IconButton } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, LocationOn as LocationIcon, People as PeopleIcon, Delete as DeleteIcon, GridView as GridViewIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Family } from '../../types/types';

interface FamilyCardProps {
  family: Family;
  onDelete: (id: string) => void;
}

const FamilyCard: React.FC<FamilyCardProps> = ({ family, onDelete }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        '&:hover': { transform: 'translateY(-2px)' },
        transition: 'transform 0.2s ease'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Header - Always visible */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  <Box component="span" sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: family.landOwnership === 'owned' ? '#34c759' : '#ff9f0a'
                  }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#86868b' }}>
                    {family.landOwnership === 'owned' ? 'Owner' : 'Tenant'}
                  </Typography>
                </Box>
              </Box>
            </Box>
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
          <Collapse in={expanded} timeout="auto">
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
              </Box>
            </Stack>
          </Collapse>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <Button
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
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(family.id)}
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
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FamilyCard;