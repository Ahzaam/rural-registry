import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import { extractFamilyDataFromDocument, validateFileType } from '../services/documentUploadService';
import { Family } from '../types/types';

const MAX_FILES = 20; // Maximum files per request for mobile compatibility

const BatchCreate: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > MAX_FILES) {
      setError(`Please select a maximum of ${MAX_FILES} files at once`);
      return;
    }

    // Validate file types
    const invalidFiles = selectedFiles.filter(file => !validateFileType(file));
    if (invalidFiles.length > 0) {
      setError('Some files are not supported. Please upload only PDF or image files (JPG, PNG)');
      return;
    }

    setFiles(selectedFiles);
    setError(null);
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);
    setError(null);

    const processedFamilies: Omit<Family, "id" | "createdAt" | "updatedAt">[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const familyData = await extractFamilyDataFromDocument(file);
          processedFamilies.push(familyData);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          setError(`Error processing ${file.name}. Please try again or process this file individually.`);
        }
        setProgress(((i + 1) / files.length) * 100);
      }

      // Store processed families in session storage
      sessionStorage.setItem('batchFamilies', JSON.stringify(processedFamilies));
      
      // Navigate to review page
      navigate('/batch-review');
    } catch (error) {
      console.error('Batch processing error:', error);
      setError('An error occurred during batch processing. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8 flex items-center">
        <IconButton onClick={() => navigate(-1)} className="mr-4" sx={{ color: "#0070c9" }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" className="font-medium text-gray-900">
          Batch Create Families
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload Multiple Documents
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload up to {MAX_FILES} documents (PDF, JPG, or PNG) to process multiple families at once.
          Each document should contain information for one family.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <input
            accept="application/pdf,image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileSelect}
            disabled={processing}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              disabled={processing}
              sx={{
                borderColor: "#0070c9",
                color: "#0070c9",
                "&:hover": {
                  borderColor: "#005ea3",
                  backgroundColor: "rgba(0, 112, 201, 0.04)",
                },
              }}
            >
              Select Documents
            </Button>
          </label>
          {files.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </Typography>
          )}
        </Box>

        {processing && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Processing documents... {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        <Box className="flex justify-end space-x-3">
          <Button
            onClick={() => navigate(-1)}
            disabled={processing}
            sx={{
              color: "#0070c9",
              "&:hover": {
                backgroundColor: "rgba(0, 112, 201, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={processFiles}
            disabled={files.length === 0 || processing}
            variant="contained"
            sx={{
              bgcolor: "#0070c9",
              "&:hover": {
                bgcolor: "#005ea3",
              },
            }}
          >
            Process Documents
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BatchCreate;