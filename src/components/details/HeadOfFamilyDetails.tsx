import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CardContent,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Person, Edit, Save, Cancel } from "@mui/icons-material";
import { Family } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";

interface HeadOfFamilyDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
  readOnly?: boolean;
}

const HeadOfFamilyDetails: React.FC<HeadOfFamilyDetailsProps> = ({
  family,
  handleUpdate,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: family.headOfFamily.firstName,
    lastName: family.headOfFamily.lastName,
    nic: family.headOfFamily.nic,
    dateOfBirth: family.headOfFamily.dateOfBirth,
    gender: family.headOfFamily.gender,
    occupation: family.headOfFamily.occupation,
    workLocation: family.headOfFamily.workLocation,
    education: family.headOfFamily.education,
    contact: family.headOfFamily.contact,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    handleUpdate({ headOfFamily: { ...family.headOfFamily, ...editData } });
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
          <Person
            className="mr-2 text-blue-500"
            sx={{ verticalAlign: "middle", fontSize: "1.2rem" }}
          />
          Head of Family
        </Typography>
        {!readOnly && (isEditing ? (
          <Box>
            <IconButton onClick={handleSave} sx={{ color: "#0070c9" }}>
              <Save />
            </IconButton>
            <IconButton
              onClick={() => setIsEditing(false)}
              sx={{ color: "#ff3b30" }}
            >
              <Cancel />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            onClick={() => setIsEditing(true)}
            sx={{ color: "#0070c9" }}
          >
            <Edit />
          </IconButton>
        ))}
      </Box>

      <CardContent className="p-6">
        {isEditing && !readOnly ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                variant="outlined"
                fullWidth
                value={editData.firstName}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                variant="outlined"
                fullWidth
                value={editData.lastName}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="NIC"
                name="nic"
                variant="outlined"
                fullWidth
                value={editData.nic}
                onChange={handleChange}
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
                value={editData.dateOfBirth}
                onChange={handleChange}
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
                value={editData.gender}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Occupation"
                name="occupation"
                variant="outlined"
                fullWidth
                value={editData.occupation}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Work Location"
                name="workLocation"
                variant="outlined"
                fullWidth
                value={editData.workLocation}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Education"
                name="education"
                variant="outlined"
                fullWidth
                value={editData.education}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact"
                name="contact"
                variant="outlined"
                fullWidth
                value={editData.contact}
                onChange={handleChange}
                InputProps={{ sx: { borderRadius: "8px" } }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Full Name
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {family.headOfFamily.firstName} {family.headOfFamily.lastName}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  NIC
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {family.headOfFamily.nic}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {formatDate(family.headOfFamily.dateOfBirth)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Gender
                </Typography>
                <Typography variant="body1" className="capitalize">
                  {family.headOfFamily.gender}
                </Typography>
              </Box>
            </Grid>

            {family.headOfFamily.contact && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    {family.headOfFamily.contact}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.headOfFamily.occupation && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Occupation
                  </Typography>
                  <Typography variant="body1">
                    {family.headOfFamily.occupation}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.headOfFamily.workLocation && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Work Location
                  </Typography>
                  <Typography variant="body1">
                    {family.headOfFamily.workLocation}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.headOfFamily.education && (
              <Grid item xs={12}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Education
                  </Typography>
                  <Typography variant="body1">
                    {family.headOfFamily.education}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </Paper>
  );
};

export default HeadOfFamilyDetails;
