import React from "react";
import { TextField } from "@mui/material";

export default function Input(props) {
  const {
    label,
    name,
    value,
    handleChange,
    error = null,
    type = null,
    variant,
    ...others
  } = props;
  return (
    <TextField
      type={type}
      variant={variant}
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      {...others}
      {...(error && { error: true, helperText: error })}
    />
  );
}
