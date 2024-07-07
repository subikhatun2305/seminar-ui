import React from 'react';
import { Box, IconButton } from '@mui/material';

const FloatingButton = ({ options, bottomOffset, onButtonClick }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0, // Set bottom to 0 to show the button at the bottom of the screen
                right: '2px',
                display: 'flex',
                padding: "5px",
                flexDirection: 'column',
                gap: '10px',
                marginTop: "10px"
                // marginBottom: "20px",
            }}
        >
            {options.map((option) => (
                <IconButton
                    key={option.label}
                    onClick={() => onButtonClick(option.label)}
                    color="primary"
                    sx={{
                        backgroundColor: '#0075a8',
                        color: 'white',
                        boxShadow: 3,
                        '&:hover': {
                            backgroundColor: '#0075a8',
                        },
                        '&::after': {
                            content: '""',
                            display: 'block',
                            width: '100%',
                            height: '2px',
                        },
                    }}
                >
                    {option.icon}
                </IconButton>
            ))}
        </Box>
    );
};

export default FloatingButton;
