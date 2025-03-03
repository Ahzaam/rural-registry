import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Slide,
  AppBar,
  Toolbar,
  Stack,
  useTheme,
  FormControlLabel,
} from "@mui/material";
import {
  ArrowBack,
  QrCode as QrCodeIcon,
  Close,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AidEvent,
  Family,
  Distribution,
  MonthlyContribution,
} from "../../types/types";
import {
  getAidEvent,
  createDistribution,
  updateDistribution,
  createContribution,
  updateContribution,
  getDistribution,
  getContribution,
  subscribeToEventRecords,
} from "../../services/aidEventService";
import { getFamilies } from "../../services/familyService";
import EventQRScanner from "./EventQRScanner";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "../common/AnimatedPage";
import AnimatedContainer from "../common/AnimatedContainer";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Timestamp } from "firebase/firestore";
import { addPaymentRecord } from "../../services/familyHistoryService";
interface EventFamily extends Family {
  eligible: boolean;
}

export const ManageEventFamilies = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<AidEvent | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [records, setRecords] = useState<
    (Distribution | MonthlyContribution)[]
  >([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(
    searchParams.get("qr") === "true"
  );
  const [showAddFamilies, setShowAddFamilies] = useState(false);
  const [scannedFamily, setScannedFamily] = useState<EventFamily | null>(null);
  const [showFamilyPanel, setShowFamilyPanel] = useState(false);
  const [manualModeInScanner, setManualModeInScanner] = useState(false);
  const [tempHomeId, setTempHomeId] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);
  const [loadingQRDetails, setLoadingQRDetails] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<{
    itemName: string;
    quantity: number;
    unit?: string;
  }[]>([]);

  useEffect(() => {
    if (eventId) loadData();
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !event?.type) return;

    const unsubscribe = subscribeToEventRecords(
      eventId,
      event.type as "distribution" | "collection",
      (updatedRecords) => {
        setRecords(updatedRecords);
      }
    );

    return () => unsubscribe();
  }, [eventId, event?.type]);

  const loadData = async (loading = true) => {
    try {
      setLoading(loading);
      const [fetchedEvent, fetchedFamilies] = await Promise.all([
        getAidEvent(eventId!),
        getFamilies(),
      ]);

      setEvent(fetchedEvent);
      setPaymentAmount(fetchedEvent.targetAmount?.toString() || "");
      setFamilies(fetchedFamilies);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFamilies = families.filter((family) => {
    const hasRecord = records.some((record) => record.familyId === family.id);
    const matchesSearch =
      searchTerm === "" ||
      `${family.headOfFamily.firstName} ${family.headOfFamily.lastName} ${family.homeId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return !hasRecord && matchesSearch;
  });

  const handleAddFamilies = async () => {
    if (!event || !selectedFamilies.length) return;

    try {
      setLoading(true);
      const promises = selectedFamilies.map((familyId) => {
        if (event.type === "distribution") {
          return createDistribution({
            eventId: event.id,
            familyId,
            status: "pending",
          });
        } else {
          return createContribution({
            eventId: event.id,
            familyId,
            status: "pending",
            amount: 0, // Initialize with 0 instead of target amount
          });
        }
      });

      await Promise.all(promises);
      await loadData();
      setSelectedFamilies([]);
      setShowAddFamilies(false);
    } catch (error) {
      console.error("Error adding families:", error);
    }
  };

  const handleStatusUpdate = async (
    familyId: string,
    newStatus: "distributed" | "paid" | "skipped" | "excused"
  ) => {
    if (!event) return;

    try {
      const record = records.find((r) => r.familyId === familyId);
      if (!record) return;

      // If no amount entered and it's a collection event, use the event's target amount
      const amount =
        event.type === "collection"
          ? Number(paymentAmount) || event.targetAmount || 0
          : 0;

      // Add to payment history with items for distribution events
      await addPaymentRecord(familyId, {
        eventId: event.id,
        eventName: event.name,
        amount,
        status: newStatus,
        date: Timestamp.now(),
        type: event.type as "distribution" | "collection",
        ...(event.type === "distribution" && newStatus === "distributed" ? { items: selectedItems } : {})
      });

      if (event.type === "distribution") {
        await updateDistribution(record.id, {
          ...(record as Distribution),
          status: newStatus as "distributed" | "skipped",
          distributedItems: newStatus === "distributed" ? selectedItems : undefined,
          distributedAt: newStatus === "distributed" ? Timestamp.now() : undefined
        });
      } else {
        await updateContribution(record.id, {
          ...(record as MonthlyContribution),
          amount,
          status: newStatus as "paid" | "excused",
          paidAt: newStatus === "paid" ? Timestamp.now() : undefined
        });
      }
      await loadData(false);
      setPaymentAmount("");
      setSelectedItems([]);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleQRScanned = async (qrRes: IDetectedBarcode[]) => {
    setLoadingQRDetails(true);
    setShowFamilyPanel(true);
    const qrString = qrRes[0].rawValue;
    const homeId = qrString.split("-")[0];
    const family = families.find((f) => f.homeId === homeId) as EventFamily;
    if (family) {
      const record = records.find((r) => r.familyId === family.id);

      if (record) {
        if (record.status === "distributed" || record.status === "paid") {
          family.eligible = false;
          setScanError(
            `This family has already been marked as ${record.status}`
          );
        } else {
          family.eligible = true;
          setScanError(null);
        }
      } else {
        family.eligible = false;
        setScanError(null);
      }
      setLoadingQRDetails(false);
      setScannedFamily(family);
      setManualModeInScanner(false);
    }
  };

  const checkLatestStatus = async (familyId: string): Promise<boolean> => {
    if (!event || !eventId) return false;

    try {
      const latestRecord =
        event.type === "distribution"
          ? await getDistribution(eventId, familyId)
          : await getContribution(eventId, familyId);

      if (
        latestRecord &&
        (latestRecord.status === "distributed" ||
          latestRecord.status === "paid")
      ) {
        setScanError(
          `This family has already been marked as ${latestRecord.status} by another device`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking latest status:", error);
      setScanError("Error checking status. Please try again.");
      return false;
    }
  };

  const handleStatusUpdateInScanner = async () => {
    if (!scannedFamily || !event) return;

    const canProceed = await checkLatestStatus(scannedFamily.id);
    if (!canProceed) {
      await loadData();
      return;
    }

    const record = records.find((r) => r.familyId === scannedFamily.id);
    if (record) {
      await handleStatusUpdate(
        scannedFamily.id,
        event.type === "distribution" ? "distributed" : "paid"
      );
      setShowFamilyPanel(false);
      setScannedFamily(null);
      setTempHomeId("");
      setScanError(null);
    }
  };

  const handleManualSearch = () => {
    setLoadingQRDetails(true);
    setShowFamilyPanel(true);

    const family = families.find((f) => f.homeId === tempHomeId) as EventFamily;
    if (family) {
      const record = records.find((r) => r.familyId === family.id);

      if (
        record &&
        (record.status === "distributed" || record.status === "paid")
      ) {
        family.eligible = false;
        setScanError(`This family has already been marked as ${record.status}`);
      } else {
        family.eligible = true;
        setScanError(null);
      }
      setLoadingQRDetails(false);
      setScannedFamily(family);
    }
  };

  if (loading || !event) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <AnimatedContainer animation="slide" delay={0.1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => navigate(`/aid-events`)}
                  sx={{
                    color: theme.palette.primary.main,
                    bgcolor: "primary.lighter",
                    "&:hover": { bgcolor: "primary.light" },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </motion.div>
              <Typography variant="h4" component="h1" sx={{ color: "#1d1d1f" }}>
                {event.name}
              </Typography>
            </Box>
          </AnimatedContainer>

          <AnimatedContainer animation="slide" delay={0.2}>
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => setShowQRScanner(true)}
                sx={{
                  borderRadius: "12px",
                  borderColor: "#0070c9",
                  color: "#0070c9",
                  "&:hover": {
                    borderColor: "#005ea3",
                    bgcolor: "rgba(0, 112, 201, 0.04)",
                  },
                }}
              >
                Scan QR
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddFamilies(true)}
                sx={{
                  borderRadius: "12px",
                  borderColor: "#0070c9",
                  color: "#0070c9",
                  "&:hover": {
                    borderColor: "#005ea3",
                    bgcolor: "rgba(0, 112, 201, 0.04)",
                  },
                }}
              >
                Add Families
              </Button>
            </Box>
          </AnimatedContainer>

          <AnimatePresence mode="wait">
            {showAddFamilies ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    mb: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "#1d1d1f" }}>
                        Add Families to Event
                      </Typography>
                      <IconButton
                        onClick={() => setShowAddFamilies(false)}
                        size="small"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <TextField
                      placeholder="Search families..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={
                                  selectedFamilies.length ===
                                  filteredFamilies.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFamilies(
                                      filteredFamilies.map((f) => f.id)
                                    );
                                  } else {
                                    setSelectedFamilies([]);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>Home ID</TableCell>
                            <TableCell>Head of Family</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <AnimatePresence mode="popLayout">
                            {filteredFamilies.map((family, index) => (
                              <motion.tr
                                key={family.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedFamilies.includes(
                                      family.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedFamilies([
                                          ...selectedFamilies,
                                          family.id,
                                        ]);
                                      } else {
                                        setSelectedFamilies(
                                          selectedFamilies.filter(
                                            (id) => id !== family.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: "#1d1d1f" }}>
                                  {family.homeId}
                                </TableCell>
                                <TableCell sx={{ color: "#1d1d1f" }}>
                                  {family.headOfFamily.firstName}{" "}
                                  {family.headOfFamily.lastName}
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={selectedFamilies.length === 0}
                        onClick={handleAddFamilies}
                        sx={{
                          borderRadius: "12px",
                          bgcolor: "#0070c9",
                          "&:hover": {
                            bgcolor: "#005ea3",
                          },
                        }}
                      >
                        Add Selected Families
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, color: "#1d1d1f" }}>
                    Event Families
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Home ID</TableCell>
                          <TableCell>Head of Family</TableCell>
                          <TableCell>Status</TableCell>
                          {event.type === "collection" && (
                            <TableCell align="right">Amount</TableCell>
                          )}
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {records.map((record) => {
                            const family = families.find(
                              (f) => f.id === record.familyId
                            );
                            if (!family) return null;

                            return (
                              <motion.tr
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                              >
                                <TableCell sx={{ color: "#1d1d1f" }}>
                                  {family.homeId}
                                </TableCell>
                                <TableCell sx={{ color: "#1d1d1f" }}>
                                  {family.headOfFamily.firstName}{" "}
                                  {family.headOfFamily.lastName}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={record.status}
                                    size="small"
                                    sx={{
                                      borderRadius: "12px",
                                      bgcolor:
                                        record.status === "distributed" ||
                                        record.status === "paid"
                                          ? "success.lighter"
                                          : record.status === "skipped" ||
                                            record.status === "excused"
                                          ? "warning.lighter"
                                          : "info.lighter",
                                      color:
                                        record.status === "distributed" ||
                                        record.status === "paid"
                                          ? "success.main"
                                          : record.status === "skipped" ||
                                            record.status === "excused"
                                          ? "warning.main"
                                          : "info.main",
                                    }}
                                  />
                                </TableCell>
                                {event.type === "collection" && (
                                  <TableCell
                                    align="right"
                                    sx={{ color: "#1d1d1f" }}
                                  >
                                    Rs.{" "}
                                    {(record as MonthlyContribution).amount ||
                                      0}
                                  </TableCell>
                                )}
                                <TableCell align="right">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => {
                                        // Determine if the family is eligible to update based on current status
                                        const isEligibleForUpdate =
                                          record.status !== "distributed" &&
                                          record.status !== "paid";

                                        // Set the proper error message if already distributed or paid
                                        if (!isEligibleForUpdate) {
                                          setScanError(
                                            `This family has already been marked as ${record.status}`
                                          );
                                        } else {
                                          setScanError(null);
                                        }

                                        // Set the scanned family with eligibility status
                                        setScannedFamily({
                                          ...family,
                                          eligible: isEligibleForUpdate,
                                        });

                                        // Show the bottom panel without showing QR scanner
                                        setShowFamilyPanel(true);
                                      }}
                                      sx={{
                                        minWidth: "70px",
                                        borderRadius: "10px",
                                        borderColor: "#0070c9",
                                        color: "#0070c9",
                                        px: 2,
                                        "&:hover": {
                                          borderColor: "#005ea3",
                                          bgcolor: "rgba(0, 112, 201, 0.04)",
                                        },
                                      }}
                                    >
                                      Update
                                    </Button>
                                  </motion.div>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        <AnimatePresence>
          {showQRScanner && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "background.paper",
                zIndex: 9999,
              }}
            >
              <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    onClick={() => {
                      setShowQRScanner(false);
                      setScannedFamily(null);
                      setShowFamilyPanel(false);
                      setManualModeInScanner(false);
                      setTempHomeId("");
                    }}
                  >
                    <Close />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, color: "#1d1d1f" }}
                  >
                    Scan QR Code
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setManualModeInScanner(!manualModeInScanner)}
                  >
                    Manual Input
                  </Button>
                </Toolbar>
              </AppBar>

              {manualModeInScanner ? (
                <Box sx={{ p: 2 }}>
                  <TextField
                    fullWidth
                    autoFocus
                    label="Enter Home ID"
                    value={tempHomeId}
                    onChange={(e) => setTempHomeId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleManualSearch();
                      }
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleManualSearch}
                    sx={{
                      mb: 1,
                      bgcolor: "#0070c9",
                      "&:hover": {
                        bgcolor: "#005ea3",
                      },
                    }}
                  >
                    Search
                  </Button>
                </Box>
              ) : (
                <EventQRScanner onScan={handleQRScanned} onClose={() => {}} />
              )}

              <Slide direction="up" in={showFamilyPanel}>
                <Paper
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  {loadingQRDetails ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 4,
                      }}
                    >
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Loading family details...
                      </Typography>
                    </Box>
                  ) : (
                    scannedFamily && (
                      <Box sx={{ position: "relative" }}>
                        <Box sx={{ mt: 4, textAlign: "center" }}>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: "#1d1d1f" }}
                          >
                            {scannedFamily.headOfFamily.firstName}{" "}
                            {scannedFamily.headOfFamily.lastName}
                          </Typography>

                          <Chip
                            label={`Home ID: ${scannedFamily.homeId}`}
                            sx={{
                              mb: 2,
                              borderRadius: 8,
                              bgcolor: "primary.lighter",
                              color: "primary.dark",
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            my: 3,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: "background.default",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Family Members
                            </Typography>
                            <Box
                              sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                            >
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
                                  Adults: {1 + (scannedFamily.spouse ? 1 : 0)}
                                </Box>
                              </motion.div>
                              {scannedFamily.children.length > 0 && (
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
                                    Children: {scannedFamily.children.length}
                                  </Box>
                                </motion.div>
                              )}
                              {scannedFamily.otherMembers &&
                                scannedFamily.otherMembers.length > 0 && (
                                  <motion.div whileHover={{ y: -2 }}>
                                    <Box
                                      sx={{
                                        backgroundColor:
                                          "rgba(52, 199, 89, 0.1)",
                                        color: "#34c759",
                                        borderRadius: "20px",
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Others:{" "}
                                      {scannedFamily.otherMembers.length}
                                    </Box>
                                  </motion.div>
                                )}
                            </Box>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Phone
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {scannedFamily.headOfFamily.contact || "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Location
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {scannedFamily.address || "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Status {scannedFamily.eligible}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{
                                color: scannedFamily.eligible
                                  ? "success.main"
                                  : "error.main",
                              }}
                            >
                              {scannedFamily.eligible
                                ? "Eligible"
                                : "Ineligible"}
                            </Typography>
                          </Box>
                        </Box>

                        {event.type === "distribution" && event.items && event.items.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Distributed Items</Typography>
                            <Stack spacing={2}>
                              {event.items.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox 
                                        checked={selectedItems.some(si => si.itemName === item.name)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedItems([...selectedItems, { 
                                              itemName: item.name,
                                              quantity: item.quantity || 1,
                                              unit: item.unit
                                            }]);
                                          } else {
                                            setSelectedItems(selectedItems.filter(si => si.itemName !== item.name));
                                          }
                                        }}
                                      />
                                    }
                                    label={item.name}
                                  />
                                  {selectedItems.some(si => si.itemName === item.name) && (
                                    <TextField
                                      type="number"
                                      size="small"
                                      label="Quantity"
                                      value={selectedItems.find(si => si.itemName === item.name)?.quantity || ""}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value > 0) {
                                          setSelectedItems(selectedItems.map(si => 
                                            si.itemName === item.name 
                                              ? { ...si, quantity: value }
                                              : si
                                          ));
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: item.unit ? ` ${item.unit}` : undefined,
                                      }}
                                      sx={{ width: 120 }}
                                    />
                                  )}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {scanError ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box
                              sx={{
                                mt: 2,
                                mb: 2,
                                bgcolor: "error.lighter",
                                p: 3,
                                borderRadius: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="h6"
                                color="error.main"
                                fontWeight="medium"
                              >
                                {scanError}
                              </Typography>
                              <Button
                                variant="outlined"
                                color="error"
                                size="large"
                                onClick={() => {
                                  setShowFamilyPanel(false);
                                  setScannedFamily(null);
                                  setScanError(null);
                                }}
                                sx={{ borderRadius: "12px", px: 4 }}
                              >
                                Close
                              </Button>
                            </Box>
                          </motion.div>
                        ) : (
                          <Box sx={{ mt: 3 }}>
                            <Typography
                              variant="body1"
                              textAlign="center"
                              color="text.secondary"
                              sx={{ mb: 3 }}
                            >
                              Please confirm this is the correct family before
                              proceeding
                            </Typography>
                            {event.type === "collection" && (
                              <Box sx={{ mb: 2 }}>
                                <TextField
                                  fullWidth
                                  label="Enter Payment Amount (Rs.)"
                                  placeholder={
                                    event.targetAmount
                                      ? `Default: Rs. ${event.targetAmount}`
                                      : "Enter the amount paid"
                                  }
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) =>
                                    setPaymentAmount(e.target.value)
                                  }
                                  onClick={(e) =>
                                    (e.target as HTMLInputElement).select()
                                  }
                                  InputProps={{
                                    sx: { borderRadius: "8px" },
                                  }}
                                  helperText={
                                    event.targetAmount
                                      ? `Leave empty to use default amount (Rs. ${event.targetAmount})`
                                      : "Enter the amount paid by the family"
                                  }
                                />
                              </Box>
                            )}
                            <Stack direction="column" spacing={2}>
                              {scannedFamily.eligible ? (
                                <Button
                                  variant="contained"
                                  size="large"
                                  startIcon={
                                    event?.type === "distribution" ? (
                                      <AddIcon />
                                    ) : (
                                      <QrCodeIcon />
                                    )
                                  }
                                  sx={{
                                    borderRadius: "12px",
                                    py: 1.5,
                                    bgcolor: "#0070c9",
                                    "&:hover": {
                                      bgcolor: "#005ea3",
                                    },
                                    boxShadow: "0 4px 12px rgba(0,112,201,0.2)",
                                  }}
                                  onClick={handleStatusUpdateInScanner}
                                >
                                  Mark as{" "}
                                  {event?.type === "distribution"
                                    ? "Distributed"
                                    : "Paid"}
                                </Button>
                              ) : (
                                //  in eligible families force mark as distributed
                      
                                  <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={
                                      event?.type === "distribution" ? (
                                        <AddIcon />
                                      ) : (
                                        <QrCodeIcon />
                                      )
                                    }
                                    sx={{
                                      borderRadius: "12px",
                                      py: 1.5,
                                      bgcolor: "error.main",
                                      "&:hover": {
                                        bgcolor: "error.dark",
                                      },
                                      boxShadow:
                                        "0 4px 12px rgba(211,47,47,0.2)",
                                    }}
                                    onClick={handleStatusUpdateInScanner}
                                  >
                                    Force Distribute {event?.type === "distribution" ? "Distributed" : "Paid"}
                                  </Button>
                               
                              )}
                              <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                  borderRadius: "12px",
                                  py: 1.5,
                                  borderColor: "#0070c9",
                                  color: "#0070c9",
                                  "&:hover": {
                                    borderColor: "#005ea3",
                                    bgcolor: "rgba(0, 112, 201, 0.04)",
                                  },
                                }}
                                onClick={() => {
                                  setShowFamilyPanel(false);
                                  setScannedFamily(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    )
                  )}
                </Paper>
              </Slide>
            </Box>
          )}
        </AnimatePresence>

        {/* Bottom panel for table update button */}
        <Slide direction="up" in={showFamilyPanel && !showQRScanner}>
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
              zIndex: 9998,
            }}
          >
            {loadingQRDetails ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Loading family details...
                </Typography>
              </Box>
            ) : (
              scannedFamily && (
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "background.paper",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      "&:hover": { bgcolor: "#f5f5f7" },
                    }}
                    onClick={() => {
                      setShowFamilyPanel(false);
                      setScannedFamily(null);
                      setScanError(null);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>

                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: "#1d1d1f" }}
                    >
                      {scannedFamily.headOfFamily.firstName}{" "}
                      {scannedFamily.headOfFamily.lastName}
                    </Typography>

                    <Chip
                      label={`Home ID: ${scannedFamily.homeId}`}
                      sx={{
                        mb: 2,
                        borderRadius: 8,
                        bgcolor: "primary.lighter",
                        color: "primary.dark",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                      my: 3,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "background.default",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Family Members
                      </Typography>
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
                            Adults: {1 + (scannedFamily.spouse ? 1 : 0)}
                          </Box>
                        </motion.div>
                        {scannedFamily.children.length > 0 && (
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
                              Children: {scannedFamily.children.length}
                            </Box>
                          </motion.div>
                        )}
                        {scannedFamily.otherMembers &&
                          scannedFamily.otherMembers.length > 0 && (
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
                                Others: {scannedFamily.otherMembers.length}
                              </Box>
                            </motion.div>
                          )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {scannedFamily.headOfFamily.contact || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {scannedFamily.address || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{
                          color: scannedFamily.eligible
                            ? "success.main"
                            : "error.main",
                        }}
                      >
                        {scannedFamily.eligible ? "Eligible" : "Ineligible"}
                      </Typography>
                    </Box>
                  </Box>

                  {event.type === "distribution" && event.items && event.items.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Distributed Items</Typography>
                      <Stack spacing={2}>
                        {event.items.map((item, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Checkbox 
                                  checked={selectedItems.some(si => si.itemName === item.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems([...selectedItems, { 
                                        itemName: item.name,
                                        quantity: item.quantity || 1,
                                        unit: item.unit
                                      }]);
                                    } else {
                                      setSelectedItems(selectedItems.filter(si => si.itemName !== item.name));
                                    }
                                  }}
                                />
                              }
                              label={item.name}
                            />
                            {selectedItems.some(si => si.itemName === item.name) && (
                              <TextField
                                type="number"
                                size="small"
                                label="Quantity"
                                value={selectedItems.find(si => si.itemName === item.name)?.quantity || ""}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    setSelectedItems(selectedItems.map(si => 
                                      si.itemName === item.name 
                                        ? { ...si, quantity: value }
                                        : si
                                    ));
                                  }
                                }}
                                InputProps={{
                                  endAdornment: item.unit ? ` ${item.unit}` : undefined,
                                }}
                                sx={{ width: 120 }}
                              />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {scanError ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          mt: 2,
                          mb: 2,
                          bgcolor: "error.lighter",
                          p: 3,
                          borderRadius: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="error.main"
                          fontWeight="medium"
                        >
                          {scanError}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          onClick={() => {
                            setShowFamilyPanel(false);
                            setScannedFamily(null);
                            setScanError(null);
                          }}
                          sx={{ borderRadius: "12px", px: 4 }}
                        >
                          Close
                        </Button>
                      </Box>
                    </motion.div>
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Update status for this family
                      </Typography>
                      {event.type === "collection" && (
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            fullWidth
                            required
                            label="Enter Payment Amount (Rs.)"
                            placeholder={
                              event.targetAmount
                                ? `Default: Rs. ${event.targetAmount}`
                                : "Enter the amount paid"
                            }
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            onClick={(e) =>
                              (e.target as HTMLInputElement).select()
                            }
                            InputProps={{
                              sx: { borderRadius: "8px" },
                            }}
                            helperText={
                              event.targetAmount
                                ? `Leave empty to use default amount (Rs. ${event.targetAmount})`
                                : "Enter the amount paid by the family"
                            }
                          />
                        </Box>
                      )}
                      <Stack direction="column" spacing={2}>
                        {scannedFamily.eligible ? (
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={
                              event?.type === "distribution" ? (
                                <AddIcon />
                              ) : (
                                <QrCodeIcon />
                              )
                            }
                            sx={{
                              borderRadius: "12px",
                              py: 1.5,
                              bgcolor: "#0070c9",
                              "&:hover": {
                                bgcolor: "#005ea3",
                              },
                              boxShadow: "0 4px 12px rgba(0,112,201,0.2)",
                            }}
                            onClick={() => {
                              if (scannedFamily) {
                                handleStatusUpdate(
                                  scannedFamily.id,
                                  event?.type === "distribution"
                                    ? "distributed"
                                    : "paid"
                                );
                                setShowFamilyPanel(false);
                                setScannedFamily(null);
                                setScanError(null);
                              }
                            }}
                          >
                            Mark as{" "}
                            {event?.type === "distribution"
                              ? "Distributed"
                              : "Paid"}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={
                              event?.type === "distribution" ? (
                                <AddIcon />
                              ) : (
                                <QrCodeIcon />
                              )
                            }
                            sx={{
                              borderRadius: "12px",
                              py: 1.5,
                              boxShadow: "0 4px 12px rgba(211,47,47,0.2)",
                            }}
                            onClick={() => {
                              if (scannedFamily) {
                                handleStatusUpdate(
                                  scannedFamily.id,
                                  event?.type === "distribution"
                                    ? "distributed"
                                    : "paid"
                                );
                                setShowFamilyPanel(false);
                                setScannedFamily(null);
                                setScanError(null);
                              }
                            }}
                          >
                            Force{" "}
                            {event?.type === "distribution"
                              ? "Distribute"
                              : "Mark Paid"}
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="large"
                          sx={{
                            borderRadius: "12px",
                            py: 1.5,
                            borderColor: "#0070c9",
                            color: "#0070c9",
                            "&:hover": {
                              borderColor: "#005ea3",
                              bgcolor: "rgba(0, 112, 201, 0.04)",
                            },
                          }}
                          onClick={() => {
                            setShowFamilyPanel(false);
                            setScannedFamily(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>
              )
            )}
          </Paper>
        </Slide>
      </Box>
    </AnimatedPage>
  );
};
