import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, CardContent, TextField, IconButton, MenuItem } from '@mui/material';
import { Home, Edit, Save, Cancel } from '@mui/icons-material';
import { Family } from '../../types/types';

interface HouseholdInformationDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
}

const HouseholdInformationDetails: React.FC<HouseholdInformationDetailsProps> = ({ family, handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    homeId: family.homeId,
    address: family.address,
    income: family.income,
    landOwnership: family.landOwnership,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    handleUpdate(editData);
    setIsEditing(false);
  };

  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <Typography variant="h6" className="font-medium text-gray-800">
          <Home className="mr-2 text-blue-500" sx={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />
          Household Information
        </Typography>
        {isEditing ? (
          <Box>
            <IconButton onClick={handleSave} sx={{ color: '#0070c9' }}>
              <Save />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} sx={{ color: '#ff3b30' }}>
              <Cancel />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={() => setIsEditing(true)} sx={{ color: '#0070c9' }}>
            <Edit />
          </IconButton>
        )}
      </Box>
      
      <CardContent className="p-6">
        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Home ID"
                name="homeId"
                variant="outlined"
                fullWidth
                value={editData.homeId}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                value={editData.address}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Income"
                name="income"
                variant="outlined"
                fullWidth
                value={editData.income}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Land Ownership"
                name="landOwnership"
                variant="outlined"
                fullWidth
                select
                value={editData.landOwnership}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: '8px' } }}
              >
                <MenuItem value="owned">Owned</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Home ID
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {family.homeId}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Land Ownership
                </Typography>
                <Typography variant="body1" className="font-medium capitalize">
                  {family.landOwnership || 'Not specified'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Address
                </Typography>
                <Typography variant="body1">
                  {family.address || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            {family.income && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography variant="subtitle2" className="text-gray-500 mb-1">
                    Monthly Income
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {family.income}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Family Size
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {1 + (family.spouse ? 1 : 0) + family.children.length + (family.otherMembers?.length || 0)} members
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Paper>
  );
};

export default HouseholdInformationDetails;