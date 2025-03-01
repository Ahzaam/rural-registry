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
} from "@mui/material";
import { ArrowBack, QrCode as QrCodeIcon, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { AidEvent, Family, Distribution, MonthlyContribution } from "../../types/types";
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

export const ManageEventFamilies = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<AidEvent | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [records, setRecords] = useState<(Distribution | MonthlyContribution)[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualHomeId, setManualHomeId] = useState("");
  const [statusToSet, setStatusToSet] = useState<"distributed" | "paid" | "skipped" | "excused">("distributed");
  const [scannedFamily, setScannedFamily] = useState<Family | null>(null);
  const [showFamilyPanel, setShowFamilyPanel] = useState(false);
  const [manualModeInScanner, setManualModeInScanner] = useState(false);
  const [tempHomeId, setTempHomeId] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) loadData();
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !event?.type) return;

    // Set up real-time listener for records
    const unsubscribe = subscribeToEventRecords(eventId, event.type as "distribution" | "collection", (updatedRecords) => {
      setRecords(updatedRecords);
    });

    // Cleanup subscription when component unmounts or eventId/type changes
    return () => unsubscribe();
  }, [eventId, event?.type]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedEvent, fetchedFamilies] = await Promise.all([getAidEvent(eventId!), getFamilies()]);

      setEvent(fetchedEvent);
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
            amount: event.targetAmount || 0,
          });
        }
      });

      await Promise.all(promises);
      await loadData();
      setSelectedFamilies([]);
    } catch (error) {
      console.error("Error adding families:", error);
    }
  };

  const handleStatusUpdate = async (familyId: string, newStatus: "distributed" | "paid" | "skipped" | "excused") => {
    if (!event) return;

    try {
      const record = records.find((r) => r.familyId === familyId);
      if (!record) return;

      if (event.type === "distribution") {
        await updateDistribution(record.id, {
          ...(record as Distribution),
          status: newStatus as "distributed" | "skipped",
        });
      } else {
        await updateContribution(record.id, {
          ...(record as MonthlyContribution),
          status: newStatus as "paid" | "excused",
        });
      }
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleQRScanned = async (qrString: string) => {
    console.log("QR Scanned:", qrString);
    const homeId = qrString.split("-")[0];
    const family = families.find((f) => f.homeId === homeId);
    if (family) {
      const record = records.find((r) => r.familyId === family.id);
      if (record && (record.status === "distributed" || record.status === "paid")) {
        setScanError(`This family has already been marked as ${record.status}`);
      } else {
        setScanError(null);
      }
      setScannedFamily(family);
      setShowFamilyPanel(true);
      setManualModeInScanner(false);
    }
  };

  const checkLatestStatus = async (familyId: string): Promise<boolean> => {
    if (!event || !eventId) return false;

    try {
      // Get the latest record directly from the database
      const latestRecord =
        event.type === "distribution" ? await getDistribution(eventId, familyId) : await getContribution(eventId, familyId);

      // If the record exists and is already marked, return false
      if (latestRecord && (latestRecord.status === "distributed" || latestRecord.status === "paid")) {
        setScanError(`This family has already been marked as ${latestRecord.status} by another device`);
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

    // Check latest status from database before proceeding
    const canProceed = await checkLatestStatus(scannedFamily.id);
    if (!canProceed) {
      // Update local records to reflect the current state
      await loadData();
      return;
    }

    const record = records.find((r) => r.familyId === scannedFamily.id);
    if (record) {
      await handleStatusUpdate(scannedFamily.id, event.type === "distribution" ? "distributed" : "paid");
      // Reset and prepare for next scan
      setShowFamilyPanel(false);
      setScannedFamily(null);
      setTempHomeId("");
      setScanError(null);
    }
  };

  const handleManualSearch = () => {
    const family = families.find((f) => f.homeId === tempHomeId);
    if (family) {
      const record = records.find((r) => r.familyId === family.id);
      if (record && (record.status === "distributed" || record.status === "paid")) {
        setScanError(`This family has already been marked as ${record.status}`);
      } else {
        setScanError(null);
      }
      setScannedFamily(family);
      setShowFamilyPanel(true);
    }
    setTempHomeId("");
  };

  const handleManualSubmit = async () => {
    const family = families.find((f) => f.homeId === manualHomeId);
    if (family) {
      await handleStatusUpdate(family.id, statusToSet);
    }
    setManualHomeId("");
    setShowManualInput(false);
  };

  const ScannerOverlay = () => (
    <Box
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
            }}
          >
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Scan QR Code
          </Typography>
          <Button variant="outlined" onClick={() => setManualModeInScanner(!manualModeInScanner)}>
            Manual Input
          </Button>
        </Toolbar>
      </AppBar>

      {manualModeInScanner ? (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Enter Home ID"
            value={tempHomeId}
            onChange={(e) => setTempHomeId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleManualSearch} sx={{ mb: 1 }}>
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
            p: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: 3,
          }}
        >
          {scannedFamily && (
            <>
              <Typography variant="h6" gutterBottom>
                {scannedFamily.headOfFamily.firstName} {scannedFamily.headOfFamily.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Home ID: {scannedFamily.homeId}
              </Typography>
              {scanError ? (
                <>
                  <Typography
                    color="error"
                    sx={{
                      mt: 2,
                      mb: 2,
                      bgcolor: "error.lighter",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {scanError}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setShowFamilyPanel(false);
                      setScannedFamily(null);
                      setScanError(null);
                    }}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button variant="contained" fullWidth sx={{ flex: 3 }} onClick={handleStatusUpdateInScanner}>
                    Mark as {event?.type === "distribution" ? "Distributed" : "Paid"}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ flex: 1 }}
                    onClick={() => {
                      setShowFamilyPanel(false);
                      setScannedFamily(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Slide>
    </Box>
  );

  if (loading || !event) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton
            onClick={() => navigate(`/aid-events`)}
            sx={{
              color: "primary.main",
              bgcolor: "primary.lighter",
              "&:hover": { bgcolor: "primary.light" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {event.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={() => setShowQRScanner(true)}
            sx={{ borderRadius: "12px" }}
          >
            Scan QR
          </Button>
          <Button variant="outlined" onClick={() => setShowManualInput(true)} sx={{ borderRadius: "12px" }}>
            Manual Update
          </Button>
        </Box>

        {showManualInput && (
          <Paper sx={{ p: 3, borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Manual Status Update
            </Typography>
            <TextField
              fullWidth
              label="Enter Home ID"
              value={manualHomeId}
              onChange={(e) => setManualHomeId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {event.type === "distribution" ? (
                <>
                  <Button fullWidth onClick={() => setStatusToSet("distributed")}>
                    Distributed
                  </Button>
                  <Button fullWidth onClick={() => setStatusToSet("skipped")}>
                    Skipped
                  </Button>
                </>
              ) : (
                <>
                  <Button fullWidth onClick={() => setStatusToSet("paid")}>
                    Paid
                  </Button>
                  <Button fullWidth onClick={() => setStatusToSet("excused")}>
                    Excused
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button fullWidth variant="contained" onClick={handleManualSubmit}>
                Update Status
              </Button>
              <Button fullWidth variant="outlined" onClick={() => setShowManualInput(false)}>
                Cancel
              </Button>
            </Box>
          </Paper>
        )}

        <Paper sx={{ p: 3, borderRadius: "16px", mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Families to Event
          </Typography>
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
                      checked={selectedFamilies.length === filteredFamilies.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFamilies(filteredFamilies.map((f) => f.id));
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
                {filteredFamilies.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFamilies.includes(family.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFamilies([...selectedFamilies, family.id]);
                          } else {
                            setSelectedFamilies(selectedFamilies.filter((id) => id !== family.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{family.homeId}</TableCell>
                    <TableCell>
                      {family.headOfFamily.firstName} {family.headOfFamily.lastName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disabled={selectedFamilies.length === 0}
              onClick={handleAddFamilies}
              sx={{ borderRadius: "12px" }}
            >
              Add Selected Families
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Event Families
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Home ID</TableCell>
                  <TableCell>Head of Family</TableCell>
                  <TableCell>Status</TableCell>
                  {event.type === "collection" && <TableCell align="right">Amount</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => {
                  const family = families.find((f) => f.id === record.familyId);
                  if (!family) return null;

                  return (
                    <TableRow key={record.id}>
                      <TableCell>{family.homeId}</TableCell>
                      <TableCell>
                        {family.headOfFamily.firstName} {family.headOfFamily.lastName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            borderRadius: "12px",
                            bgcolor:
                              record.status === "distributed" || record.status === "paid"
                                ? "success.lighter"
                                : record.status === "skipped" || record.status === "excused"
                                ? "warning.lighter"
                                : "info.lighter",
                            color:
                              record.status === "distributed" || record.status === "paid"
                                ? "success.main"
                                : record.status === "skipped" || record.status === "excused"
                                ? "warning.main"
                                : "info.main",
                          }}
                        />
                      </TableCell>
                      {event.type === "collection" && (
                        <TableCell align="right">Rs. {(record as MonthlyContribution).amount || 0}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {showQRScanner && <ScannerOverlay />}
    </Container>
  );
};
