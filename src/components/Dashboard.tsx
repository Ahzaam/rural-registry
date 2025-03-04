import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
  Skeleton,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
} from "@mui/material";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getFamilies, deleteFamily } from "../services/familyService";
import { Family } from "../types/types";
import DashboardHeader from "./dashboard/DashboardHeader";
import SearchActions from "./dashboard/SearchActions";
import FamilyCard from "./dashboard/FamilyCard";
import FamilyTable from "./dashboard/FamilyTable";
import AnimatedPage from "./common/AnimatedPage";
import AnimatedContainer from "./common/AnimatedContainer";
import { User } from "../types/types";

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { currentUser } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    landOwnership: "",
    incomeRange: [0, 10000000], // Increased to 1 crore (10 million)
    hasChildren: false,
    hasSpouse: false,
    hasOtherMembers: false,
    workLocationType: "",
    education: "",
    ageRange: [0, 100], // Add age range to filters
  });

  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const data = await getFamilies();
        console.log(JSON.stringify(data));
        setFamilies(data);
      } catch (error) {
        console.error("Error loading families:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, []);

  const handleDeleteFamily = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this family record?")) {
      try {
        setDeleteInProgress(id); // Track which family is being deleted
        await deleteFamily(id);
        setFamilies(families.filter((family) => family.id !== id));
      } catch (error) {
        console.error("Error deleting family:", error);
      } finally {
        setDeleteInProgress(null);
      }
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = (families: Family[]) => {
    return families.filter((family) => {
      const matchesSearch = searchTerm
        ? family.homeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          family.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          family.headOfFamily?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          family.headOfFamily?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesLandOwnership = filters.landOwnership ? family.landOwnership === filters.landOwnership : true;

      // Handle different income formats (e.g., "10 000" or "10, 000, 000" or "LKR 250,000")
      const normalizedIncome = family.income ? parseInt(family.income.replace(/[^0-9]/g, "")) : 0;

      const matchesIncome = normalizedIncome >= filters.incomeRange[0] && normalizedIncome <= filters.incomeRange[1];

      const matchesChildren = !filters.hasChildren || (family.children && family.children.length > 0);
      const matchesSpouse = !filters.hasSpouse || family.spouse;
      const matchesOtherMembers = !filters.hasOtherMembers || (family.otherMembers && family.otherMembers.length > 0);

      const workLocations = [family.headOfFamily?.workLocation, family.spouse?.workLocation].filter(Boolean);

      const matchesWorkLocation =
        !filters.workLocationType ||
        workLocations.some((loc) => loc?.toLowerCase().includes(filters.workLocationType.toLowerCase()));

      const educationLevels = [family.headOfFamily?.education, family.spouse?.education].filter(Boolean);

      const matchesEducation =
        !filters.education || educationLevels.some((edu) => edu?.toLowerCase() === filters.education.toLowerCase());

      // Add age filtering logic
      const familyMembers = [
        family.headOfFamily,
        family.spouse,
        ...(family.children || []),
        ...(family.otherMembers || []),
      ].filter(Boolean);

      const matchesAge = familyMembers.some((member) => {
        if (!member?.dateOfBirth) return false;
        const birthDate = new Date(member?.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age >= filters.ageRange[0] && age <= filters.ageRange[1];
      });

      return (
        matchesSearch &&
        matchesLandOwnership &&
        matchesIncome &&
        matchesChildren &&
        matchesSpouse &&
        matchesOtherMembers &&
        matchesWorkLocation &&
        matchesEducation &&
        matchesAge
      );
    });
  };

  const filteredFamilies = applyFilters(families);

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Skeleton loaders
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ width: "100%" }}>
              <Skeleton width="60%" height={28} />
              <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
            </Box>
          </Box>
          <Skeleton width="90%" height={20} sx={{ mt: 2 }} />
          <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Skeleton width={80} height={36} sx={{ mr: 1, borderRadius: 2 }} />
            <Skeleton width={80} height={36} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    ));
  };

  return (
    <AnimatedPage>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)",
          pt: { xs: 1, md: 4 },
          pb: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, md: 3 },
            }}
          >
            {/* Header Section with animation */}
            <AnimatedContainer animation="slide" delay={0.1}>
              <DashboardHeader currentUser={currentUser as User} />
            </AnimatedContainer>

            {/* Search and Add Section with animation */}
            <AnimatedContainer animation="slide" delay={0.2}>
              <Box sx={{ mb: 2 }}>
                <SearchActions
                  searchTerm={searchTerm}
                  onSearchChange={(value) => setSearchTerm(value)}
                  onFilterClick={() => setShowFilters(!showFilters)}
                />
              </Box>

              {/* Filter Panel - Apple-inspired Design */}
              <Collapse in={showFilters}>
                <Box
                  sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "rgba(250, 250, 250, 0.9)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 500,
                      color: "#1d1d1f",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Filters
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Selects in the first row */}
                    <Grid item xs={12} md={4}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(0, 125, 250, 0.15)",
                            },
                          },
                        }}
                      >
                        <InputLabel sx={{ fontWeight: 500, color: "#86868b" }}>Land Ownership</InputLabel>
                        <Select
                          value={filters.landOwnership}
                          label="Land Ownership"
                          onChange={(e) => handleFilterChange("landOwnership", e.target.value)}
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="owned">Owned</MenuItem>
                          <MenuItem value="rented">Rented</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(0, 125, 250, 0.15)",
                            },
                          },
                        }}
                      >
                        <InputLabel sx={{ fontWeight: 500, color: "#86868b" }}>Education Level</InputLabel>
                        <Select
                          value={filters.education}
                          label="Education Level"
                          onChange={(e) => handleFilterChange("education", e.target.value)}
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="ordinary level">Ordinary Level</MenuItem>
                          <MenuItem value="advance level">Advance Level</MenuItem>
                          <MenuItem value="bachelor's degree">Bachelor's Degree</MenuItem>
                          <MenuItem value="master's degree">Master's Degree</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                            "&.Mui-focused": {
                              boxShadow: "0 0 0 3px rgba(0, 125, 250, 0.15)",
                            },
                          },
                        }}
                      >
                        <InputLabel sx={{ fontWeight: 500, color: "#86868b" }}>Work Location</InputLabel>
                        <Select
                          value={filters.workLocationType}
                          label="Work Location"
                          onChange={(e) => handleFilterChange("workLocationType", e.target.value)}
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="home">Home</MenuItem>
                          <MenuItem value="corporation">Corporation</MenuItem>
                          <MenuItem value="school">School</MenuItem>
                          <MenuItem value="market">Market</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Income Slider */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "#1d1d1f",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Monthly Income
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 3,
                            color: "#86868b",
                            fontWeight: 400,
                          }}
                        >
                          Rs. {(filters.incomeRange[0] / 100000).toFixed(1)}L - Rs. {(filters.incomeRange[1] / 100000).toFixed(1)}
                          L
                        </Typography>
                        <Slider
                          value={filters.incomeRange}
                          onChange={(_, value) => handleFilterChange("incomeRange", value)}
                          min={0}
                          max={2000000}
                          step={10000}
                          sx={{
                            color: "#0071e3",
                            "& .MuiSlider-thumb": {
                              height: 24,
                              width: 24,
                              backgroundColor: "#fff",
                              border: "2px solid currentColor",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
                              },
                            },
                            "& .MuiSlider-track": {
                              height: 4,
                              borderRadius: 2,
                            },
                            "& .MuiSlider-rail": {
                              height: 4,
                              borderRadius: 2,
                              opacity: 0.3,
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Age Slider */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            color: "#1d1d1f",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Age Range
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 3,
                            color: "#86868b",
                            fontWeight: 400,
                          }}
                        >
                          {filters.ageRange[0]} - {filters.ageRange[1]} years
                        </Typography>
                        <Slider
                          value={filters.ageRange}
                          onChange={(_, value) => handleFilterChange("ageRange", value)}
                          min={0}
                          max={100}
                          step={1}
                          sx={{
                            color: "#0071e3",
                            "& .MuiSlider-thumb": {
                              height: 24,
                              width: 24,
                              backgroundColor: "#fff",
                              border: "2px solid currentColor",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
                              },
                            },
                            "& .MuiSlider-track": {
                              height: 4,
                              borderRadius: 2,
                            },
                            "& .MuiSlider-rail": {
                              height: 4,
                              borderRadius: 2,
                              opacity: 0.3,
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Family Composition */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 2,
                            fontWeight: 500,
                            color: "#1d1d1f",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          Family Composition
                        </Typography>
                        <Grid container spacing={2}>
                          {[
                            { label: "Has Children", field: "hasChildren" },
                            { label: "Has Spouse", field: "hasSpouse" },
                            {
                              label: "Has Other Members",
                              field: "hasOtherMembers",
                            },
                          ].map(({ label, field }) => (
                            <Grid item xs={12} sm={4} key={field}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={filters[field]}
                                    onChange={(e) => handleFilterChange(field, e.target.checked)}
                                    sx={{
                                      "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#0071e3",
                                        "&:hover": {
                                          backgroundColor: "rgba(0, 113, 227, 0.08)",
                                        },
                                      },
                                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: "#0071e3",
                                      },
                                    }}
                                  />
                                }
                                label={<Typography sx={{ color: "#1d1d1f", fontWeight: 400 }}>{label}</Typography>}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    ></Grid>
                  </Grid>
                </Box>
              </Collapse>
            </AnimatedContainer>

            {/* Content Section */}
            <AnimatedContainer animation="fade" delay={0.3}>
              {loading ? (
                <Box sx={{ my: 2 }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {isMobile ? (
                      renderSkeletons()
                    ) : (
                      <Box sx={skeletonContainerStyle}>
                        <Skeleton width="100%" height={50} sx={{ mb: 2 }} />
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton key={index} width="100%" height={60} sx={{ mb: 1 }} />
                        ))}
                      </Box>
                    )}
                  </motion.div>
                </Box>
              ) : (
                <>
                  {/* Mobile Cards View */}
                  {isMobile ? (
                    filteredFamilies.length > 0 ? (
                      <motion.div variants={listVariants} initial="hidden" animate="show">
                        <AnimatePresence mode="popLayout">
                          {filteredFamilies.map((family) => (
                            <motion.div
                              key={family.id}
                              variants={itemVariants}
                              layout
                              exit={{
                                opacity: 0,
                                y: -20,
                                transition: { duration: 0.3 },
                              }}
                            >
                              <FamilyCard
                                family={family}
                                onDelete={handleDeleteFamily}
                                isDeleting={deleteInProgress === family.id}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={emptyStateStyle}
                      >
                        <Typography variant="h5" sx={{ mb: 1, color: theme.palette.text.primary }}>
                          No families found
                        </Typography>
                        <Typography variant="body1" color="textSecondary" align="center">
                          {searchTerm ? "Try adjusting your search criteria" : "Add a new family to get started"}
                        </Typography>
                      </motion.div>
                    )
                  ) : (
                    // Desktop Table View with animation s
                    <FamilyTable
                      families={filteredFamilies}
                      onDelete={handleDeleteFamily}
                      deletingId={deleteInProgress}
                      searchTerm={searchTerm}
                      filters={filters}
                    />
                  )}
                </>
              )}
            </AnimatedContainer>
          </Box>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

// // Styled components and styles
// const filterSelectStyle = {
//   backgroundColor: "rgba(255, 255, 255, 0.8)",
//   borderRadius: "12px",
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "12px",
//   },
// };

// const sliderContainerStyle = {
//   p: 2,
//   borderRadius: "12px",
//   backgroundColor: "rgba(255, 255, 255, 0.8)",
//   transition: "all 0.2s",
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.95)",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//   },
// };

// const sliderLabelStyle = {
//   fontWeight: 500,
//   color: "text.primary",
//   mb: 2,
// };
const emptyStateStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "16px",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
};
// const sliderStyle = {
//   "& .MuiSlider-thumb": {
//     width: 14,
//     height: 14,
//     transition: "all 0.2s",
//     "&:hover": {
//       boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)",
//     },
//   },
//   "& .MuiSlider-rail": {
//     opacity: 0.32,
//   },
// };

// const checkboxGroupStyle = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: 2,
//   p: 2,
//   borderRadius: "12px",
//   backgroundColor: "rgba(255, 255, 255, 0.8)",
//   transition: "all 0.2s",
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.95)",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//   },
// };

// const checkboxStyle = {
//   "&.Mui-checked": {
//     color: "primary.main",
//   },
// };

// const checkboxLabelStyle = {
//   "& .MuiTypography-root": {
//     fontSize: "0.9rem",
//     fontWeight: 500,
//   },
// };

const skeletonContainerStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  backdropFilter: "blur(20px)",
  p: 3,
};

export default Dashboard;
