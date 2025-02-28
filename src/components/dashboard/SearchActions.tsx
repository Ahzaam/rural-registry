import React from 'react';
import { Paper, Box, TextField, Stack, Button } from '@mui/material';
import { Add as AddIcon, QrCode as QrCodeIcon, Search as SearchIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

interface SearchActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchActions: React.FC<SearchActionsProps> = ({ searchTerm, onSearchChange }) => {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, md: 3 }, 
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}
    >
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2} 
        alignItems="stretch"
      >
        <Box sx={{ 
          position: 'relative',
          flex: 1
        }}>
          <SearchIcon sx={{ 
            position: 'absolute',
            left: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#86868b',
            ml: 1
          }} />
          <TextField
            placeholder="Search families..."
            variant="outlined"
            size="medium"
            fullWidth
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                pl: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#0070c9',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0070c9',
                }
              }
            }}
          />
        </Box>
        <Stack 
          direction={{ xs: 'row', md: 'row' }} 
          spacing={2} 
          sx={{ 
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={() => navigate('/scanner')}
            fullWidth
            sx={{ 
              borderRadius: '15px',
              borderColor: '#0070c9',
              color: '#0070c9',
              padding: '12px 24px',
              textTransform: 'none',
              fontWeight: 600,
              flex: { xs: 1, md: 'initial' },
              minWidth: { xs: 0, md: '120px' },
              '&:hover': { 
                borderColor: '#005ea3',
                backgroundColor: 'rgba(0, 112, 201, 0.04)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Scan QR
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            component={Link}
            to="/families/new"
            fullWidth
            sx={{ 
              borderRadius: '15px',
              backgroundColor: '#0070c9',
              padding: '12px 24px',
              textTransform: 'none',
              fontWeight: 600,
              flex: { xs: 1, md: 'initial' },
              minWidth: { xs: 0, md: '160px' },
              boxShadow: '0 4px 14px rgba(0, 112, 201, 0.25)',
              '&:hover': { 
                backgroundColor: '#005ea3',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 112, 201, 0.35)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Add New Family
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SearchActions;