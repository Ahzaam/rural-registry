import React from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Button,
  CardContent,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Family } from "../../types/types";

interface OtherMembersProps {
  family: Omit<Family, "id" | "createdAt" | "updatedAt">;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  handleAddOtherMember: () => void;
  handleRemoveOtherMember: (index: number) => void;
}

const OtherMembers: React.FC<OtherMembersProps> = ({ family, handleChange, handleAddOtherMember, handleRemoveOtherMember }) => {
  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <Typography variant="h6" className="font-medium text-gray-800">
          Extended Family Members
        </Typography>
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
          Add Family Member
        </Button>
      </Box>
      <CardContent className="p-6">
        {family.otherMembers?.length === 0 ? (
          <Typography className="text-center text-gray-500 py-4">No extended family members added yet</Typography>
        ) : (
          family.otherMembers?.map((member, index) => (
            <Box key={index} className="mb-8 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Family Member {index + 1}
                </Typography>
                <IconButton onClick={() => handleRemoveOtherMember(index)} size="small" sx={{ color: "#ff3b30" }}>
                  <RemoveIcon />
                </IconButton>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name={`otherMembers.${index}.firstName`}
                    variant="outlined"
                    fullWidth
                    value={member.firstName}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name={`otherMembers.${index}.lastName`}
                    variant="outlined"
                    fullWidth
                    value={member.lastName}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    name={`otherMembers.${index}.dateOfBirth`}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    value={member.dateOfBirth}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`member-${index}-gender-label`}>Gender</InputLabel>
                    <Select
                      labelId={`member-${index}-gender-label`}
                      name={`otherMembers.${index}.gender`}
                      value={member.gender}
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
                    label="NIC (if available)"
                    name={`otherMembers.${index}.nic`}
                    variant="outlined"
                    fullWidth
                    value={member.nic}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Relationship"
                    name={`otherMembers.${index}.relationship`}
                    variant="outlined"
                    fullWidth
                    value={member.relationship || ""}
                    onChange={handleChange}
                    InputProps={{ sx: { borderRadius: "8px" } }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))
        )}
        {family.otherMembers?.length === 0 && (
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
              Add Family Member
            </Button>
          </Box>
        )}
      </CardContent>
    </Paper>
  );
};

export default OtherMembers;
