import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import CustomCheckbox from '../../../components/CheckBox';
import colors from '../../colors';

const ResetPassword = () => {

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        mail: true,
        sms: true
    });

    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClickShowPassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };
    const styles = {
        navbar: {
            backgroundColor: colors.navbar,
            color: '#fff',
            padding: '10px',
        },
        resetButton: {
            backgroundColor: colors.resetButtonBackground,
            color: colors.resetButtonColor,
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    const validate = (values) => {
        const errors = {};
        if (!values.oldPassword) {
            errors.oldPassword = "Old Password is required";
        }
        if (!values.newPassword) {
            errors.newPassword = "New Password is required";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "Confirm Password is required";
        }
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validate(formData);

        if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log('Form data before submission:', formData);
            toast.success("Password has been changed successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: 'rgb(60,86,91)',
                    color: "#0075a8"
                },
            });
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                mail: false,
                sms: false
            });
        } else {
            toast.error("Validation Error! Please check the form for errors.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: 'rgb(60,86,91)',
                    color: "#0075a8"
                },
            });
        }
    };

    return (
        <>
            <ToastContainer style={{ marginTop: '45px' }} />
            <Box boxShadow={3} p={2} borderRadius={3} width="100%">
                <Grid container spacing={1}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box>
                            <TextField
                                placeholder="Old Password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                label="Old Password"
                                required
                                size="small"

                                type={showPassword.oldPassword ? "text" : "password"}
                                error={!!formErrors.oldPassword}
                                helperText={formErrors.oldPassword}
                                InputLabelProps={{
                                    style: { color: 'black', fontSize: "12px" }
                                }}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('oldPassword')}
                                                edge="end"
                                            >
                                                {showPassword.oldPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'red',
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box>
                            <TextField
                                placeholder="New Password"
                                name="newPassword"
                                value={formData.newPassword}
                                label="New Password"
                                required
                                size="small"

                                type={showPassword.newPassword ? "text" : "password"}
                                error={!!formErrors.newPassword}
                                helperText={formErrors.newPassword}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                InputLabelProps={{
                                    style: { color: 'black', fontSize: "12px" }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('newPassword')}
                                                edge="end"
                                            >
                                                {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'red',
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box>
                            <TextField
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                label="Confirm Password"
                                required
                                size="small"

                                InputLabelProps={{
                                    style: { color: 'black', fontSize: "12px" }
                                }}
                                type={showPassword.confirmPassword ? "text" : "password"}
                                error={!!formErrors.confirmPassword}
                                helperText={formErrors.confirmPassword}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('confirmPassword')}
                                                edge="end"
                                            >
                                                {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'red',
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box>
                            {/* <FormControlLabel
                                control={<Checkbox checked={formData.mail} onChange={(e) => handleChange('mail', e.target.checked)} />}
                                label="Mail"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.sms} onChange={(e) => handleChange('sms', e.target.checked)} />}
                                label="SMS"
                            /> */}
                            <CustomCheckbox
                                label="Mail"
                                checked={formData.mail} onChange={(e) => handleChange('mail', e.target.checked)}
                            />
                            <CustomCheckbox
                                label="SMS"
                                checked={formData.sms} onChange={(e) => handleChange('sms', e.target.checked)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                backgroundColor={colors.navbar}
                                style={{ fontSize: "10px" }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default ResetPassword;
