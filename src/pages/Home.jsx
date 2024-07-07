import React, { useState, useEffect } from 'react';
import { Box, FormControl, Grid } from '@mui/material';
import { NavLink, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import ButtonComponent from '../components/Button';
import ReusableTabs from '../components/Tabs';
import DatePickers from '../components/DateRangePicker';
import './page.css';
import colors from './colors';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const defaultButton = location.pathname.split('/').pop() || 'today';
    const [activeButton, setActiveButton] = useState(defaultButton);
    const [selectedTab, setSelectedTab] = useState(0);
    const [formValues, setFormValues] = useState({ fromDate: null, toDate: null });

    useEffect(() => {
        if (location.pathname === '/home') {
            setActiveButton('today');
        } else {
            setActiveButton(location.pathname.split('/').pop());
        }
    }, [location]);

    const tabs = [
        { label: 'Today', route: '/home/today' },
        { label: 'This Week', route: '/home/week' },
        { label: 'This Month', route: '/home/month' }
    ];

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        navigate(tabs[newValue].route);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
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
            {location.pathname === '/home' && <Navigate to="/home/today" replace />}

            <Box justifyContent="center" alignItems="center">
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box backgroundColor={colors.navbar} display="flex">
                            <ReusableTabs
                                onChange={handleTabChange}
                                tabs={tabs}
                                selectedTab={selectedTab}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box display="flex" gap="5px">
                            <DatePickers
                                label="From Date"
                                name="fromDate"
                                placeholder="From Date"
                                selectedDate={formValues.fromDate}
                                handleInputChange={handleInputChange}
                                dateFormat="yyyy/MM/dd"
                            />
                            <DatePickers
                                label="To Date"
                                name="toDate"
                                placeholder="To Date"
                                selectedDate={formValues.toDate}
                                handleInputChange={handleInputChange}
                                dateFormat="yyyy/MM/dd"
                            />
                            {/* <ButtonComponent
                                name="Show Visitors"
                                size="medium"
                                variant="contained"
                                backgroundColor={colors.navbar}
                                style={{ fontSize: "12px", marginTop: "5px" }}
                            /> */}

                        </Box>

                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12} >
                        <Box >
                            <FormControl fullWidth>
                                <ButtonComponent
                                    name="Show Visitors"
                                    size="small"
                                    variant="contained"
                                    backgroundColor={colors.navbar}
                                    style={{ fontSize: "12px", marginTop: "5px", width: "100px" }}
                                />
                            </FormControl>
                        </Box>
                    </Grid>

                </Grid>
                <Box marginTop="30px">
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}

export default Home;
