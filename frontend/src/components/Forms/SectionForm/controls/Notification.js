import React from "react";
import { Alert, Snackbar } from "@mui/material";

export default function Notification(props) {
  const { notify, setNotify } = props;

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
          // intentionally empty. Stops user by closing notification by clicking anywhere on the page/window.
      }
    setNotify({ ...notify, isOpen: false });
  };

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}
