
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, FormControl, IconButton, Tooltip, SwipeableDrawer, Divider } from '@mui/material';
import Texxt from '../../components/Textfield';
import ReusableDatePicker from '../../components/DateRangePicker';
import ButtonComponent from '../../components/Button';
import ReusablePieChart from '../../components/PieChart';
import Autocmp from '../../components/AutoComplete';
import CustomDataTable from '../../components/ReactDataTable';
import { getAllVisitors, downloadExcelPurposeData } from '../../Api/Api';
import axios from 'axios';
import { SaveAlt, FileCopy, Add, ExitToApp, Print } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FloatingButton from '../../components/FloatingButton';
import ReusableTabs from '../../components/Tabs';
import { Outlet, useNavigate } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
import DatePickers from '../../components/DateRangePicker';
import colors from '../colors';
import axiosInstance from '../../components/Auth';
import { toast, ToastContainer } from "react-toastify";

const data1 = [
    { label: 'IN', value: 200, color: '#0088FE' },
    { label: 'Total', value: 300, color: '#00C49F' },
];

const data = [
    { label: 'IN', value: 200, color: '#0088FE' },
    { label: 'Total', value: 300, color: '#00C49F' },
];

const VisitorActivity = () => {

    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [visitorsData, setVisitorsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();
    const [formData, setFormValues] = useState({
        dateWise: null,
        fromDate: null,
        toDate: null
    });
    const [selectedRows, setSelectedRows] = useState([]);

    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };
    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const columns = [
        {
            name: 'Select',
            selector: 'select',
            cell: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleRowSelected(row)} />,
            sortable: false,
        },
        {
            name: 'Visitor Name',
            selector: row => row.visitorName, sortable: true
        },
        { name: 'Visitor Company', selector: row => row.visitorCompany, sortable: true },
        { name: 'Visitor Address', selector: row => row.visitorAddress, sortable: true },
        { name: 'Driver Name', selector: row => row.driverName, sortable: true },
        { name: 'Purpose', selector: row => row.purpose.purposeFor, sortable: true },
        { name: 'Exp Date', selector: row => row.expDate, sortable: true },
        { name: 'Employee Mobile', selector: row => row.user.mobile, sortable: true },
        { name: 'Department', selector: row => row.department.departmentName, sortable: true },
        { name: 'Time In', selector: row => row.createdAt, sortable: true },
        { name: 'possessionAllowed', selector: row => row.possessionAllowed, sortable: true },
        { name: 'Visitor CardNumber', selector: row => row.visitorCardNumber, sortable: true },
        { name: 'Visitor Card Number', selector: row => row.visitorCardNumber, sortable: true },
        { name: 'Vehicle Number', selector: row => row.vehicleNumber, sortable: true },
        { name: 'laptop', selector: row => row.laptop, sortable: true },



        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },
        // { name: 'unitId', selector: row => row.unitId, sortable: true },
    ];

    const handleRowSelected = (row) => {
        const updatedData = filteredData.map((item) =>
            item === row ? { ...item, selected: !item.selected } : item
        );
        setFilteredData(updatedData);
        setSelectedRows(updatedData.filter((item) => item.selected));
    };
    const floatingActionButtonOptions = [
        { label: 'Visitor Entry', icon: <Add title="Visitor Entry" /> },
        { label: 'Visitor Exit', icon: <ExitToApp title="Visitor Exit" /> },
        { label: 'Re-print', icon: <Print title="Re-print" /> }
    ];
    const tabs = [
        { label: 'Add Instant Visitors', route: '/visitor/visitoractivity' },
        { label: 'Add Pre Visitors', route: '/visitor/visitoractivity/addprevisitors' }
    ];
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

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(getAllVisitors);
            setVisitorsData(response.data.content);
            setFilteredData(response.data.content);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    console.log(visitorsData, "1");
    console.log(filteredData, "2");
    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (searchText) => {
        const filtered = visitorsData.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };



    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadExcelPurposeData, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Visitors.xlsx');

            toast.success("Visitors data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading Visitors data:', error.message);
            toast.error("Error downloading Visitors data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const copyTableData = () => {
        const dataString = filteredData.map(item => Object.values(item).join('\t')).join('\n');
        navigator.clipboard.writeText(dataString);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        navigate(tabs[newValue].route);
    };

    const handleAutocompleteChange = (value) => {
        console.log("Selected value:", value);
        // Handle the selected value here
    };


    const addInstantVisitors = (
        <Box component="form" sx={{ mt: "63px", }}>
            {/* <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon />
                </IconButton>
            </Box> */}
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" justifyContent="space-between" style={{ marginLeft: "10px" }}>
                    <Typography variant="h5">ADD VISITORS</Typography>
                    <IconButton onClick={handleCloseDrawer}>
                        <CloseIcon style={{ color: "black" }} />
                    </IconButton>
                </Box>
            </Grid> */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar}  >
                    <ReusableTabs
                        tabs={tabs}
                        selectedTab={selectedTab}
                        onChange={handleTabChange}
                    />
                    <IconButton onClick={handleCloseDrawer}>
                        <CloseIcon style={{ color: "white" }} />
                    </IconButton>
                </Box>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box>
                    <Outlet />
                </Box>
            </Grid>


        </Box>

    );

    const handleFormClick = () => {
        setOpen(true);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };


    return (
        <>
            <ToastContainer style={{ marginTop: "45px" }} />
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                <Box sx={{ width: '600px' }}>
                    {addInstantVisitors}
                </Box>

            </SwipeableDrawer>

            <Box backgroundColor={colors.navbar}>
                <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Visitors Activity</Typography>
                {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
            </Box>

            <Grid container spacing={1}>
                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box display="flex">
                        <Typography variant="h5">Visitors Activity</Typography>
                    </Box>
                    <hr width="100%" />
                </Grid> */}

                <Grid item lg={4} md={4} sm={12} xs={12} style={{ marginTop: "8px" }}>
                    <Box  >
                        <Box >
                            <Texxt placeholder="Enter Data" label="Search Visitors Activity" size="small" fullWidth onChange={(e) => handleSearch(e.target.value)} />
                        </Box>

                        <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                            {/* <ReusableDatePicker label="From Date" />
                            <ReusableDatePicker label="To Date" /> */}
                            <DatePickers
                                label="From Date"
                                // name="fromDate"
                                placeholder="From Date"
                                value={formData.fromDate}
                                handleInputChange={handleInputChange}
                            />
                            <DatePickers
                                label="To Date"
                                // name="fromDate"
                                placeholder="To Date"
                                value={formData.toDate}
                                handleInputChange={handleInputChange}
                            />
                        </Box>
                        {showMoreFilters && (
                            <>
                                <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                                    <FormControl fullWidth>
                                        <Autocmp size="small" label="In" options={data}
                                            onChange={(event, value) => handleAutocompleteChange(value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <Autocmp size="small" label="Purpose" options={data}
                                            onChange={(event, value) => handleAutocompleteChange(value)}
                                        />
                                    </FormControl>
                                </Box>
                                <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                                    <FormControl fullWidth>
                                        <Autocmp size="small" label="Request Status" options={data}
                                            onChange={(event, value) => handleAutocompleteChange(value)}
                                        />
                                    </FormControl>
                                </Box>
                            </>
                        )}
                        <Box style={{ gap: "10px", marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                            <ButtonComponent backgroundColor={colors.navbar} style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none", p: '4px', color: "white" }}
                                name="Submit" size="small"
                                variant="contained"
                            />
                            <ButtonComponent
                                // style={{ backgroundColor: "rgb(60,86,91)", color: "white" }}
                                name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                onClick={handleMoreFiltersClick}
                                size="small"
                                variant="contained"
                                backgroundColor={colors.navbar}
                                style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none", p: '4px', color: "white" }}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center"  >
                        <ReusablePieChart data={data1} outerRadius={80} width={200} height={200} legendHidden={false} />
                    </Box>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Box mt="10px">
                        <Box display="flex" flexDirection="row" gap="20px">
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="center" alignItems="center" backgroundColor="#413839" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px" >Visitors in</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#AA6C39" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Visitor out</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="rgb(37,65,23)" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Total visitors</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" gap="20px" mt="20px">
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="rgb(71,56,16)" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Pending</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="rgb(3,62,62)" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Approved</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#FF4500" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Rejected</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" bgcolor={colors.navbar}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" variant="h10" color="white">Filtered By : </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            columns={columns}
                            data={filteredData}
                            downloadEnabled={true}
                            copyEnabled={true}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}
                            onDownloadXLSX={handleDownloadXLSX}
                        />
                    </Box>
                </Grid>
                <FloatingButton options={floatingActionButtonOptions} bottomOffset="100px" onButtonClick={handleFormClick} />
            </Grid>

        </>
    );
};

export default VisitorActivity;

