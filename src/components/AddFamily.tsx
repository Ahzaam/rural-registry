import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Paper, 
  Divider,
  Collapse,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addFamily } from "../services/familyService";
import { Family } from "../types/types";
import { ArrowBack } from "@mui/icons-material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HouseholdInformation from "./add-family/HouseholdInformation";
import HeadOfFamily from "./add-family/HeadOfFamily";
import Spouse from "./add-family/Spouse";
import Children from "./add-family/Children";
import OtherMembers from "./add-family/OtherMembers";
import DocumentUploader from "./add-family/DocumentUploader";
import { Person } from "../types/types";

const AddFamily: React.FC = () => {
  const [family, setFamily] = useState<Omit<Family, "id" | "createdAt" | "updatedAt">>({
    homeId: "",
    address: "",
    headOfFamily: {
      id: "",
      firstName: "",
      lastName: "",
      nic: "",
      dateOfBirth: "",
      gender: "male",
      occupation: "",
      workLocation: "",
      education: "",
      contact: "",
    },
    spouse: {
      id: "",
      firstName: "",
      lastName: "",
      nic: "",
      dateOfBirth: "",
      gender: "female",
      occupation: "",
      workLocation: "",
      education: "",
      contact: "",
    },
    children: [],
    otherMembers: [],
    income: "",
    landOwnership: "owned",
  });
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    const keys = name.split(".");
    if (keys.length === 1) {
      setFamily({ ...family, [name]: value });
    } else if (keys.length === 3) {
      const [arrayName, index, field] = keys;
      const arrayToUpdate = [...(((family[arrayName as keyof typeof family] || []) as Family[keyof Family][]) ?? [])];
      if (arrayToUpdate && arrayToUpdate[parseInt(index)]) {
        (arrayToUpdate as Person[])[parseInt(index)][field] = value as string;
      }
      setFamily({ ...family, [arrayName]: arrayToUpdate });
    } else {
      setFamily({
        ...family,
        [keys[0]]: {
          ...(family[keys[0] as keyof typeof family] as object),
          [keys[1]]: value,
        },
      });
    }
  };

  const handleDataExtracted = (extractedData: Partial<Family>) => {
    // Merge extracted data with the current family data
    const updatedFamily = { ...family };
    
    // Update simple fields
    if (extractedData.homeId) updatedFamily.homeId = extractedData.homeId;
    if (extractedData.address) updatedFamily.address = extractedData.address;
    if (extractedData.income) updatedFamily.income = extractedData.income;
    if (extractedData.landOwnership) updatedFamily.landOwnership = extractedData.landOwnership;
    
    // Update head of family if data exists
    if (extractedData.headOfFamily) {
      updatedFamily.headOfFamily = {
        ...updatedFamily.headOfFamily,
        ...extractedData.headOfFamily
      };
    }
    
    // Update spouse if data exists
    if (extractedData.spouse) {
      updatedFamily.spouse = {
        ...updatedFamily.spouse,
        ...extractedData.spouse
      };
    }
    
    // Update children if data exists
    if (extractedData.children && extractedData.children.length > 0) {
      updatedFamily.children = extractedData.children;
    }
    
    // Update other members if data exists
    if (extractedData.otherMembers && extractedData.otherMembers.length > 0) {
      updatedFamily.otherMembers = extractedData.otherMembers;
    }
    
    setFamily(updatedFamily);
    // Auto-collapse the uploader after successful extraction
    setShowUploader(false);
  };

  const handleAddChild = () => {
    setFamily({
      ...family,
      children: [
        ...family.children,
        {
          id: "",
          firstName: "",
          lastName: "",
          nic: "",
          dateOfBirth: "",
          gender: "male",
          school: "",
          grade: "",
        },
      ],
    });
  };

  const handleRemoveChild = (index: number) => {
    const newChildren = [...family.children];
    newChildren.splice(index, 1);
    setFamily({ ...family, children: newChildren });
  };

  const handleAddOtherMember = () => {
    setFamily({
      ...family,
      otherMembers: [
        ...(family.otherMembers || []),
        {
          id: "",
          firstName: "",
          lastName: "",
          nic: "",
          dateOfBirth: "",
          gender: "male",
          relationship: "",
        },
      ],
    });
  };

  const handleRemoveOtherMember = (index: number) => {
    const newOtherMembers = [...(family.otherMembers || [])];
    newOtherMembers.splice(index, 1);
    setFamily({ ...family, otherMembers: newOtherMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addFamily(family);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding family:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8 flex items-center justify-between">
        <Box className="flex items-center">
          <IconButton onClick={() => navigate("/dashboard")} className="mr-4" sx={{ color: "#0070c9" }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" className="font-medium text-gray-900">
            Add New Family
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/batch-create")}
          sx={{
            borderColor: "#0070c9",
            color: "#0070c9",
            borderRadius: "8px",
            "&:hover": {
              borderColor: "#005ea3",
              backgroundColor: "rgba(0, 112, 201, 0.04)",
            },
          }}
        >
          Batch Create
        </Button>
      </Box>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Paper sx={{ p: 3, mb: 3 }}>
          <Button
            onClick={() => setShowUploader(!showUploader)}
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<UploadFileIcon />}
            endIcon={showUploader ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ 
              justifyContent: 'space-between',
              mb: showUploader ? 2 : 0
            }}
          >
            <Stack direction="column" alignItems="flex-start" spacing={0}>
              <Typography variant="subtitle1">Auto-fill Form from Document</Typography>
              <Typography variant="body2" color="text.secondary">
                {showUploader 
                  ? "Hide document uploader" 
                  : "Upload a document to automatically extract family information"}
              </Typography>
            </Stack>
          </Button>
          
          <Collapse in={showUploader}>
            <Box sx={{ mt: 2 }}>
              <DocumentUploader onDataExtracted={handleDataExtracted} />
            </Box>
          </Collapse>
        </Paper>

        <HouseholdInformation family={family} handleChange={handleChange} />
        <HeadOfFamily family={family} handleChange={handleChange} />
        <Spouse family={family} handleChange={handleChange} />
        <Children
          family={family}
          handleChange={handleChange}
          handleAddChild={handleAddChild}
          handleRemoveChild={handleRemoveChild}
        />
        <OtherMembers
          family={family}
          handleChange={handleChange}
          handleAddOtherMember={handleAddOtherMember}
          handleRemoveOtherMember={handleRemoveOtherMember}
        />

        <Box className="flex justify-end pt-8 mt-8 border-t border-gray-200">
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{
              mr: 2,
              color: "#0070c9",
              borderColor: "#0070c9",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#005ea3",
                backgroundColor: "rgba(0, 112, 201, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#0070c9",
              borderRadius: "8px",
              boxShadow: "none",
              px: 6,
              "&:hover": {
                bgcolor: "#005ea3",
                boxShadow: "none",
              },
            }}
          >
            Save Family
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddFamily;
