import styles from "./style.module.scss"
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from "@mui/material"
import { Controller } from "react-hook-form"


const StyledSelect = styled(Select) (
  ({theme})=> `
  padding: 0.4rem 1rem 0.4rem 0rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  `
)


const HFSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required=false,
  rules={},
  ...props
}) => {
  // console.log(options)
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{ required: required ? 'This is required field' : false, ...rules }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl style={{ width }}>
          <InputLabel size="small">{label}</InputLabel>
          <StyledSelect
            value={value || ""}
            label={label}
            size="small"
            error={error}
            inputProps={{ placeholder }}
            fullWidth
            onChange={(e) => {
              onChange(e.target.value)
            }}
            {...props}
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
          {!disabledHelperText && (
            <FormHelperText className={styles.FormHelperText} error>{error?.message ?? ' '}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  )
}

export default HFSelect
