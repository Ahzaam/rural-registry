import React from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Family } from '../../types/types';

interface ChildrenProps {
  family: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  handleAddChild: () => void;
  handleRemoveChild: (index: number) => void;
}

const Children: React.FC<ChildrenProps> = ({ family, handleChange, handleAddChild, handleRemoveChild }) => {
  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <Typography variant="h6" className="font-medium text-gray-800">
          School Children
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddChild}
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
          Add School Child
        </Button>
      </Box>
      <Box className="p-6">
        {family.children.length === 0 ? (
          <Typography className="text-center text-gray-500 py-4">
            No school children added yet
          </Typography>
        ) : (
          family.children.map((child, index) => (
            <Box key={index} className="mb-8 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  School Child {index + 1}
                </Typography>
                <IconButton 
                  onClick={() => handleRemoveChild(index)}
                  size="small"
                  sx={{ color: '#ff3b30' }}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name={`children.${index}.firstName`}
                    variant="outlined"
                    fullWidth
                    value={child.firstName}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name={`children.${index}.lastName`}
                    variant="outlined"
                    fullWidth
                    value={child.lastName}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    name={`children.${index}.dateOfBirth`}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    value={child.dateOfBirth}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`child-${index}-gender-label`}>Gender</InputLabel>
                    <Select
                      labelId={`child-${index}-gender-label`}
                      name={`children.${index}.gender`}
                      value={child.gender}
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
                    label="School"
                    name={`children.${index}.school`}
                    variant="outlined"
                    fullWidth
                    value={child.school || ''}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Grade"
                    name={`children.${index}.grade`}
                    variant="outlined"
                    fullWidth
                    value={child.grade}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default Children;
