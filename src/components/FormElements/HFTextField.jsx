import { TextField, FormHelperText, styled } from "@mui/material";
import { Controller } from "react-hook-form";

// const StyledTextField = styled(TextField) (
//   ({theme})=> `
//   // padding: 0.4rem 1rem;
//   box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
//   `
// )

const styleInput = {
  padding: "0.4rem 1rem 0.4rem 0",
  boxShadow:"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"
};

const HFTextField = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  placeholder,
  rules = {},
  inputStyle,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <TextField
            size="small"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            name={name}
            error={error}
            color="primary"
            InputProps={{
              style: {...styleInput, ...inputStyle},
              autoComplete: "off" // Disable autoComplete
            }}
            // helperText={!disabledHelperText && (error?.message ?? ' ')}
            {...props}
          />
          {!disabledHelperText && (
            <FormHelperText error>{error?.message ?? " "}</FormHelperText>
          )}
        </div>
      )}
    ></Controller>
  );
};

export default HFTextField;
