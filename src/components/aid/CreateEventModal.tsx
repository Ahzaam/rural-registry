import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AidEvent } from "../../types/types";

interface Props {
  onClose: () => void;
  onSubmit: (event: Omit<AidEvent, "id" | "createdAt" | "updatedAt">) => void;
}

export const CreateEventModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "distribution" as "distribution" | "collection",
    status: "planned" as const,
    items: [] as { name: string; quantity?: number; unit?: string }[],
    targetAmount: undefined as number | undefined,
  });

  const [currentItem, setCurrentItem] = useState({
    name: "",
    quantity: "",
    unit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: formData.type === "collection" ? formData.targetAmount : -1,
      date: new Date(formData.date),
    });
  };

  const handleAddItem = () => {
    if (currentItem.name) {
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            name: currentItem.name,
            quantity: currentItem.quantity ? Number(currentItem.quantity) : undefined,
            unit: currentItem.unit || undefined,
          },
        ],
      }));
      setCurrentItem({ name: "", quantity: "", unit: "" });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Create New Event
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Event Type
              </Typography>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "distribution" | "collection",
                    items: e.target.value === "collection" ? [] : prev.items,
                    targetAmount: e.target.value === "distribution" ? undefined : prev.targetAmount,
                  }))
                }
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="distribution">Distribution Event</MenuItem>
                <MenuItem value="collection">Collection Event</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            {formData.type === "collection" ? (
              <TextField
                label="Target Amount"
                type="number"
                required
                value={formData.targetAmount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetAmount: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            ) : (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Items
                </Typography>
                <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                  <TextField
                    placeholder="Item name"
                    size="small"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem((prev) => ({ ...prev, name: e.target.value }))}
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <TextField
                    placeholder="Quantity"
                    size="small"
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem((prev) => ({ ...prev, quantity: e.target.value }))}
                    sx={{
                      width: "100px",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <TextField
                    placeholder="Unit"
                    size="small"
                    value={currentItem.unit}
                    onChange={(e) => setCurrentItem((prev) => ({ ...prev, unit: e.target.value }))}
                    sx={{
                      width: "100px",
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <IconButton
                    onClick={handleAddItem}
                    color="primary"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: "12px",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.items.map((item, index) => (
                    <Chip
                      key={index}
                      label={`${item.name}${item.quantity ? ` (${item.quantity}${item.unit ? " " + item.unit : ""})` : ""}`}
                      onDelete={() => handleRemoveItem(index)}
                      sx={{ borderRadius: "12px" }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              borderColor: "grey.300",
              color: "grey.700",
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "12px",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Create Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
