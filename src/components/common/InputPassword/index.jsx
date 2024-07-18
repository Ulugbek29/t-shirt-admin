import cls from "./style.module.scss";
import { FormHelperText, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const styleInput = {
  padding: "0.4rem 0.5rem 0.4rem 0",
  boxShadow:
    "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
};

export default function index({
  control,
  name,
  title,
  disableHelperText = false,
  required = false,
  rules = {},
  inputStyle,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <div className={cls.input_box}>
            <TextField
              size="small"
              name={name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              error={error}
              type={showPassword ? "text" : "password"}
              InputProps={{
                style: { ...styleInput, ...inputStyle },
                endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                </IconButton>
              </InputAdornment>
              }}
              {...props}
              
              
            />
            {!disableHelperText && (
              <FormHelperText error>
                {error?.message ? error?.message : ""}
              </FormHelperText>
            )}
          </div>
        </>
      )}
    ></Controller>
  );
}
