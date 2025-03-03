import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  useTheme,
  TableRow,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Family, Person, Child, OtherMember } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";

interface FamilyTableProps {
  families: Family[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
  searchTerm?: string; // Add searchTerm prop
  filters?: any; // Add filters prop
}

const FamilyTable: React.FC<FamilyTableProps> = ({
  families,
  onDelete,
  deletingId,
  searchTerm = "",
  filters,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [normalizedView, setNormalizedView] = useState(false);

  // Animation variants for table rows
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  type NormalizedMember = {
    type: "head" | "spouse" | "child" | "other";
    homeId: string;
    familyId: string;
    relationship?: string;
  } & Person;

  const getNormalizedMembers = (families: Family[]): NormalizedMember[] => {
    return families.flatMap((family) => {
      const members: NormalizedMember[] = [];

      // Add head of family
      members.push({
        ...family.headOfFamily,
        type: "head",
        homeId: family.homeId,
        familyId: family.id,
        relationship: "Head of Family",
      });

      // Add spouse if exists
      if (family.spouse) {
        members.push({
          ...family.spouse,
          type: "spouse",
          homeId: family.homeId,
          familyId: family.id,
          relationship: "Spouse",
        });
      }

      // Add children
      family.children.forEach((child) => {
        members.push({
          ...child,
          type: "child",
          homeId: family.homeId,
          familyId: family.id,
          relationship: "Child",
        });
      });

      // Add other members
      if (family.otherMembers) {
        family.otherMembers.forEach((member) => {
          members.push({
            ...member,
            type: "other",
            homeId: family.homeId,
            familyId: family.id,
          });
        });
      }

      return members;
    });
  };

  const normalizedMembers = getNormalizedMembers(families);

  const applyFiltersToMembers = (members: NormalizedMember[]) => {
    return members.filter(member => {
      const matchesSearch = searchTerm
        ? `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.homeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.relationship || '').toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesAge = (() => {
        if (!member.dateOfBirth) return false;
        const birthDate = new Date(member.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age >= filters.ageRange[0] && age <= filters.ageRange[1];
      })();

      return matchesSearch && matchesAge;
    });
  };

  const filteredNormalizedMembers = applyFiltersToMembers(normalizedMembers);

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
  if (families.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={emptyStateStyle}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, color: theme.palette.text.primary }}
        >
          No families found
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          {searchTerm
            ? "Try adjusting your search criteria"
            : "Add a new family to get started"}
        </Typography>
      </motion.div>
    );
  }

  return (
    <>
      {/* Results count */}
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    py: 2,
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    mb: 3
  }}
>
  {/* Results count with Apple-like styling */}
  <Typography
    variant="body2"
    sx={{
      color: "text.secondary",
      fontSize: "0.875rem",
      fontWeight: 400,
    }}
  >
    {normalizedView
      ? `${filteredNormalizedMembers.length} ${
          filteredNormalizedMembers.length === 1 ? "member" : "members"
        }`
      : `${families.length} ${
          families.length === 1 ? "family" : "families"
        }`}
  </Typography>

  {/* Apple-style toggle with label on left */}
  <FormControlLabel
    labelPlacement="start"
    control={
      <Switch
        checked={normalizedView}
        onChange={(e) => setNormalizedView(e.target.checked)}
        sx={{
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '2px',
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#0071e3',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: 'background-color 500ms',
          },
        }}
      />
    }
    label={
      <Typography 
        sx={{ 
          fontSize: "0.875rem",
          fontWeight: 400,
        }}
      >
        Normalized View
      </Typography>
    }
    sx={{ 
      ml: 0,
      mr: 0,
      gap: 1.5,
      '& .MuiFormControlLabel-label': {
        color: 'text.primary'
      }
    }}
  />
</Box>
      <TableContainer
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          borderRadius: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#1d1d1f",
                  fontSize: "0.95rem",
                  borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                  py: 3,
                }}
              >
                Home ID
              </TableCell>
              {normalizedView ? (
                <>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Relationship
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Gender
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Date of Birth
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Contact
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Head of Family
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Location & Contact
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1d1d1f",
                      fontSize: "0.95rem",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                      py: 3,
                    }}
                  >
                    Family Composition
                  </TableCell>
                </>
              )}
            
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {normalizedView
                ? filteredNormalizedMembers.map((member, index) => (
                    <motion.tr
                      key={`${member.familyId}-${member.id}-${member.type}`}
                      custom={index}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() =>
                        navigate(`/families/${member.familyId}?memberId=${member.id}`)
                      }
                      className="cursor-pointer"
                      layout
                      style={{
                        position: "relative",
                        backgroundColor:
                          deletingId === member.familyId
                            ? "rgba(255, 59, 48, 0.05)"
                            : "transparent",
                      }}
                      whileHover={{
                        backgroundColor:
                          deletingId === member.familyId
                            ? "rgba(255, 59, 48, 0.05)"
                            : "rgba(0, 112, 201, 0.04)",
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "#0070c9",
                          }}
                        >
                          #{member.homeId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {`${member.firstName} ${member.lastName}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {member.relationship || member.type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {member.gender}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {formatDate(member.dateOfBirth)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {member.contact || "-"}
                        </Typography>
                      </TableCell>
                      
                    </motion.tr>
                  ))
                : // Original table view
                  families.map((family, index) => (
                    <motion.tr
                      key={family.id}
                      custom={index}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() =>
                        navigate(`/families/${family.id}`)
                      }
                      className="cursor-pointer"
                      layout
                      style={{
                        position: "relative",
                        backgroundColor:
                          deletingId === family.id
                            ? "rgba(255, 59, 48, 0.05)"
                            : "transparent",
                      }}
                      whileHover={{
                        backgroundColor:
                          deletingId === family.id
                            ? "rgba(255, 59, 48, 0.05)"
                            : "rgba(0, 112, 201, 0.04)",
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "#0070c9",
                              mb: 0.5,
                            }}
                          >
                            #{family.homeId}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: "#86868b",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Box
                              component={motion.span}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 5,
                              }}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor:
                                  family.landOwnership === "owned"
                                    ? "#34c759"
                                    : "#ff9f0a",
                                display: "inline-block",
                              }}
                            />
                            {family.landOwnership === "owned"
                              ? "Owner"
                              : "Tenant"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>
                            {`${family.headOfFamily.firstName} ${family.headOfFamily.lastName}`}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.875rem", color: "#86868b" }}
                          >
                            {family.headOfFamily.occupation ||
                              "No occupation listed"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            {family.address}
                          </Typography>
                          {family.headOfFamily.contact && (
                            <Typography
                              sx={{
                                fontSize: "0.875rem",
                                color: "#0070c9",
                                mt: 0.5,
                              }}
                            >
                              {family.headOfFamily.contact}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <motion.div whileHover={{ y: -2 }}>
                            <Box
                              sx={{
                                backgroundColor: "rgba(0, 112, 201, 0.1)",
                                color: "#0070c9",
                                borderRadius: "20px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Adults: {1 + (family.spouse ? 1 : 0)}
                            </Box>
                          </motion.div>
                          {family.children.length > 0 && (
                            <motion.div whileHover={{ y: -2 }}>
                              <Box
                                sx={{
                                  backgroundColor: "rgba(88, 86, 214, 0.1)",
                                  color: "#5856d6",
                                  borderRadius: "20px",
                                  px: 1.5,
                                  py: 0.5,
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              >
                                Children: {family.children.length}
                              </Box>
                            </motion.div>
                          )}
                          {family.otherMembers &&
                            family.otherMembers.length > 0 && (
                              <motion.div whileHover={{ y: -2 }}>
                                <Box
                                  sx={{
                                    backgroundColor: "rgba(52, 199, 89, 0.1)",
                                    color: "#34c759",
                                    borderRadius: "20px",
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  Others: {family.otherMembers.length}
                                </Box>
                              </motion.div>
                            )}
                        </Box>
                      </TableCell>
                    
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FamilyTable;
