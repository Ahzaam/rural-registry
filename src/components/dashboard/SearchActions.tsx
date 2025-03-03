import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Grid2,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Event as EventIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "../common/AnimatedButton";

interface SearchActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
}

const SearchActions: React.FC<SearchActionsProps> = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
}) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Show actions when searching, focusing, or hovering
  useEffect(() => {
    if (searchTerm || isFocused || isHovering) {
      setShowActions(true);
    } else {
      // Small delay to allow for moving mouse to the actions
      const timer = setTimeout(() => {
        if (!isHovering && !isFocused && !searchTerm) {
          setShowActions(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, isFocused, isHovering]);

  return (
    <Paper
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      elevation={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "24px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Stack spacing={2} width="100%">
        {/* Search Bar Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
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
            <SearchIcon
              sx={{ color: isFocused ? "#0070c9" : "#86868b" }}
            />
          </InputAdornment>
              ),
              endAdornment: (
          <InputAdornment position="end">
            <Stack direction="row" spacing={1} alignItems="center">
              {searchTerm && (
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
              )}
              <IconButton
                onClick={onFilterClick}
                size="small"
                sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            },
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Stack>
          </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          transition: "all 0.3s ease",
          boxShadow: isFocused
            ? "0 0 0 3px rgba(0, 112, 201, 0.2)"
            : "none",
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

          {/* Add Family button - always visible */}
          <Link
            to="/families/new"
            style={{
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <AnimatedButton
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
          borderRadius: "12px",
          backgroundColor: "#0070c9",
          padding: "8px 16px",
          fontWeight: 500,
          height: "100%",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0, 112, 201, 0.25)",
          "&:hover": {
            backgroundColor: "#005ea3",
            boxShadow: "0 4px 12px rgba(0, 112, 201, 0.35)",
          },
              }}
            >
              Family
            </AnimatedButton>
          </Link>
        </Box>

        {/* Additional Action Buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            width: "100%",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "flex-end",
            pt: 2,
          }}
              >
          {/* Scan and Events buttons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%", // Always take full width on all screen sizes
            }}
          >
          
          </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Paper>
  );
};

export default SearchActions;
