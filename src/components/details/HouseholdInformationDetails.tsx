import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, IconButton, MenuItem, Paper, Button } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Family } from '../../types/types';
import { addHomeHistory } from '../../services/familyHistoryService';

interface HouseholdInformationDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
  readOnly?: boolean;
}

const HouseholdInformationDetails: React.FC<HouseholdInformationDetailsProps> = ({
  family,
  handleUpdate,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    homeId: family.homeId,
    address: family.address,
    income: family.income || '',
    landOwnership: family.landOwnership || 'owned'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    // If address or landOwnership changed, add to history
    if (editData.address !== family.address || editData.landOwnership !== family.landOwnership) {
      // Record current home details in history
      await addHomeHistory(family.id, {
        address: family.address,
        landOwnership: family.landOwnership || 'owned',
        fromDate: family.updatedAt || family.createdAt,
        toDate: new Date()
      });
    }

    handleUpdate({
      homeId: editData.homeId,
      address: editData.address,
      income: editData.income,
      landOwnership: editData.landOwnership
    });
    setIsEditing(false);
  };

  const memberId = new URLSearchParams(window.location.search).get("memberId");

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
          Household Information
        </Typography>
        {!readOnly && (
          <Box>
            {isEditing ? (
              <Box>
                <IconButton onClick={handleSave} size="small" sx={{ color: "#34c759", mr: 1 }}>
                  <SaveIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      homeId: family.homeId,
                      address: family.address,
                      income: family.income || '',
                      landOwnership: family.landOwnership || 'owned'
                    });
                  }}
                  size="small"
                  sx={{ color: "#ff3b30" }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton onClick={() => setIsEditing(true)} size="small" sx={{ color: "#0070c9" }}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
      <Box className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className="mb-4">
              <Typography variant="subtitle2" className="text-gray-500 mb-1">
                Home ID
              </Typography>
              {isEditing ? (
                <TextField
                  name="homeId"
                  variant="outlined"
                  fullWidth
                  value={editData.homeId}
                  onChange={handleChange}
                  InputProps={{ sx: { borderRadius: "8px" } }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#0070c9", fontWeight: 500 }}>
                  #{family.homeId}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="mb-4">
              <Typography variant="subtitle2" className="text-gray-500 mb-1">
                Address
              </Typography>
              {isEditing ? (
                <TextField
                  name="address"
                  variant="outlined"
                  fullWidth
                  value={editData.address}
                  onChange={handleChange}
                  InputProps={{ sx: { borderRadius: "8px" } }}
                />
              ) : (
                <Typography variant="body1">{family.address}</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="mb-4">
              <Typography variant="subtitle2" className="text-gray-500 mb-1">
                Monthly Income
              </Typography>
              {isEditing ? (
                <TextField
                  name="income"
                  variant="outlined"
                  fullWidth
                  value={editData.income}
                  onChange={handleChange}
                  InputProps={{ sx: { borderRadius: "8px" } }}
                />
              ) : (
                <Typography variant="body1">
                  {family.income ? `Rs. ${family.income}` : "-"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="mb-4">
              <Typography variant="subtitle2" className="text-gray-500 mb-1">
                Land Ownership
              </Typography>
              {isEditing ? (
                <TextField
                  select
                  name="landOwnership"
                  variant="outlined"
                  fullWidth
                  value={editData.landOwnership}
                  onChange={handleChange}
                  InputProps={{ sx: { borderRadius: "8px" } }}
                >
                  <MenuItem value="owned">Owned</MenuItem>
                  <MenuItem value="rented">Rented</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              ) : (
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {family.landOwnership || "-"}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default HouseholdInformationDetails;