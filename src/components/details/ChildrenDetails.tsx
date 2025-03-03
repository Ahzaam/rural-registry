import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, CardContent, TextField, MenuItem, Chip, Button } from '@mui/material';
import { People, School, Add as AddIcon } from '@mui/icons-material';
import { Family } from '../../types/types';
import { formatDate } from '../../utils/dateUtils';

interface ChildrenDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
}

const ChildrenDetails: React.FC<ChildrenDetailsProps> = ({ family, handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(family.children);

  const memberId = new URLSearchParams(window.location.search).get('memberId');

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedChildren = [...editData];
    updatedChildren[index] = { ...updatedChildren[index], [name]: value };
    setEditData(updatedChildren);
  };

  const handleSave = () => {
    handleUpdate({ children: editData });
    setIsEditing(false);
  };

  const handleAddChild = () => {
    const newChild = { 
      id: '', 
      firstName: '', 
      lastName: '', 
      nic: '', 
      dateOfBirth: '', 
      gender: 'male' as 'male' | 'female' | 'other', 
      school: '', 
      grade: '' 
    };
    setEditData([...editData, newChild]);
  };

  if (!family.children || family.children.length === 0) {
    return (
        <Paper
           elevation={0}
           className={
             (memberId === family.headOfFamily.id ? " border-yellow-400 " : " ") +
             "overflow-hidden rounded-xl border border-gray-200"
           }
         >
           <Box
             className={
               (memberId === family.headOfFamily.id ? " bg-yellow-200 " : " ") +
               "px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
             }
           >
          <Typography variant="h6" className="font-medium text-gray-800">
            <People className="mr-2 text-blue-500" sx={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />
            School Children (0)
          </Typography>
          {isEditing && (
            <Box className="flex justify-center mt-2">
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
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <Typography variant="h6" className="font-medium text-gray-800">
          <People className="mr-2 text-blue-500" sx={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />
          School Children ({family.children.length})
        </Typography>
        {isEditing ? (
          <Box>
            <Button onClick={handleSave} sx={{ color: '#0070c9' }}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} sx={{ color: '#ff3b30' }}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Button onClick={() => setIsEditing(true)} sx={{ color: '#0070c9' }}>
            Edit
          </Button>
        )}
      </Box>
      
      <CardContent className="p-6">
        {family.children.map((child, index) => (
          <Box key={index} className={(memberId === child.id ? "border bg-yellow-100 p-3 rounded-2xl " : " ") +"mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"}>
            <Box className={ "flex justify-between items-center mb-4" }>
              <Typography variant="subtitle1" className="font-medium">
                School Child {index + 1}: {child.firstName} {child.lastName}
              </Typography>
              {child.school && (
                <Chip 
                  icon={<School fontSize="small" />} 
                  label={`${child.school}${child.grade ? ` - Grade ${child.grade}` : ''}`} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(0, 112, 201, 0.1)', 
                    color: '#0070c9',
                    '& .MuiChip-icon': { color: '#0070c9' }
                  }} 
                />
              )}
            </Box>
            
            {isEditing ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    value={editData[index].firstName}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={editData[index].lastName}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    value={editData[index].dateOfBirth}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Gender"
                    name="gender"
                    variant="outlined"
                    fullWidth
                    select
                    value={editData[index].gender}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="School"
                    name="school"
                    variant="outlined"
                    fullWidth
                    value={editData[index].school || ''}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Grade"
                    name="grade"
                    variant="outlined"
                    fullWidth
                    value={editData[index].grade}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {child.dateOfBirth && (
                  <Grid item xs={12} md={4}>
                    <Box className="mb-2">
                      <Typography variant="subtitle2" className="text-gray-500 mb-1">
                        Date of Birth
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(child.dateOfBirth)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12} md={4}>
                  <Box className="mb-2">
                    <Typography variant="subtitle2" className="text-gray-500 mb-1">
                      Gender
                    </Typography>
                    <Typography variant="body2" className="capitalize">
                      {child.gender}
                    </Typography>
                  </Box>
                </Grid>
                
                {child.nic && (
                  <Grid item xs={12} md={4}>
                    <Box className="mb-2">
                      <Typography variant="subtitle2" className="text-gray-500 mb-1">
                        NIC
                      </Typography>
                      <Typography variant="body2">
                        {child.nic}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        ))}
        {isEditing && (
          <Box className="flex justify-center mt-2">
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
        )}
      </CardContent>
    </Paper>
  );
};

export default ChildrenDetails;