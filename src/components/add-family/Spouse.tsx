import React from "react";
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from "@mui/material";
import { Family } from "../../types/types";

interface SpouseProps {
  family: Omit<Family, "id" | "createdAt" | "updatedAt">;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
}

const Spouse: React.FC<SpouseProps> = ({ family, handleChange }) => {
  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h6" className="font-medium text-gray-800">
          Spouse
        </Typography>
      </Box>
      <Box className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="spouse.firstName"
              variant="outlined"
              fullWidth
              value={family.spouse!.firstName}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="spouse.lastName"
              variant="outlined"
              fullWidth
              value={family.spouse!.lastName}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="NIC"
              name="spouse.nic"
              variant="outlined"
              fullWidth
              value={family.spouse!.nic}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date of Birth"
              name="spouse.dateOfBirth"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              value={family.spouse!.dateOfBirth}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="spouse-gender-label">Gender</InputLabel>
              <Select
                labelId="spouse-gender-label"
                name="spouse.gender"
                value={family.spouse!.gender}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                label="Gender"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Occupation"
              name="spouse.occupation"
              variant="outlined"
              fullWidth
              value={family.spouse!.occupation}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Work Location"
              name="spouse.workLocation"
              variant="outlined"
              fullWidth
              value={family.spouse!.workLocation}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Education"
              name="spouse.education"
              variant="outlined"
              fullWidth
              value={family.spouse!.education}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Contact"
              name="spouse.contact"
              variant="outlined"
              fullWidth
              value={family.spouse!.contact}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Spouse;
