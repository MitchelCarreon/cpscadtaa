import React from "react";
import { makeStyles } from "@mui/styles";
import { Button as MuiButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

export default function Button(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: "0 !important",
    },
    //   secondary: {
    //     backgroundColor: theme.palette.secondary.light,
    //     "& .MuiButton-label": {
    //       color: theme.palette.secondary.main,
    //     },
    //   },
    primary: {
      "&.MuiButton-contained": {
        backgroundColor: "#732d40 !important",
        color: "#FFF !important",
      },
      "&.MuiButton-contained:hover": {
        // backgroundColor: "#73142d",
        backgroundColor: "#662839 !important",
      },
      "&.MuiButton-text": {
        backgroundColor: "none",
        color: "#000",
      },
    },
  });

  const classes = useStyles();
  const { variant, text, handleClick, color, ...otherProps } = props;
  return (
    <MuiButton
      variant={variant}
      // className={classes.formBtnStyle}
      className={`${classes.root} ${classes[color]}`}
      size="medium"
      onClick={handleClick}
      {...otherProps}
    >
      {text}
    </MuiButton>
  );
}
