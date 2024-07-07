import React from 'react';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';

const ButtonComponent = ({ name, size, color, onClick, style, variant, fullWidth }) => {
    return (
        <FormControl>
            <Button
                variant={variant}
                size={size}
                color={color}
                onClick={onClick}
                style={style}

                sx={{ textTransform: "none" }}
                fullWidth={fullWidth}
            >
                {name}
            </Button>

        </FormControl>
    );
};

export default ButtonComponent;
