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

interface SpouseDetailsProps {
  family: Family;
  handleUpdate: (updatedFamily: Partial<Family>) => void;
}

const SpouseDetails: React.FC<SpouseDetailsProps> = ({
  family,
  handleUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: family.spouse?.firstName || "",
    lastName: family.spouse?.lastName || "",
    nic: family.spouse?.nic || "",
    dateOfBirth: family.spouse?.dateOfBirth || "",
    gender: family.spouse?.gender || "female",
    occupation: family.spouse?.occupation || "",
    workLocation: family.spouse?.workLocation || "",
    education: family.spouse?.education || "",
    contact: family.spouse?.contact || "",
  });

  const memberId = new URLSearchParams(window.location.search).get("memberId");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    handleUpdate({
      spouse: { ...family.spouse, ...editData, id: family.spouse!.id },
    });
    setIsEditing(false);
  };

  if (!family.spouse || (!family.spouse.firstName && !family.spouse.lastName)) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      className={
        (memberId === family.spouse.id ? " border-yellow-400 " : " ") +
        "overflow-hidden rounded-xl border border-gray-200"
      }
    >
      <Box
        className={
          (memberId === family.spouse.id ? " bg-yellow-200 " : " ") +
          "px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
        }
      >
        <Typography variant="h6" className="font-medium text-gray-800">
          <Person
            className="mr-2 text-blue-500"
            sx={{ verticalAlign: "middle", fontSize: "1.2rem" }}
          />
          Spouse
        </Typography>
        {isEditing ? (
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
        )}
      </Box>

      <CardContent className="p-6">
        {isEditing ? (
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
                  {family.spouse.firstName} {family.spouse.lastName}
                </Typography>
              </Box>
            </Grid>

            {family.spouse.nic && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    NIC
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {family.spouse.nic}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.spouse.dateOfBirth && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(family.spouse.dateOfBirth)}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Box className="mb-4">
                <Typography variant="subtitle2" className="text-gray-500 mb-1">
                  Gender
                </Typography>
                <Typography variant="body1" className="capitalize">
                  {family.spouse.gender}
                </Typography>
              </Box>
            </Grid>

            {family.spouse.contact && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    {family.spouse.contact}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.spouse.occupation && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Occupation
                  </Typography>
                  <Typography variant="body1">
                    {family.spouse.occupation}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.spouse.workLocation && (
              <Grid item xs={12} md={6}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Work Location
                  </Typography>
                  <Typography variant="body1">
                    {family.spouse.workLocation}
                  </Typography>
                </Box>
              </Grid>
            )}

            {family.spouse.education && (
              <Grid item xs={12}>
                <Box className="mb-4">
                  <Typography
                    variant="subtitle2"
                    className="text-gray-500 mb-1"
                  >
                    Education
                  </Typography>
                  <Typography variant="body1">
                    {family.spouse.education}
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

export default SpouseDetails;
