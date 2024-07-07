import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth_api } from '../../Api/Api';
import Cookies from 'js-cookie';
import { Typography } from '@mui/material';

export default function SignUpSide() {
    

     

    return (
        <>
            <ToastContainer />
            <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={7}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        backgroundColor: "rgb(240,242,245)"
                    }}
                >
                    <Box>
                        <Box mb="30px" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                            <img src="/jbmlogo.png" alt="JBM Logo" style={{ width: "30%" }} />
                            <Typography variant='h5' mt="20px" fontWeight="bold" color="rgb(9,90,163)">
                                VISITOR ALERT MANAGEMENT SYSTEM
                            </Typography>
                        </Box>
                        <Box mt="30px" style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <Typography>
                                For any help or assistance please reach out to
                                <Link href="https://dreamsol.biz/contact/" target="_blank" style={{ cursor: "pointer", fontWeight: "bold" }}> DreamSol</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} square sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                    <Card sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", boxShadow: 3 }}>
                        <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box mb="30px" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                <Typography variant='h5' mt="20px" fontWeight="bold" color="rgb(9,90,163)">
                                    SIGN UP
                                </Typography>
                            </Box>
                            <Box component="form"   sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name" variant='standard'
                                size='small'
                                autoComplete="name"
                                autoFocus
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                margin="normal"
                                // required
                                fullWidth
                                id="email"size='small'
                                label="Email Address" variant='standard'
                                name="email"
                                autoComplete="email"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                margin="normal"
                                // required
                                fullWidth
                                name="password"
                                label="Password"size='small' variant='standard'
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit"size='small'
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                   
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}