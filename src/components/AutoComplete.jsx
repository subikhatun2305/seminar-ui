import React from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const Autocmp = ({ name, label, size, style, required, options, multiple, variant, value, onChange }) => {
    return (
        <Autocomplete
            options={options}
            multiple={multiple}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant={variant}
                    style={style}
                    margin="dense"
                    required={required}
                    InputLabelProps={{ style: { color: 'black', fontSize: '12px' } }}
                    sx={{
                        '& .MuiInputLabel-asterisk': {
                            color: 'red', // Set the color of the asterisk to red
                        },
                    }}
                />
            )}
            size={size}
            value={value}
            onChange={(event, newValue) => onChange(event, newValue)}
        />
    );
};

export default Autocmp;
