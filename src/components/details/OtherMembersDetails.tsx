import React, { useState } from "react";
import { Box, Typography, Paper, Grid, CardContent, TextField, IconButton, MenuItem, Chip, Button } from "@mui/material";
import { People, Edit, Save, Cancel, Add as AddIcon } from "@mui/icons-material";
import { Family } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";

interface OtherMembersDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
}

const OtherMembersDetails: React.FC<OtherMembersDetailsProps> = ({ family, handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(family.otherMembers!);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedMembers = [...editData];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setEditData(updatedMembers);
  };

  const handleSave = () => {
    handleUpdate({ otherMembers: editData });
    setIsEditing(false);
  };

  const handleAddOtherMember = () => {
    console.log("Add Member button clicked");
    const newMember = {
      id: "",
      firstName: "",
      lastName: "",
      nic: "",
      dateOfBirth: "",
      gender: "male" as const,
      relationship: "",
    };
    setEditData([...editData, newMember]);
    console.log("New member added:", newMember);
    console.log("Updated editData:", editData);
  };

  if (!family.otherMembers || family.otherMembers.length === 0) {
    return (
      <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
        <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <Typography variant="h6" className="font-medium text-gray-800">
            <People className="mr-2 text-blue-500" sx={{ verticalAlign: "middle", fontSize: "1.2rem" }} />
            Other Members (0)
          </Typography>
          <Box className="flex justify-center mt-2">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddOtherMember}
              sx={{
                color: "#0070c9",
                borderColor: "#0070c9",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#005ea3",
                  backgroundColor: "rgba(0, 112, 201, 0.04)",
                },
              }}
            >
              Add Member
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <Typography variant="h6" className="font-medium text-gray-800">
          <People className="mr-2 text-blue-500" sx={{ verticalAlign: "middle", fontSize: "1.2rem" }} />
          Other Members ({family.otherMembers.length})
        </Typography>
        {isEditing ? (
          <Box>
            <IconButton onClick={handleSave} sx={{ color: "#0070c9" }}>
              <Save />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} sx={{ color: "#ff3b30" }}>
              <Cancel />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={() => setIsEditing(true)} sx={{ color: "#0070c9" }}>
            <Edit />
          </IconButton>
        )}
      </Box>

      <CardContent className="p-6">
        {family.otherMembers.map((member, index) => (
          <Box key={index} className="mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="subtitle1" className="font-medium">
                {member.firstName} {member.lastName}
              </Typography>
              {member.relationship && (
                <Chip
                  label={member.relationship}
                  size="small"
                  sx={{
                    bgcolor: "rgba(0, 112, 201, 0.1)",
                    color: "#0070c9",
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
                    InputProps={{ sx: { borderRadius: "8px" } }}
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
                    InputProps={{ sx: { borderRadius: "8px" } }}
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
                    InputProps={{ sx: { borderRadius: "8px" } }}
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
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="NIC (if available)"
                    name="nic"
                    variant="outlined"
                    fullWidth
                    value={editData[index].nic}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Relationship"
                    name="relationship"
                    variant="outlined"
                    fullWidth
                    value={editData[index].relationship || ""}
                    onChange={(e) => handleChange(index, e)}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {member.dateOfBirth && (
                  <Grid item xs={12} md={4}>
                    <Box className="mb-2">
                      <Typography variant="subtitle2" className="text-gray-500 mb-1">
                        Date of Birth
                      </Typography>
                      <Typography variant="body2">{formatDate(member.dateOfBirth)}</Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} md={4}>
                  <Box className="mb-2">
                    <Typography variant="subtitle2" className="text-gray-500 mb-1">
                      Gender
                    </Typography>
                    <Typography variant="body2" className="capitalize">
                      {member.gender}
                    </Typography>
                  </Box>
                </Grid>

                {member.nic && (
                  <Grid item xs={12} md={4}>
                    <Box className="mb-2">
                      <Typography variant="subtitle2" className="text-gray-500 mb-1">
                        NIC
                      </Typography>
                      <Typography variant="body2">{member.nic}</Typography>
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
              onClick={handleAddOtherMember}
              sx={{
                color: "#0070c9",
                borderColor: "#0070c9",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#005ea3",
                  backgroundColor: "rgba(0, 112, 201, 0.04)",
                },
              }}
            >
              Add Member
            </Button>
          </Box>
        )}
      </CardContent>
    </Paper>
  );
};

export default OtherMembersDetails;
