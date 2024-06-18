import { Button, Modal, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function ConfirmationModal({ question }) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
          Are you sure you want to post this review?
        </Typography>
        <Button variant="contained" sx={{ mr: 1 }} onClick={handleSubmitReview}>
          Submit
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
