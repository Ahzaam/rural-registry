import React from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@mui/material';
import { Family } from '../../types/types';

interface HeadOfFamilyProps {
  family: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
}

const HeadOfFamily: React.FC<HeadOfFamilyProps> = ({ family, handleChange }) => {
  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h6" className="font-medium text-gray-800">
          Head of Family
        </Typography>
      </Box>
      <Box className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="headOfFamily.firstName"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.firstName}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="headOfFamily.lastName"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.lastName}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="NIC"
              name="headOfFamily.nic"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.nic}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date of Birth"
              name="headOfFamily.dateOfBirth"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              value={family.headOfFamily.dateOfBirth}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="head-gender-label">Gender</InputLabel>
              <Select
                labelId="head-gender-label"
                name="headOfFamily.gender"
                value={family.headOfFamily.gender}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Gender"
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Occupation"
              name="headOfFamily.occupation"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.occupation}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Work Location"
              name="headOfFamily.workLocation"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.workLocation}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Education"
              name="headOfFamily.education"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.education}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Contact"
              name="headOfFamily.contact"
              variant="outlined"
              fullWidth
              value={family.headOfFamily.contact}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default HeadOfFamily;
