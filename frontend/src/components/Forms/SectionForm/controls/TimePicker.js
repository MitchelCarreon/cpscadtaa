import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";

const convertToEvent = (name, value) => ({
  target: {
    name,
    value,
  },
});

export default function TimePicker(props) {
  const { name, label, value, handleChange, ...others } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiTimePicker
        name={name}
        label={label}
        value={value}
        onChange={(date) => handleChange(convertToEvent(name, date))}
        renderInput={(params) => <TextField {...params} />}
        {...others}
      />
    </LocalizationProvider>
  );
}
