import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Typography, Box, IconButton, Grid, Skeleton, Stack, Fade } from "@mui/material";
import { motion } from "framer-motion";
import { getFamilyById, updateFamily } from "../services/familyService";
import { Family } from "../types/types";
import { ArrowBack, ChevronLeft, History } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import HouseholdInformationDetails from "./details/HouseholdInformationDetails";
import HeadOfFamilyDetails from "./details/HeadOfFamilyDetails";
import SpouseDetails from "./details/SpouseDetails";
import ChildrenDetails from "./details/ChildrenDetails";
import OtherMembersDetails from "./details/OtherMembersDetails";
import QRCodeDisplay from "./details/QRCodeDisplay";
import AnimatedPage from "./common/AnimatedPage";
import AnimatedContainer from "./common/AnimatedContainer";
import AnimatedButton from "./common/AnimatedButton";

const FamilyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamily = async () => {
      if (id) {
        try {
          // Pass token from query params for authorization
          // const token = searchParams.get("token");
          // const options = token ? { queryParams: { token } } : undefined;
          const familyData = await getFamilyById(id);
          setFamily(familyData);
        } catch (error) {
          console.error("Error fetching family details:", error);
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFamily();
  }, [id, searchParams]);

  const handleUpdate = async (updatedFamily: Partial<Family>) => {
    if (!isAdmin) return; // Prevent updates for non-admin users

    if (family && family.id) {
      const newFamily = { ...family, ...updatedFamily };
      setFamily(newFamily);
      try {
        await updateFamily(family.id, updatedFamily);
      } catch (error) {
        console.error("Error updating family details:", error);
      }
    }
  };

  const renderSkeletons = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Skeleton width="40%" height={40} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <Skeleton width="50%" height={32} sx={{ mb: 2 }} />
                <Skeleton width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="60%" height={24} />
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              borderRadius: "16px",
              backgroundColor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="rectangular" width="80%" height="80%" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  if (!family && !loading) {
    return (
      <AnimatedPage>
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#1d1d1f", fontWeight: 600 }}>
                Family Not Found
              </Typography>
              <Typography variant="body1" sx={{ color: "#86868b", mb: 4 }}>
                The family you're looking for doesn't exist or you don't have permission to view it.
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <AnimatedButton
                variant="contained"
                onClick={() => navigate(isAdmin ? "/dashboard" : "/")}
                startIcon={<ArrowBack />}
                sx={{
                  bgcolor: "#0070c9",
                  borderRadius: "12px",
                  py: 1.5,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#005ea3",
                  },
                }}
              >
                {isAdmin ? "Back to Dashboard" : "Back to Home"}
              </AnimatedButton>
            </motion.div>
          </Box>
        </Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
          pt: { xs: 2, md: 4 },
          pb: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={!loading} timeout={800}>
            <Box>
              {loading ? (
                renderSkeletons()
              ) : (
                <>
                  <AnimatedContainer animation="slide" delay={0.1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: { xs: "100%", sm: "auto" } }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <IconButton
                            onClick={() => navigate(isAdmin ? "/dashboard" : "/")}
                            sx={{
                              mr: 1.5,
                              color: "#0070c9",
                              backgroundColor: "white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              "&:hover": {
                                backgroundColor: "white",
                              },
                            }}
                          >
                            <ChevronLeft />
                          </IconButton>
                        </motion.div>
                        <Typography
                          variant="h4"
                          component="h1"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            color: "#1d1d1f",
                          }}
                        >
                          Family Details
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <IconButton
                            onClick={() => navigate(`/families/${family?.id}/history`)}
                            sx={{
                              ml: 1.5,
                              color: "#0070c9",
                              backgroundColor: "white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              "&:hover": {
                                backgroundColor: "white",
                              },
                            }}
                          >
                            <History />
                          </IconButton>
                        </motion.div>
                      </Box>
                    </Box>
                  </AnimatedContainer>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Stack spacing={3}>
                        <AnimatedContainer animation="fade" delay={0.2}>
                          <HouseholdInformationDetails family={family!} handleUpdate={handleUpdate} readOnly={!isAdmin} />
                        </AnimatedContainer>
                        <AnimatedContainer animation="fade" delay={0.3}>
                          <HeadOfFamilyDetails family={family!} handleUpdate={handleUpdate} />
                        </AnimatedContainer>
                        <AnimatedContainer animation="fade" delay={0.4}>
                          <SpouseDetails family={family!} handleUpdate={handleUpdate} />
                        </AnimatedContainer>
                        <AnimatedContainer animation="fade" delay={0.5}>
                          <ChildrenDetails family={family!} handleUpdate={handleUpdate} />
                        </AnimatedContainer>
                        <AnimatedContainer animation="fade" delay={0.6}>
                          <OtherMembersDetails family={family!} handleUpdate={handleUpdate} />
                        </AnimatedContainer>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <AnimatedContainer animation="fade" delay={0.7}>
                        {isAdmin && <QRCodeDisplay family={family!} />}
                      </AnimatedContainer>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default FamilyDetails;
