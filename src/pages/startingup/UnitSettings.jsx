import React, { useState, useEffect } from 'react';
import {
    Grid, FormControl, Box, IconButton, Typography, SwipeableDrawer
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import CustomDataTable from '../../components/ReactDataTable';
import FloatingButton from '../../components/FloatingButton';
import Texxt from '../../components/Textfield';
import axios from 'axios';
import { getUnit, createUnit, deleteUnit, unitIdDD, downloadUnit, updateUnit } from '../../Api/Api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Add, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import colors from '../colors';
import Cookies from 'js-cookie';
import axiosInstance from '../../components/Auth';
import Swal from 'sweetalert2';

const UnitSettings = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [searchNumber, setSearchNumber] = useState('');
    const [formData, setFormData] = useState({
        unitName: "",
        unitIp: "",
        unitCity: "",
        passAddress: "",
        passDisclaimer: "",
        unitId: null,
        status: true,
    });
    const [isFilteredByActive, setIsFilteredByActive] = useState(true);
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [unitIds, setUnitIds] = useState([]);

    const floatingActionButtonOptions = selectedRows.length === 0 ? [
        { label: 'Add', icon: <Add /> },
    ] : selectedRows.length === 1 ? [
        { label: 'Edit', icon: <EditIcon /> },
        { label: 'Delete', icon: <DeleteIcon /> },
    ] : [
        { label: 'Delete', icon: <DeleteIcon /> },
    ];


    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit' && selectedRows.length === 1) {
            const selectedRow = selectedRows[0];
            setSelectedRowData(selectedRow);
            setFormData({
                unitName: selectedRow.unitName,
                unitIp: selectedRow.unitIp,
                unitCity: selectedRow.unitCity,
                passAddress: selectedRow.passAddress,
                passDisclaimer: selectedRow.passDisclaimer,
                unitId: selectedRow.unitId,
            });
            setOpen(true);
        }
    };





    const columns = [
        {
            name: 'Select',
            selector: 'select',
            cell: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleRowSelected(row)} />,
            sortable: false,
        },
        {
            name: 'Unit Name', selector: row => row.unitName, sortable: true,
            cell: (row) => <div title={row.unitName}>{row.unitName}</div>
        },
        {
            name: 'IP', selector: row => row.unitIp, sortable: true,
            cell: (row) => <div title={row.unitIp}>{row.unitIp}</div>,
        },
        {
            name: 'City', selector: row => row.unitCity, sortable: true,
            cell: (row) => <div title={row.unitCity}>{row.unitCity}</div>,
        },
        {
            name: 'Pass Address', selector: row => row.passAddress, sortable: true,
            cell: (row) => <div title={row.passAddress}>{row.passAddress}</div>,
        },
        {
            name: 'Pass Disclaimer', selector: row => row.passDisclaimer, sortable: true,
            cell: (row) => <div title={row.passDisclaimer}>{row.passDisclaimer}</div>,
        },
        { name: 'Created By', selector: row => row.createdBy, sortable: true },
        {
            name: 'Created On',
            selector: row => formatDate(row.createdAt),
            sortable: true
        },
        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },

    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    };


    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const fetchData = async (page = 1, rowsPerPage = 10) => {
        try {
            const response = await axiosInstance.get(`${getUnit}`, {
                params: {
                    page: page - 1,
                    size: rowsPerPage
                }
            });
            const activePlants = response.data.content.filter(plant => plant.status === true);

            setFilteredData(activePlants);
            setVisitorsData(activePlants);
            setTotalRows(response.data.totalElements);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };


    const fetchUnitIds = async () => {
        try {
            const response = await axiosInstance.get(unitIdDD);
            const unitIdOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setUnitIds(unitIdOptions);
        } catch (error) {
            console.error('Error fetching unit IDs:', error.message);
        }
    };

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
        fetchUnitIds();
    }, [currentPage, rowsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, rowsPerPage);
    };

    const handleRowsPerPageChange = (newPerPage) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(1);
        fetchData(1, newPerPage);
    };
    const handleSearch = (searchText) => {
        const filtered = visitorsData.filter(item =>
            Object.values(item).some(value =>
                value !== null && value !== undefined && value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    // Updated search handler to ensure null safety
    const handleSearchNumberChange = (event) => {
        const searchText = event.target.value;
        setSearchNumber(searchText);
        handleSearch(searchText);  // Use handleSearch for filtering
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.unitName) {
            newErrors.unitName = 'Unit Name is required';
        }
        if (!formData.unitIp) {
            newErrors.unitIp = 'IP is required';
        }
        if (!formData.unitCity) {
            newErrors.unitCity = 'City is required';
        }
        if (!formData.passAddress) {
            newErrors.passAddress = 'Pass Address is required';
        }
        if (!formData.passDisclaimer) {
            newErrors.passDisclaimer = 'Pass Disclaimer is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    // const handleSearch = (searchText) => {
    //     const filtered = visitorsData.filter(item =>
    //         Object.values(item).some(value =>
    //             value.toString().toLowerCase().includes(searchText.toLowerCase())
    //         )
    //     );
    //     setFilteredData(filtered);
    // };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { unitName, unitIp, unitCity, passAddress, passDisclaimer, unitId } = formData;

        try {
            if (selectedRowData) {
                // If there's selectedRowData, we're editing an existing unit
                await axiosInstance.put(`${updateUnit}/${selectedRowData.id}`, {
                    unitName,
                    unitIp,
                    unitCity,
                    passAddress,
                    passDisclaimer,
                    unitId,
                    status: true,
                });
                toast.success('Unit updated successfully', { autoClose: 1000 });
            } else {
                // Otherwise, we're creating a new unit
                await axiosInstance.post(createUnit, {
                    unitName,
                    unitIp,
                    unitCity,
                    passAddress,
                    passDisclaimer,
                    unitId,
                    status: true,
                });
                toast.success('Unit created successfully', { autoClose: 1000 });
            }
            fetchData(currentPage, rowsPerPage);
            setFormData({
                unitName: "",
                unitIp: "",
                unitCity: "",
                passAddress: "",
                passDisclaimer: "",
                unitId: null,
                status: true,
            });
            toggleDrawer(false);
        } catch (error) {
            console.error('Error submitting form:', error.message);
            toast.error('Failed to submit form');
        }
    };




    const handleCopy = () => {
        const dataString = filteredData.map(row => Object.values(row).join('\t')).join('\n');
        navigator.clipboard.writeText(dataString);
        toast.success("Table data copied successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                color: "#0075a8"
            },
        });
    };


    const handleReset = () => {
        setFormData({
            unitName: "",
            unitIp: "",
            unitCity: "",
            passAddress: "",
            passDisclaimer: "",
            unitId: null,
            status: true,
        });
    }

    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadUnit, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'unit.xlsx');

            toast.success("Unit data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading Unit data:', error.message);
            toast.error("Error downloading Unit data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const handleDelete = async () => {
        if (selectedRows.length === 0) {
            // If no rows are selected, show a message or handle it accordingly
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete the selected plants?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deleteRequests = selectedRows.map(row => axiosInstance.delete(`${deleteUnit}/${row.id}`));
                    await Promise.all(deleteRequests);
                    toast.success("Plants deleted successfully!", {
                        autoClose: 3000,
                        position: "top-right",
                        style: {
                            backgroundColor: 'color: "#0075a8"',
                        },
                    });

                    fetchData(currentPage, rowsPerPage);
                } catch (error) {
                    toast.error(`Error deleting plants: ${error.message}`, {
                        autoClose: 3000,
                        position: "top-right",
                    });
                    console.error('Error deleting plants:', error.message);
                }
            }
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
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    const addInstantVisitors = (
        <>
            <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar} >
                <Typography color="white" style={{ marginLeft: "10px", marginTop: "10px" }}>Add Unit Settings</Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>

            <Grid container spacing={3} padding={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Unit Name"
                            required
                            name="unitName"
                            size="small"
                            value={formData.unitName}
                            onChange={handleChange}
                            error={!!errors.unitName}
                            helperText={errors.unitName}
                        />
                    </Box>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Autocmp
                            label="Unit ID"
                            name="unitId"
                            value={unitIds.find(option => option.value === formData.unitId) || null}
                            onChange={handleAutocompleteChange}
                            options={unitIds}
                            size="small"
                            error={errors.unitId}
                        />
                        {errors.unitId && (
                            <Typography variant="caption" color="error">{errors.unitId}</Typography>
                        )}

                    </Box>
                </Grid> */}
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="IP"
                            required
                            name="unitIp"
                            value={formData.unitIp}
                            onChange={handleChange}
                            error={!!errors.unitIp}
                            helperText={errors.unitIp}
                            variant="outlined"
                            size="small"
                            placeholder="Enter Data"
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="City"
                            required
                            name="unitCity"
                            size="small"
                            placeholder="Enter Data"
                            value={formData.unitCity}
                            onChange={handleChange}
                            error={!!errors.unitCity}
                            helperText={errors.unitCity}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Pass Address"
                            required
                            name="passAddress"

                            size="small"
                            rows="2"
                            multiline={true}
                            placeholder="Enter Data"
                            value={formData.passAddress}
                            onChange={handleChange}
                            error={!!errors.passAddress}
                            helperText={errors.passAddress}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Pass Disclaimer"
                            required
                            name="passDisclaimer"

                            size="small"
                            rows="2"
                            multiline={true}
                            placeholder="Enter Data"
                            value={formData.passDisclaimer}
                            onChange={handleChange}
                            error={!!errors.passDisclaimer}
                            helperText={errors.passDisclaimer}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} >
                <Grid item lg={12} md={12} xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ml: "25px", flexDirection: "row", gap: "20px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                size="small"
                                type="submit"
                                onClick={handleFormSubmit}
                                variant="contained"
                                backgroundColor={colors.navbar}
                            // style={{ backgroundColor: "rgb(60,86,91)", fontSize: "12px", color: "white" }}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Reset"
                                size="small"
                                type="submit"
                                // color="success"
                                variant="contained"
                                onClick={handleReset}
                                // style={{ backgroundColor: "rgb(60,86,91)", color: "gray" }}
                                style={styles.resetButton}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Cancel"
                                size="small"
                                onClick={handleCloseDrawer}
                                style={{ backgroundColor: "red", color: "white" }}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </>
    );

    const handleAddVisitorClick = () => {
        setSelectedRowData(null);
        setFormData({
            unitName: "",
            unitIp: "",
            unitCity: "",
            passAddress: "",
            passDisclaimer: ""
        });
        setOpen(true);
    };

    // const handleSearchNumberChange = (event) => {
    //     const searchText = event.target.value;
    //     setSearchNumber(searchText);
    //     const filtered = visitorsData.filter(item =>
    //         item.number && item.number.toString().includes(searchText)
    //     );
    //     setFilteredData(filtered);
    // };


    const handleFilterToggle = () => {
        setFilteredData(visitorsData.filter(item => item.status === true));
    };


    return (
        <>
            <ToastContainer style={{ marginTop: '45px', color: "white" }} />
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                <Box sx={{ width: '600px', marginTop: "63px" }}>
                    {addInstantVisitors}
                </Box>
            </SwipeableDrawer>
            <Grid container spacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box backgroundColor={colors.navbar}>
                        <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Unit Settings View</Typography>
                        {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
                    </Box>
                </Grid>
                <Box boxShadow={3} padding={2} borderRadius={2} marginLeft="20px" width="100%" marginTop="9px">
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box >
                            <Box marginBottom={2} display="flex" style={{ gap: "10px" }}>
                                <Texxt placeholder="Enter Data" label="Search Data" size="small" fullWidth
                                    value={searchNumber}
                                    onChange={handleSearchNumberChange}
                                />
                                {/* <IconButton color="primary">
                                    <Search />
                                </IconButton> */}
                            </Box>

                        </Box>
                    </Grid>
                </Box>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box boxShadow={3} borderRadius={2} backgroundColor={colors.navbar} height="35px" borderWidth="0">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <ButtonComponent
                                style={{ color: "white", cursor: "text" }}
                                name={`Filtered By: Active`}
                            />
                            {/* <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Unit Settings View</Typography> */}


                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            columns={columns}
                            data={filteredData}
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            onSearch={handleSearch}
                            copyEnabled={true}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onDownloadXLSX={handleDownloadXLSX}
                        />
                    </Box>
                </Grid>
                <FloatingButton options={floatingActionButtonOptions}
                    bottomOffset="100px"
                    onButtonClick={handleFloatingButtonClick} />
            </Grid>
        </>
    )
}

export default UnitSettings;
