import React from 'react';
import { Box, Grid, TextField, MenuItem, Typography, Paper } from '@mui/material';
import { Family } from '../../types/types';

interface HouseholdInformationProps {
  family: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
}

const HouseholdInformation: React.FC<HouseholdInformationProps> = ({ family, handleChange }) => {
  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h6" className="font-medium text-gray-800">
          Household Information
        </Typography>
      </Box>
      <Box className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Home ID"
              name="homeId"
              variant="outlined"
              fullWidth
              value={family.homeId}
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
              value={family.address}
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
              value={family.income}
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
              value={family.landOwnership}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: '8px' } }}
            >
              <MenuItem value="owned">Owned</MenuItem>
              <MenuItem value="rented">Rented</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default HouseholdInformation;
