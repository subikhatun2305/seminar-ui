import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import ReusableTabs from '../../../components/Tabs';
import '../../page.css';
import colors from '../../colors';

const UserProfile = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = [
        { label: 'Basic Details', route: '/userprofile' },
        { label: 'Edit User', route: '/userprofile/edituser' },
        { label: 'Reset Password', route: '/userprofile/resetpassword' },
    ];

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        navigate(tabs[newValue].route);
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

    return (
        <>
            <Box style={{ marginTop: "2px" }} justifyContent="center" alignItems="center">
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box backgroundColor={colors.navbar} style={{ marginTop: "-10px" }}>
                            <Typography style={{ marginLeft: "10px", color: "white" }}>My Profile</Typography>
                        </Box>
                        {/* <hr /> */}
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box boxShadow={3} p={3} borderRadius={3} bgcolor={colors.navbar} display="flex" justifyContent="center" alignItems="center">
                            <img src='https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=360' alt="User Profile" style={{ width: '100%', borderRadius: '50%' }} />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box bgcolor={colors.navbar} display="flex">
                            <ReusableTabs
                                onChange={handleTabChange}
                                tabs={tabs}
                                selectedTab={selectedTab}
                            />
                        </Box>
                        <Box marginTop="15px">
                            <Outlet />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default UserProfile;
