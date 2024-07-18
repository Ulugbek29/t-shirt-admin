import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";

const formControlLabelStyle = {
  "& .MuiFormControlLabel-label": {
    fontSize: "1rem",
    fontWeight: "600",
  },
};

const Switcher = ({ name, control, defaultValue, label, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <>
          <FormControlLabel
            sx={{ ...formControlLabelStyle }}
            control={<Switch {...field}  {...props} />}
            label={label}
            labelPlacement="end"
          />
        </>
      )}
    />
  );
};

export default Switcher;
