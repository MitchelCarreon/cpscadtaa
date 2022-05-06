import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import Controls from "./SectionForm/controls/Controls";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles({
  dialogWrapper: {
    padding: "16px",
  },
  dialogTitle: {
    paddingRight: "0px",
  },
});

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props;

  const classes = useStyles();
  return (
    <Dialog
      open={openPopup}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: "1" }}>
            {title}
          </Typography>
          <Controls.ActionButton
            variant="contained"
            color="primary"
            handleClick={() => {
              setOpenPopup(false);
            }}
            tooltipTitle="Close"
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
