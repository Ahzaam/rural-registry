import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Box, Paper, Typography, Tooltip, Alert, Stack } from "@mui/material";
import { Download as DownloadIcon, ContentCopy as CopyIcon, Check as CheckIcon } from "@mui/icons-material";
import { Family } from "../../types/types";
import { motion } from "framer-motion";
import AnimatedButton from "../common/AnimatedButton";
import { generateProfileToken } from "../../services/profileLinkService";

interface QRCodeDisplayProps {
  family: Family;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ family }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const familyCode = `${family.homeId}-${family.id}`;
  const baseUrl = `${window.location.origin}`;
  const verifyUrl = generatedToken ? `${baseUrl}/verify/${generatedToken}` : null;

  const handleDownload = async () => {
    setIsDownloading(true);
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `family-${familyCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    setIsDownloading(false);
  };

  const handleCopy = async () => {
    if (!verifyUrl) return;

    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setError(null);
      setGenerating(true);
      console.log("Generating profile token for family:", {
        familyId: family.id,
        contact: family.headOfFamily.contact,
      });
      const token = await generateProfileToken(family.id, family.headOfFamily.contact!, family.headOfFamily.nic);
      console.log("Token generated successfully:", token);
      setGeneratedToken(token);
    } catch (err) {
      console.error("Error generating profile link:", err);
      setError(err instanceof Error ? err.message : "Failed to generate profile link");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Paper elevation={0} className="overflow-hidden rounded-xl border border-gray-200">
      <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <Typography variant="h6" className="font-medium text-gray-800">
          Family Profile Access
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <QRCodeSVG value={familyCode} size={200} level="H" includeMargin className="mx-auto" />
            <Typography variant="subtitle2" sx={{ mt: 2, color: "#86868b" }}>
              Family Code: {familyCode}
            </Typography>
          </Box>

          <Box>
            <AnimatedButton
              fullWidth
              variant="outlined"
              onClick={handleGenerateLink}
              loading={generating}
              sx={{
                borderColor: "#0070c9",
                color: "#0070c9",
                borderRadius: "12px",
                py: 1.5,
                "&:hover": {
                  borderColor: "#005ea3",
                  backgroundColor: "rgba(0, 112, 201, 0.04)",
                },
              }}
            >
              Generate Profile Link
            </AnimatedButton>

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
                {error}
              </Alert>
            )}

            {verifyUrl && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: "12px",
                    borderColor: "rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1d1d1f",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {verifyUrl}
                  </Typography>
                  <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                    <AnimatedButton
                      size="small"
                      onClick={handleCopy}
                      sx={{
                        minWidth: "unset",
                        color: copied ? "#34c759" : "#0070c9",
                      }}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </AnimatedButton>
                  </Tooltip>
                </Paper>
              </motion.div>
            )}
          </Box>

          <AnimatedButton
            fullWidth
            variant="contained"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            loading={isDownloading}
            sx={{
              bgcolor: "#0070c9",
              borderRadius: "12px",
              py: 1.5,
              "&:hover": {
                bgcolor: "#005ea3",
              },
            }}
          >
            Download QR Code
          </AnimatedButton>
        </Stack>
      </Box>
    </Paper>
  );
};

export default QRCodeDisplay;
