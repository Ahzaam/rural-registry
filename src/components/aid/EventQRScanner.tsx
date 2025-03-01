/** @jsxImportSource react */
import { type FC, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { Close as CloseIcon } from '@mui/icons-material';
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

interface Props {
  onScan: (result: string) => void;
  onClose: () => void;
}

const EventQRScanner: FC<Props> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback((text:IDetectedBarcode[] ) => {
    if (text) {
      onScan(text[0].rawValue);
    }
  }, [onScan]);

  const handleError = useCallback((err: unknown) => {
    console.error(err);
    setError("Error accessing camera");
  }, []);

  return (
    <Box sx={{ p: 2, width: '100%', maxWidth: '500px' }}>
      <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Scan QR Code</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
           <Scanner 
             onScan={handleDecode} 
             onError={handleError} 
           
           />
      </Box>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default EventQRScanner;