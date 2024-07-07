import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ThisMonthVisitor = () => {
    return (
        <Grid container spacing={3}>
            <Grid item lg={4} md={4} sm={6} xs={12}>
                <Box display="flex" justifyContent="center">
                    <Paper elevation={3} style={{ width: "400px", height: "200px", backgroundColor: "#473810" }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            <PeopleIcon style={{ fontSize: 30, color: 'white' }} />
                            <Typography variant="h5" textAlign="center" color="white" fontSize="15px">Total Visitor</Typography>
                            <Typography variant="h6" textAlign="center" color="white" fontSize="15px">12</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={12}>
                <Box display="flex" justifyContent="center">
                    <Paper elevation={3} style={{ width: "400px", height: "200px", backgroundColor: "#033E3E" }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            <ExitToAppIcon style={{ fontSize: 30, color: 'white' }} />
                            <Typography variant="h5" textAlign="center" color="white" fontSize="15px">Visitor Out</Typography>
                            <Typography variant="h6" textAlign="center" color="white" fontSize="15px">2</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={12}>
                <Box display="flex" justifyContent="center">
                    <Paper elevation={3} style={{ width: "400px", height: "200px", backgroundColor: "#254117" }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            <PersonAddIcon style={{ fontSize: 30, color: 'white' }} />
                            <Typography variant="h5" textAlign="center" color="white" fontSize="15px">Visitor In</Typography>
                            <Typography variant="h6" textAlign="center" color="white" fontSize="15px">10</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
}

export default ThisMonthVisitor;
