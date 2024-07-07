import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/Button';
import Autocmp from '../../components/AutoComplete';
import ReusableTabs from '../../components/Tabs';
import { Outlet } from 'react-router-dom';
import DatePickers from '../../components/DateRangePicker';
import colors from '../colors';

const data = [
    { name: 'Date 1', IN: 249, OUT: 150 },
];

const VisitorStatus = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [formData, setFormData] = useState({
        dateWise: null,
        fromDate: null,
        toDate: null
    });

    const location = useLocation();
    const navigate = useNavigate();

    const totalIn = data.reduce((acc, curr) => acc + curr.IN, 0);
    const totalOut = data.reduce((acc, curr) => acc + curr.OUT, 0);
    const totalSum = totalIn + totalOut;

    const tabs = [
        { label: 'Status', route: '/dashboard/visitorsstatus/status' },
        { label: 'Purpose', route: '/dashboard/visitorsstatus/purpose' },
        { label: 'Department', route: '/dashboard/visitorsstatus/department' },
    ];

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        navigate(tabs[newValue].route);
    };

    const dateOptions = [
        { label: "Date Wise", value: "dateWise" },
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
        { label: "Weekly", value: "weekly" },
        { label: "Yearly", value: "yearly" },
    ];

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => ({ ...prevValues, [name]: value }));
    };

    return (
        <>
            {location.pathname === '/dashboard/visitorsstatus' && <Navigate to="/dashboard/visitorsstatus/status" replace />}
            <Grid container spacing={1}  >
                <Grid item lg={4} md={4} sm={6} xs={6}>
                    <Autocmp
                        name="dateWise"
                        size="small"
                        label="Date Wise"
                        // variant="standard"
                        value={formData.dateWise}
                        options={dateOptions}
                        onChange={(e, value) => handleChange('dateWise', value)}

                    />
                    <Box display="flex" gap="5px" mt="8px">
                        <DatePickers
                            label="From Date"
                            name="fromDate"
                            placeholder="From Date"
                            value={formData.fromDate}
                            handleInputChange={handleInputChange}
                        />
                        <DatePickers
                            label="To Date"
                            name="fromDate"
                            placeholder="To Date"
                            value={formData.toDate}
                            handleInputChange={handleInputChange}
                        />
                    </Box>
                </Grid>
                <Grid item lg={5} md={5} sm={6} xs={6}>
                    <Box mt="62px">
                        <ButtonComponent
                            name="Search"
                            variant="contained"
                            backgroundColor={colors.navbar}
                            size="medium"
                            style={{ marginLeft: "10px", fontSize: "15px", borderRadius: "8px" }}
                        // style={{ fontSize: '14px', padding: '8px 16px' }}
                        />
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: "20px" }}>
                    <Box backgroundColor={colors.navbar} display="flex" justifyContent="center" alignItems="center" gap="30px">
                        <ReusableTabs
                            onChange={handleTabChange}
                            tabs={tabs}
                            selectedTab={selectedTab}
                        />
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                    <Box marginTop="5px">
                        <Outlet />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default VisitorStatus;
