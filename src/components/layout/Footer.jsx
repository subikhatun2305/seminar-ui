import React from 'react'
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <>
            <Box sx={{
                width: '100%',
                // position: 'fixed',
                bottom: 0,
                marginRight: "10px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                backgroundColor: '#f8f8f8',
            }}>
                <Typography variant="body1" color="textSecondary">
                    © 2024 Your DreamSol
                </Typography>
            </Box>
        </>
    )
}

export default Footer 
