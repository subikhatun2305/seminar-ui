import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function CustomCheckbox({ label, checked, onChange }) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            }
            label={label}
        />
    );
}

export default CustomCheckbox;
