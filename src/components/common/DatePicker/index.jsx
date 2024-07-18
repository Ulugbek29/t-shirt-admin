import * as React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const today = dayjs();


export default function DateValidationShouldDisableMonth({ control, label, name }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
          <Controller
            name={name}
            control={control}
            // defaultValue={today}
            render={({ field: {onChange, value}, fieldState: {error} }) => (
              <DatePicker
                label={label}
                value={value ? dayjs(value) : null}
                onChange={(date) => onChange(dayjs(date))}
                renderInput={(params) => <TextField {...params} />}
                views={['year', 'month', 'day']}
              />
            )}
          />
        
      </div>
    </LocalizationProvider>
  );
}
