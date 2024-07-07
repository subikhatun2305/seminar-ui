import * as React from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { FormControl, TextField } from '@mui/material';

export default function DatePickers({ name, selectedDate, handleInputChange, placeholder, label }) {
    const handleDateChange = (date) => {
        // Convert date to the desired format if necessary
        handleInputChange({ target: { name, value: date ? date.toISOString() : null } });
    };

    return (
        <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                    <DemoItem>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            label={label}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                },
                                field: { clearable: true, onClear: () => handleDateChange(null) },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    placeholder={placeholder}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </DemoItem>
                </Box>
            </LocalizationProvider>
        </FormControl>
    );
}
