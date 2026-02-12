"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
} from "@mui/material";
import { ContentCopy, Close, Check } from "@mui/icons-material";

interface TranscriptDialogProps {
  open: boolean;
  onClose: () => void;
  transcriptText: string;
  videoTitle?: string;
}

export function TranscriptDialog({
  open,
  onClose,
  transcriptText,
  videoTitle,
}: TranscriptDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(165deg, #0D1422 0%, #0A0F18 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 3,
            backdropFilter: "blur(20px)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                mb: 0.25,
              }}
            >
              Transcrição
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Copie e cole onde quiser.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "rgba(255,255,255,0.8)" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ pb: 0 }}>
          {videoTitle && (
            <Typography
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.68)",
                mb: 1.5,
                pb: 1.5,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {videoTitle}
            </Typography>
          )}

          {/* Transcript Box */}
          <Box
            sx={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2,
              p: 2,
              maxHeight: "400px",
              overflowY: "auto",
              fontFamily: "ui-monospace, Menlo, Monaco, monospace",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.85)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.15)",
                borderRadius: "4px",
                "&:hover": {
                  background: "rgba(255,255,255,0.25)",
                },
              },
            }}
          >
            {transcriptText}
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "rgba(255,255,255,0.6)",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              "&:hover": {
                background: "rgba(255,255,255,0.05)",
              },
            }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            startIcon={copied ? <Check /> : <ContentCopy />}
            onClick={handleCopy}
            disabled={copied}
            sx={{
              background: copied
                ? "rgba(76,175,80,0.85)"
                : "linear-gradient(135deg, #2DD4FF 0%, #2DD4FFDD 100%)",
              color: "#fff",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              px: 3,
              boxShadow: copied
                ? "0 4px 12px rgba(76,175,80,0.4)"
                : "0 4px 12px rgba(45,212,255,0.4)",
              "&:hover": {
                background: copied
                  ? "rgba(76,175,80,0.85)"
                  : "linear-gradient(135deg, #2DD4FFEE 0%, #2DD4FFCC 100%)",
                boxShadow: copied
                  ? "0 6px 16px rgba(76,175,80,0.5)"
                  : "0 6px 16px rgba(45,212,255,0.6)",
              },
              "&:disabled": {
                background: "rgba(76,175,80,0.85)",
                color: "#fff",
              },
              transition: "all 180ms ease",
            }}
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
