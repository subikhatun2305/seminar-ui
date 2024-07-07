import {
    Grid, FormControl, Box, IconButton, Typography, SwipeableDrawer
} from '@mui/material';
import React, { useState, useEffect } from 'react'
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import CustomDataTable from '../../components/ReactDataTable';
import axios from 'axios';
import { user_api } from '../../Api/Api';
import FloatingButton from '../../components/FloatingButton';
import ReusableRadioButton from '../../components/RadioButton';
import { toast, ToastContainer, POSITION } from 'react-toastify';
import Texxt from '../../components/Textfield';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Add, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DatePickers from '../../components/DateRangePicker';
import colors from './../colors';

const data = [
    { label: 'HR', value: 'hr' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Marketing', value: 'marketing' },
];




const UserFeedback = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);

    const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);


    const [formData, setFormData] = useState({
        visitorName: null,
        visitorMobile: null,
        visitorEmail: '',
        visitorOrganization: null,
        purpose: null,
        address: "",
        possessionAllowed: '',
        confrenceRoom: '',
        laptop: '',
        notifyEmployee: []
    });

    const [time, setTime] = useState(null);

    const handleTimeChange = (newTime) => {
        setTime(newTime);
    };

    const floatingActionButtonOptions = selectedRows.length === 0 ? [
        { label: 'Add', icon: <Add /> },
    ] : selectedRows.length === 1 ? [
        { label: 'Edit', icon: <EditIcon /> },
        { label: 'Delete', icon: <DeleteIcon /> },
    ] : [
        { label: 'Delete', icon: <DeleteIcon /> },
    ];

    const columns = [
        {
            name: 'Select',
            selector: 'select',
            cell: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleRowSelected(row)} />,
            sortable: false,
        },
        { name: 'name', selector: row => row.name, sortable: true },
        { name: 'email', selector: row => row.email, sortable: true },
        { name: 'number', selector: row => row.number, sortable: true },
        { name: 'address', selector: row => row.address, sortable: true },
        { name: 'department', selector: row => row.department, sortable: true },
        { name: 'number', selector: row => row.number, sortable: true },
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

    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(user_api);
            setVisitorsData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    const handleRowSelected = (row) => {
        const updatedData = filteredData.map((item) =>
            item === row ? { ...item, selected: !item.selected } : item
        );
        setFilteredData(updatedData);
        setSelectedRows(updatedData.filter(item => item.selected));
    };

    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    // const handleExtendedPassRequestChange = (event) => {
    //     setIsExtendedPassRequestChecked(event.target.checked);
    // };

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.visitorOrganization) formErrors.visitorOrganization = 'Visitor Organization is required';
        if (!formData.visitorName) formErrors.visitorName = 'Visitor Name is required';
        if (!formData.visitorMobile) formErrors.visitorMobile = 'Visitor Mobile No is required';
        // if (!formData.visitorEmail) formErrors.visitorEmail = 'Visitor Email is required';
        if (!formData.purpose) formErrors.purpose = 'Purpose of Meeting is required';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            console.log(formData, "Data");
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    backgroundColor: 'rgb(60,86,91)',
                    color: "white",
                },
            });
        } else {
            console.log("Validation Failed");
            toast.error("Validation Error! Please check the form for errors.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    backgroundColor: 'rgb(60,86,91)',
                    color: "white",
                },
            });
        }
    };

    const handleCopy = () => {
        const dataString = filteredData.map(row => Object.values(row).join('\t')).join('\n');
        navigator.clipboard.writeText(dataString);
        toast.success("Table data copied successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                backgroundColor: 'rgb(60,86,91)',
            },
        });
    };

    const handleDownloadXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");
        const wbout = XLSX.write(wb, { type: 'array', bookType: "xlsx" }); // Changed to 'array'
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const fileName = 'table_data.xlsx';
        saveAs(blob, fileName);
        toast.success("Table data downloaded as XLSX successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                backgroundColor: 'rgb(60,86,91)',
            },
        });
    };

    const addInstantVisitors = (
        <>


        </>
    );

    const handleAddVisitorClick = () => {
        setOpen(true);
    };
    const handleAutocompleteChange = (value) => {
        // console.log("Selected value:", value);
        // Handle the selected value here
    };
    const handleDateChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <ToastContainer style={{ marginTop: '60px', color: "white" }} />
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                <Box sx={{ width: '600px', marginTop: "100px" }}>
                    {addInstantVisitors}
                </Box>
            </SwipeableDrawer>
            <Grid container spacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box backgroundColor={colors.navbar} marginTop="-10px" mb="10px">
                        <Typography color="white" marginLeft="10px">My Feedback View</Typography>
                    </Box>
                </Grid>
                <Box boxShadow={3} padding={2} borderRadius={2} marginLeft="20px" width="100%">
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box >
                            <Box display="flex" gap="5px" mt="8px">
                                <DatePickers
                                    placeholder="From Date"
                                    value={formData.fromDate}
                                    onChange={(value) => handleDateChange('fromDate', value)}
                                />
                                <DatePickers
                                    placeholder="To Date"
                                    value={formData.toDate}
                                    onChange={(value) => handleDateChange('toDate', value)}
                                />
                            </Box>
                            {showMoreFilters && (
                                <>
                                    <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                                        <FormControl fullWidth>
                                            <Autocmp size="small" label="Status" options={data}
                                                variant="outlined"
                                                onChange={(event, value) => handleAutocompleteChange(value)}
                                            />
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            <Box style={{ gap: "10px", marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                                <ButtonComponent backgroundColor={colors.navbar} name="Submit" variant="contained" size="small" />
                                <ButtonComponent
                                    size="small"
                                    variant="contained"
                                    backgroundColor={colors.navbar}
                                    name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                    onClick={handleMoreFiltersClick}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Box>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="auto" boxShadow={3} borderRadius={2} backgroundColor={colors.navbar}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" variant="h10" color="white">Filtered By : </Typography>
                            {/* <Typography mr="10px" variant="h10" color="white">Count = 0 </Typography> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            columns={columns}
                            // data={filteredData}
                            // onSearch={handleSearch}
                            copyEnabled={true}
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onDownloadXLSX={handleDownloadXLSX}
                        />
                    </Box>
                </Grid>
                <FloatingButton options={floatingActionButtonOptions} bottomOffset="100px" onButtonClick={handleAddVisitorClick} />
            </Grid>
        </>
    )
}

export default UserFeedback;