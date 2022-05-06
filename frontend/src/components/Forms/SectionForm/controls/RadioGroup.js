import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  radioBtn: {
    "&.MuiRadio-root": {},
    "&.MuiRadio-root.Mui-checked": {
      color: "#732d40",
    },
  },
  radioLabel: {
    "&.MuiFormLabel-root.Mui-focused": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
});

export default function CustomRadioGroup(props) {
  const { name, label, value, handleChange, items } = props;
  const classes = useStyles();
  return (
    <FormControl>
      <FormLabel
        id="radio-buttons-meeting-periods"
        className={classes.radioLabel}
      >
        {label}
      </FormLabel>
      <RadioGroup
        aria-labelledby="radio-buttons-meeting-periods"
        name={name}
        value={value}
        onChange={handleChange}
        row
      >
        {items.map((item) => {
          return (
            <FormControlLabel
              value={item.id}
              label={item.title}
              control={<Radio className={classes.radioBtn} />}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
