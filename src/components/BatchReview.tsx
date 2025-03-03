import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { addFamily } from '../services/familyService';
import { Family, Person } from '../types/types';
import HouseholdInformation from './add-family/HouseholdInformation';
import HeadOfFamily from './add-family/HeadOfFamily';
import Spouse from './add-family/Spouse';
import Children from './add-family/Children';
import OtherMembers from './add-family/OtherMembers';
import { motion } from 'framer-motion';

const BatchReview: React.FC = () => {
  const [families, setFamilies] = useState<Omit<Family, "id" | "createdAt" | "updatedAt">[]>([]);
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFamilies = sessionStorage.getItem('batchFamilies');
    if (!storedFamilies) {
      navigate('/batch-create');
      return;
    }
    setFamilies(JSON.parse(storedFamilies));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    const updatedFamily = { ...families[currentFamilyIndex] };
    const keys = name.split(".");
    
    if (keys.length === 1) {
      updatedFamily[name as keyof typeof updatedFamily] = value as never;
    } else if (keys.length === 3) {
      // Handle array fields (children, otherMembers)
      const [arrayName, index, field] = keys;
      
      if (arrayName === 'children') {
        const children = [...updatedFamily.children];
        children[parseInt(index)] = {
          ...children[parseInt(index)],
          [field]: value
        };
        updatedFamily.children = children;
      } else if (arrayName === 'otherMembers') {
        const otherMembers = [...(updatedFamily.otherMembers || [])];
        otherMembers[parseInt(index)] = {
          ...otherMembers[parseInt(index)],
          [field]: value
        };
        updatedFamily.otherMembers = otherMembers;
      }
    } else {
      // Handle nested objects (headOfFamily, spouse)
      const [objName, field] = keys;
      
      if (objName === 'headOfFamily') {
        const updatedHeadOfFamily = {
          ...updatedFamily.headOfFamily,
          [field]: value
        };
        updatedFamily.headOfFamily = updatedHeadOfFamily;
      } else if (objName === 'spouse') {
        const updatedSpouse = {
          ...updatedFamily.spouse,
          [field]: value
        } as Person;
        updatedFamily.spouse = updatedSpouse;
      }
    }

    const updatedFamilies = [...families];
    updatedFamilies[currentFamilyIndex] = updatedFamily;
    setFamilies(updatedFamilies);
    sessionStorage.setItem('batchFamilies', JSON.stringify(updatedFamilies));
  };

  const handleAddChild = () => {
    const updatedFamily = { ...families[currentFamilyIndex] };
    updatedFamily.children = [
      ...updatedFamily.children,
      {
        id: "",
        firstName: "",
        lastName: "",
        nic: "",
        dateOfBirth: "",
        gender: "male",
        school: "",
        grade: "",
      },
    ];
    const updatedFamilies = [...families];
    updatedFamilies[currentFamilyIndex] = updatedFamily;
    setFamilies(updatedFamilies);
    sessionStorage.setItem('batchFamilies', JSON.stringify(updatedFamilies));
  };

  const handleRemoveChild = (index: number) => {
    const updatedFamily = { ...families[currentFamilyIndex] };
    updatedFamily.children.splice(index, 1);
    const updatedFamilies = [...families];
    updatedFamilies[currentFamilyIndex] = updatedFamily;
    setFamilies(updatedFamilies);
    sessionStorage.setItem('batchFamilies', JSON.stringify(updatedFamilies));
  };

  const handleAddOtherMember = () => {
    const updatedFamily = { ...families[currentFamilyIndex] };
    updatedFamily.otherMembers = [
      ...(updatedFamily.otherMembers || []),
      {
        id: "",
        firstName: "",
        lastName: "",
        nic: "",
        dateOfBirth: "",
        gender: "male",
        relationship: "",
      },
    ];
    const updatedFamilies = [...families];
    updatedFamilies[currentFamilyIndex] = updatedFamily;
    setFamilies(updatedFamilies);
    sessionStorage.setItem('batchFamilies', JSON.stringify(updatedFamilies));
  };

  const handleRemoveOtherMember = (index: number) => {
    const updatedFamily = { ...families[currentFamilyIndex] };
    updatedFamily.otherMembers?.splice(index, 1);
    const updatedFamilies = [...families];
    updatedFamilies[currentFamilyIndex] = updatedFamily;
    setFamilies(updatedFamilies);
    sessionStorage.setItem('batchFamilies', JSON.stringify(updatedFamilies));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const currentFamily = families[currentFamilyIndex];
      await addFamily(currentFamily);
      
      // Move to next family or finish
      if (currentFamilyIndex < families.length - 1) {
        setCurrentFamilyIndex(currentFamilyIndex + 1);
      } else {
        // Clear session storage and redirect to dashboard
        sessionStorage.removeItem('batchFamilies');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving family:', error);
      setError('Failed to save family. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!families.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const currentFamily = families[currentFamilyIndex];

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8 flex items-center justify-between">
        <Box className="flex items-center">
          <IconButton onClick={() => navigate('/batch-create')} className="mr-4" sx={{ color: "#0070c9" }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" className="font-medium text-gray-900">
            Review Family {currentFamilyIndex + 1} of {families.length}
          </Typography>
        </Box>
      </Box>

      <Stepper activeStep={currentFamilyIndex} sx={{ mb: 4 }}>
        {families.map((_, index) => (
          <Step key={index}>
            <StepLabel>Family {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3} component={motion.div} layout>
        <HouseholdInformation 
          family={currentFamily}
          handleChange={handleChange}
        />
        <HeadOfFamily
          family={currentFamily}
          handleChange={handleChange}
        />
        <Spouse
          family={currentFamily}
          handleChange={handleChange}
        />
        <Children
          family={currentFamily}
          handleChange={handleChange}
          handleAddChild={handleAddChild}
          handleRemoveChild={handleRemoveChild}
        />
        <OtherMembers
          family={currentFamily}
          handleChange={handleChange}
          handleAddOtherMember={handleAddOtherMember}
          handleRemoveOtherMember={handleRemoveOtherMember}
        />

        <Paper sx={{ p: 3 }}>
          <Box className="flex justify-end space-x-3">
            <Button
              onClick={() => navigate('/batch-create')}
              disabled={saving}
              sx={{
                color: "#0070c9",
                "&:hover": {
                  backgroundColor: "rgba(0, 112, 201, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="contained"
              sx={{
                bgcolor: "#0070c9",
                "&:hover": {
                  bgcolor: "#005ea3",
                },
              }}
            >
              {saving ? (
                <CircularProgress size={24} color="inherit" />
              ) : currentFamilyIndex === families.length - 1 ? (
                'Save and Finish'
              ) : (
                'Save and Next'
              )}
            </Button>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default BatchReview;