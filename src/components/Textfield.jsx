import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

const Texxt = ({ name, size, label, type, variant, placeholder, required, multiline, rows, error, helperText, onChange, value }) => {
    return (
        <FormControl fullWidth>
            <TextField
                name={name}
                size={size}
                label={label}
                type={type}
                placeholder={placeholder}
                required={required}
                rows={rows}
                multiline={multiline}
                error={!!error}
                helperText={helperText}
                onChange={onChange}
                margin="dense"
                value={value}
                variant={variant}
                InputLabelProps={{
                    style: { color: 'black', fontSize: '12px' }
                }}
                sx={{
                    '& .MuiInputLabel-asterisk': {
                        color: 'red', // Set the color of the asterisk to red
                    },
                }}
            />
        </FormControl>
    );
};

export default Texxt;
