// filepath: f:\PROGRAMMING\JavaScript\rural-registry\src\components\announcements\AnnouncementForm.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  InputLabel,
} from "@mui/material";
import { createAnnouncement, updateAnnouncement } from "../../services/announcementService";
import { Announcement } from "../../types/types";
import { motion } from "framer-motion";

interface AnnouncementFormProps {
  open: boolean;
  onClose: () => void;
  announcement: Announcement | null;
  userId: string;
}

const MotionButton = motion(Button);

// Helper function to format date to YYYY-MM-DD for date inputs
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ open, onClose, announcement, userId }) => {
  const initialFormState = {
    title: "",
    content: "",
    type: "general" as "general" | "event" | "prayer" | "eid" | "ramadan" | "other",
    visibleFrom: formatDateForInput(new Date()),
    visibleUntil: formatDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 1))), // Default 1 month
    priority: "medium" as "medium" | "high" | "low",
    isActive: true,
    imageUrl: "",
    linkUrl: "",
    linkText: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        visibleFrom: formatDateForInput(new Date(announcement.visibleFrom)),
        visibleUntil: formatDateForInput(new Date(announcement.visibleUntil)),
        priority: announcement.priority,
        isActive: announcement.isActive,
        imageUrl: announcement.imageUrl || "",
        linkUrl: announcement.linkUrl || "",
        linkText: announcement.linkText || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [announcement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (announcement) {
        // Update existing announcement
        await updateAnnouncement(announcement.id, {
          ...formData,
          visibleFrom: new Date(formData.visibleFrom),
          visibleUntil: new Date(formData.visibleUntil),
          updatedAt: new Date(),
        });
      } else {
        // Create new announcement
        await createAnnouncement({
          ...formData,
          visibleFrom: new Date(formData.visibleFrom),
          visibleUntil: new Date(formData.visibleUntil),
          createdBy: userId,
        });
      }

      onClose();
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          pb: 3,
          pt: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {announcement ? "Edit Announcement" : "Create New Announcement"}
        <FormControlLabel
          control={<Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" color="warning" />}
          label={
            <Typography variant="body2" sx={{ color: "white" }}>
              {formData.isActive ? "Active" : "Inactive"}
            </Typography>
          }
        />
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              autoFocus
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="prayer">Prayer</MenuItem>
              <MenuItem value="eid">Eid</MenuItem>
              <MenuItem value="ramadan">Ramadan</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="visibleFrom" sx={{ mb: 1 }}>
              Visible From
            </InputLabel>
            <TextField
              id="visibleFrom"
              name="visibleFrom"
              type="date"
              value={formData.visibleFrom}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="visibleUntil" sx={{ mb: 1 }}>
              Visible Until
            </InputLabel>
            <TextField
              id="visibleUntil"
              name="visibleUntil"
              type="date"
              value={formData.visibleUntil}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="https://example.com/image.jpg"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              multiline
              rows={6}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Link URL"
              name="linkUrl"
              value={formData.linkUrl}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="https://example.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Link Text"
              name="linkText"
              value={formData.linkText}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Learn More"
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 28 }} disabled={loading}>
          Cancel
        </Button>
        <MotionButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.title || !formData.content}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            borderRadius: 28,
            px: 4,
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {announcement ? "Save Changes" : "Create Announcement"}
        </MotionButton>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementForm;
