import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  ButtonGroup,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  QrCodeScanner as QrCodeScannerIcon,
  PeopleAlt as PeopleAltIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  LocalActivity as ActivityIcon,
} from "@mui/icons-material";
import { AidEvent } from "../../types/types";
import { EventDetails } from "./EventDetails";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "../common/AnimatedButton";

interface Props {
  events: AidEvent[];
  onEventUpdated: () => void;
}

export const EventsList: React.FC<Props> = ({ events, onEventUpdated }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedEvent, setSelectedEvent] = useState<AidEvent | null>(null);
  const [viewMode] = useState<"grid" | "table">(isMobile ? "grid" : "table");

  const getStatusColor = (status: AidEvent["status"]) => {
    switch (status) {
      case "planned":
        return { color: "#ff9500", bgcolor: "rgba(255, 149, 0, 0.1)" };
      case "ongoing":
        return { color: "#0070c9", bgcolor: "rgba(0, 112, 201, 0.1)" };
      case "completed":
        return { color: "#34c759", bgcolor: "rgba(52, 199, 89, 0.1)" };
      default:
        return { color: "#86868b", bgcolor: "rgba(134, 134, 139, 0.1)" };
    }
  };

  const getTypeColor = (type: AidEvent["type"]) => {
    return type === "distribution"
      ? { color: "#5856d6", bgcolor: "rgba(88, 86, 214, 0.1)" }
      : { color: "#af52de", bgcolor: "rgba(175, 82, 222, 0.1)" };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleScanQR = (eventId: string) => {
    navigate(`/aid-events/${eventId}/manage-families?qr=true`);
  };

  const handleManageFamilies = (eventId: string) => {
    navigate(`/aid-events/${eventId}/manage-families`);
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  if (events.length === 0) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <ActivityIcon sx={{ fontSize: 60, color: "#86868b", opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: "#1d1d1f" }}>
          No events found
        </Typography>
        <Typography sx={{ color: "#86868b" }}>
          Create your first event to get started with aid distribution or collection
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {viewMode === "grid" ? (
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <motion.div
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: "24px",
                      overflow: "hidden",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          p: 3,
                          pb: 2,
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: "1.1rem",
                              color: "#1d1d1f",
                              maxWidth: "70%",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {event.name}
                          </Typography>
                          <Chip
                            label={event.status}
                            size="small"
                            sx={{
                              borderRadius: "12px",
                              ...getStatusColor(event.status),
                              textTransform: "capitalize",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarIcon sx={{ color: "#86868b", fontSize: "0.9rem" }} />
                            <Typography variant="body2" sx={{ color: "#86868b" }}>
                              {formatDate(event.date)}
                            </Typography>
                          </Box>

                          <Chip
                            label={event.type === "distribution" ? "Distribution" : "Collection"}
                            size="small"
                            sx={{
                              borderRadius: "12px",
                              ...getTypeColor(event.type),
                              textTransform: "capitalize",
                              height: "20px",
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Scan QR Codes" arrow>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <AnimatedButton
                              startIcon={<QrCodeScannerIcon />}
                              onClick={() => handleScanQR(event.id)}
                              sx={{
                                borderRadius: "12px",
                                backgroundColor: "#0070c9",
                                color: "white",
                                flex: 1,
                                fontWeight: 500,
                                textTransform: "none",
                                boxShadow: "0 4px 12px rgba(0, 112, 201, 0.25)",
                                "&:hover": {
                                  backgroundColor: "#005ea3",
                                },
                              }}
                            >
                              Scan QR
                            </AnimatedButton>
                          </motion.div>
                        </Tooltip>

                        <Tooltip title="Manage Families" arrow>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                              onClick={() => handleManageFamilies(event.id)}
                              sx={{
                                color: "#86868b",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  color: "#1d1d1f",
                                },
                              }}
                            >
                              <PeopleAltIcon />
                            </IconButton>
                          </motion.div>
                        </Tooltip>

                        <Tooltip title="View Details" arrow>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                              onClick={() => setSelectedEvent(event)}
                              sx={{
                                color: "#86868b",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  color: "#1d1d1f",
                                },
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#1d1d1f" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#1d1d1f" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#1d1d1f" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#1d1d1f" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#1d1d1f", width: "200px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {events.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    style={{
                      backgroundColor: "transparent",
                      position: "relative",
                    }}
                  >
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.type === "distribution" ? "Distribution" : "Collection"}
                        size="small"
                        sx={{
                          borderRadius: "12px",
                          ...getTypeColor(event.type),
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        size="small"
                        sx={{
                          borderRadius: "12px",
                          ...getStatusColor(event.status),
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <ButtonGroup
                        className="row-actions"
                        sx={{
                          opacity: { xs: 1, md: 0.6 },
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <Tooltip title="Scan QR codes" arrow>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <AnimatedButton
                              size="small"
                              startIcon={<QrCodeScannerIcon />}
                              variant="contained"
                              onClick={() => handleScanQR(event.id)}
                              sx={{
                                borderRadius: "8px",
                                mr: 1,
                                backgroundColor: "#0070c9",
                                "&:hover": { backgroundColor: "#005ea3" },
                              }}
                            >
                              Scan
                            </AnimatedButton>
                          </motion.div>
                        </Tooltip>

                        <Tooltip title="Manage families" arrow>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleManageFamilies(event.id)}
                              sx={{
                                color: "#86868b",
                                backgroundColor: "rgba(134, 134, 139, 0.1)",
                                mr: 1,
                                "&:hover": {
                                  backgroundColor: "rgba(134, 134, 139, 0.2)",
                                  color: "#1d1d1f",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <PeopleAltIcon fontSize="small" />
                            </IconButton>
                          </motion.div>
                        </Tooltip>

                        <Tooltip title="View details" arrow>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                              size="small"
                              onClick={() => setSelectedEvent(event)}
                              sx={{
                                color: "#0070c9",
                                backgroundColor: "rgba(0, 112, 201, 0.1)",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 112, 201, 0.2)",
                                  color: "#005ea3",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                      </ButtonGroup>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedEvent && (
        <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={onEventUpdated} />
      )}
    </>
  );
};
