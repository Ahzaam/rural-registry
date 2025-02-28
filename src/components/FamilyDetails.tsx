import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button, IconButton, Grid } from '@mui/material';
import { getFamilyById, updateFamily } from '../services/familyService';
import { Family } from '../types/types';
import { ArrowBack } from '@mui/icons-material';
import HouseholdInformationDetails from './details/HouseholdInformationDetails';
import HeadOfFamilyDetails from './details/HeadOfFamilyDetails';
import SpouseDetails from './details/SpouseDetails';
import ChildrenDetails from './details/ChildrenDetails';
import OtherMembersDetails from './details/OtherMembersDetails';
import QRCodeDisplay from './details/QRCodeDisplay';

const FamilyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamily = async () => {
      if (id) {
        try {
          const familyData = await getFamilyById(id);
          setFamily(familyData);
        } catch (error) {
          console.error('Error fetching family details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFamily();
  }, [id]);

  const handleUpdate = async (updatedFamily: Partial<Family>) => {
    if (family && family.id) {
      const newFamily = { ...family, ...updatedFamily };
      setFamily(newFamily);
      try {
        await updateFamily(family.id, updatedFamily);
      } catch (error) {
        console.error('Error updating family details:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress sx={{ color: '#0070c9' }} />
      </Box>
    );
  }

  if (!family) {
    return (
      <Container maxWidth="md" className="py-16">
        <Box className="text-center">
          <Typography variant="h4" component="h1" className="mb-4 text-gray-800">
            Family not found
          </Typography>
          <Typography className="mb-8 text-gray-600">
            The family you're looking for doesn't exist or may have been removed.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
            startIcon={<ArrowBack />}
            sx={{ 
              bgcolor: '#0070c9',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': { 
                bgcolor: '#005ea3',
                boxShadow: 'none'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8 flex items-center justify-between">
        <Box className="flex items-center">
          <IconButton 
            onClick={() => navigate('/dashboard')} 
            className="mr-4"
            sx={{ color: '#0070c9' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" className="font-medium text-gray-900">
            Family Details
          </Typography>
        </Box>
        <Button 
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ 
            color: '#0070c9', 
            borderColor: '#0070c9',
            borderRadius: '8px',
            '&:hover': {
              borderColor: '#005ea3',
              backgroundColor: 'rgba(0, 112, 201, 0.04)'
            }
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <div className="space-y-6">
            <HouseholdInformationDetails family={family} handleUpdate={handleUpdate} />
            <HeadOfFamilyDetails family={family} handleUpdate={handleUpdate} />
            <SpouseDetails family={family} handleUpdate={handleUpdate} />
            <ChildrenDetails family={family} handleUpdate={handleUpdate} />
            <OtherMembersDetails family={family} handleUpdate={handleUpdate} />
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: '24px' } }}>
            <QRCodeDisplay family={family} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FamilyDetails;
