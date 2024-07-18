import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CSelect = ({
  value,
  onChange = () => {},
  width,
  style,
  label,
  options,
  id,
  variant,
  required,
  error,
  helperText,
  ...props
}) => {
  const defaultStyle = {
    width: "120px",
  };

  return (
    <FormControl style={style ? style : defaultStyle}>
      <InputLabel
        required={required}
        size="small"
        id={"CSelect-" + id + "-label"}
      >
        {label}
      </InputLabel>
      <Select
        labelId={"CSelect-" + id + "-label"}
        value={value}
        label={label}
        onChange={onChange}
        variant={variant}
        error={error}
        style={{ width }}
        size="small"
        {...props}
      >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
        {options?.map((option, index) => (
            <MenuItem
              key={index}
              value={option}
            >
              {option.name}
            </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CSelect;
