import React, { useState } from "react";
import { Paper, Box, TextField, Stack, InputAdornment } from "@mui/material";
import { Add as AddIcon, QrCode as QrCodeIcon, Search as SearchIcon, Clear as ClearIcon, Event as EventIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedButton from "../common/AnimatedButton";

interface SearchActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchActions: React.FC<SearchActionsProps> = ({ searchTerm, onSearchChange }) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Paper
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "24px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={2} 
        alignItems="center"
        width="100%"
      >
        <TextField
          placeholder="Search families..."
          variant="outlined"
          size="medium"
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: isFocused ? "#0070c9" : "#86868b" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ClearIcon
                    sx={{
                      cursor: "pointer",
                      color: "#86868b",
                      "&:hover": { color: "#ff3b30" },
                    }}
                    onClick={() => onSearchChange("")}
                  />
                </motion.div>
              </InputAdornment>
            ),
          }}
          sx={{
            flex: { xs: '1', md: '1' },  // Take remaining space
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              transition: "all 0.3s ease",
              boxShadow: isFocused ? "0 0 0 3px rgba(0, 112, 201, 0.2)" : "none",
              "& fieldset": {
                borderColor: isFocused ? "#0070c9" : "rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              },
              "&:hover fieldset": {
                borderColor: "#0070c9",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0070c9",
              },
            },
          }}
        />

        {/* Action buttons wrapper - column on mobile, row on desktop */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            width: { xs: '100%', md: 'auto' }, // Full width on mobile, auto on desktop
            alignItems: { xs: 'stretch', md: 'flex-end' }, // Stretch on mobile, right-align on desktop
          }}
        >
          {/* Scan and Events buttons - always in a row */}
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              width: { xs: '100%', md: 'auto' }, // Full width on mobile, auto on desktop
            }}
          >
            <Box sx={{ flex: 1 }}>
              <AnimatedButton
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => navigate('/scanner')}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#0070c9',
                  color: '#0070c9',
                  padding: '8px 16px',
                  fontWeight: 500,
                  width: '100%', // Full width of parent
                  '&:hover': {
                    borderColor: '#005ea3',
                    backgroundColor: 'rgba(0, 112, 201, 0.04)'
                  },
                }}
              >
                Scan
              </AnimatedButton>
            </Box>
            <Box sx={{ flex: 1 }}>
              <AnimatedButton
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={() => navigate('/aid-events')}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#0070c9',
                  color: '#0070c9',
                  padding: '8px 16px',
                  fontWeight: 500,
                  width: '100%', // Full width of parent
                  '&:hover': {
                    borderColor: '#005ea3',
                    backgroundColor: 'rgba(0, 112, 201, 0.04)'
                  },
                }}
              >
                Events
              </AnimatedButton>
            </Box>
          </Stack>
          
          {/* Family button */}
          <Link 
            to='/families/new'
            style={{ textDecoration: 'none', width: '100%' }}
          >
            <AnimatedButton
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '12px',
                backgroundColor: '#0070c9',
                padding: '8px 16px',
                fontWeight: 500,
                width: { xs: '100%', md: 'auto' },
                minWidth: { md: '120px' },
                boxShadow: '0 2px 8px rgba(0, 112, 201, 0.25)',
                '&:hover': {
                  backgroundColor: '#005ea3',
                  boxShadow: '0 4px 12px rgba(0, 112, 201, 0.35)',
                },
              }}
            >
              Family
            </AnimatedButton>
          </Link>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SearchActions;