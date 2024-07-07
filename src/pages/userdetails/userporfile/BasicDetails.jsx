import { Grid, Typography, Box, Divider, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/Actions';

const BasicDetails = () => {
    const dispatch = useDispatch();

    // Access the correct slice of the state
    const { loading, user, error } = useSelector(state => state.userDetails);

    useEffect(() => {
        dispatch(getUserDetails()).then(data => {
            console.log("Fetched User Data:", data);
        });
    }, [dispatch]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="body1" color="error">{error}</Typography>;
    }

    // Check if user array is not empty and get the first user object
    const userData = Array.isArray(user) && user.length > 0 ? user[0] : null;

    if (!userData) {
        return <Typography variant="body1">No user data available.</Typography>;
    }

    return (
        <Box boxShadow={3} p={2} borderRadius={3} bgcolor="#ffffff">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Name:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.name || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Communication Name:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">....</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Employee ID:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.id || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Mobile No:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.mobile || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Email ID:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.email || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Department:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.department || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Username:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.username || userData.name || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Created On:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">{userData.createdAt || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="body1" fontSize="12px">Organization Name:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1" fontSize="12px">....</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default BasicDetails;
