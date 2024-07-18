import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

const styleInput = {
  padding: "0.4rem 1rem 0.4rem 0",
  boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)", // Adjust boxShadow as needed
};

const MultiSelectComponent = ({ control, name, label, options }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple
          options={options}
          value={field.id}
          onChange={(e, value) => field.onChange(value)}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
            //   label={label}
              InputProps={{
                style: {...styleInput},
                autoComplete: "off" // Disable autoComplete
              }}
              placeholder={label}
              {...params}
            />
          )}
        />
      )}
    />
  );
};

export default MultiSelectComponent;
