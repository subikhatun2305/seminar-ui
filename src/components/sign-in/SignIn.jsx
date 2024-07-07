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

export default function SignInSide() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));

        let error = '';
        if (value.trim() === '') {
            error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (name === 'email' && !validateEmail(value)) {
            error = 'Invalid email address';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (errors.email || errors.password) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            const response = await fetch(`${auth_api}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store tokens in cookies
                Cookies.set('token', data.accessToken);
                Cookies.set('refreshToken', data.refreshToken);
                navigate("/home/today");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An unexpected error occurred");
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                                    SIGN IN
                                </Typography>
                            </Box>
                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    size="small"
                                    variant='standard'
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="password"
                                    label="Password"
                                    variant='standard'
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, backgroundColor: "rgb(9,90,163)" }}
                                >
                                    Sign In
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            Forgot password?
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