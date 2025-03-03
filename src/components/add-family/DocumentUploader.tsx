import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { styled } from '@mui/material/styles';
import { Family } from '../../types/types';
import { extractFamilyDataFromDocument, validateFileType } from '../../services/documentUploadService';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface DocumentUploaderProps {
  onDataExtracted: (data: Partial<Family>) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDataExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      if (!validateFileType(selectedFile)) {
        setError("Invalid file type. Please upload a PDF or image file (JPG, PNG).");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const extractedData = await extractFamilyDataFromDocument(file);
      setSuccess(true);
      onDataExtracted(extractedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to file
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File from the blob
          const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setFile(capturedFile);
          
          // Stop camera stream
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      padding: 3,
      border: '1px dashed',
      borderColor: 'grey.400',
      borderRadius: 1,
      bgcolor: 'grey.50'
    }}>
      <Typography variant="h6" component="h3">
        Upload Document for Auto-fill
      </Typography>
      
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Upload a PDF or image of family registration documents to auto-fill the form.
        <br />
        Supported languages: English, Tamil, Sinhala
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%' }}>Data extracted successfully!</Alert>}

      {showCamera ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '500px', position: 'relative', mb: 2 }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={capturePhoto}
              startIcon={<CameraAltIcon />}
            >
              Take Photo
            </Button>
            <Button 
              variant="outlined" 
              onClick={stopCamera}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Browse Files
            <VisuallyHiddenInput type="file" accept=".pdf,image/jpeg,image/png,image/jpg" onChange={handleFileChange} />
          </Button>

          <Button
            variant="outlined"
            startIcon={<CameraAltIcon />}
            onClick={startCamera}
          >
            Take Photo
          </Button>
        </Stack>
      )}

      {file && !showCamera && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected: {file.name}
        </Typography>
      )}

      {file && !showCamera && (
        <Button
          onClick={handleExtract}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DocumentScannerIcon />}
          sx={{ mt: 2 }}
        >
          {loading ? "Processing..." : "Extract Data"}
        </Button>
      )}
    </Box>
  );
};

export default DocumentUploader;