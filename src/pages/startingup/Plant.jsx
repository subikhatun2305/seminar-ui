import {
    Grid, FormControl, Box, IconButton, Typography, SwipeableDrawer
} from '@mui/material';
import React, { useState, useEffect } from 'react'
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import CustomDataTable from '../../components/ReactDataTable';
import axios from 'axios';
import { user_api, getAllPlants, createPlants, unitIdDD, deletePlants, downloadPlants, updatePlants } from '../../Api/Api';
import FloatingButton from '../../components/FloatingButton';
import { toast, ToastContainer, POSITION } from 'react-toastify';
import Texxt from '../../components/Textfield';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Add, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import colors from '../colors';
import axiosInstance from '../../components/Auth';
import Swal from 'sweetalert2';

const data = [
    { label: 'HR', value: 'hr' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Marketing', value: 'marketing' },
];

const Plant = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [searchNumber, setSearchNumber] = useState('');
    const [formData, setFormData] = useState({
        plantName: "",
        plantBrief: "",
        unitId: null,
        status: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchText, setSearchText] = useState('');


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const [unitIds, setUnitIds] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [plantToEdit, setPlantToEdit] = useState(null);

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
        {
            name: 'Created At',
            selector: row => formatDate(row.createdAt),
            sortable: true
        },
        { name: 'UpdatedAt', selector: row => formatDate(row.updatedAt), sortable: true },
        { name: 'plantBrief', selector: row => row.plantBrief, sortable: true },
        { name: 'Plant Name', selector: row => row.plantName, sortable: true },
        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },
        // { name: 'number', selector: row => row.number, sortable: true },
    ];

    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };


    const fetchData = async (page = 1, rowsPerPage = 10) => {
        try {
            const response = await axiosInstance.get(`${getAllPlants}`, {
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

    const fetchUnitIds = async () => {
        try {
            const response = await axiosInstance.get(`${unitIdDD}`);
            const unitIdOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setUnitIds(unitIdOptions);
            // console.log('Unit IDs:', unitIdOptions); // Log unitIds after fetching

        } catch (error) {
            console.error('Error fetching unit IDs:', error.message);
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.plantName) {
            newErrors.plantName = 'Plant Name is required';
        }
        if (!formData.plantBrief) {
            newErrors.plantBrief = 'Plant Brief is required';
        }
        if (!formData.unitId) {
            newErrors.unitId = 'UnitId is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const handleSearch = (value) => {
        const searchString = value ? value.toString().toLowerCase() : '';
        setSearchText(searchString);

        let filtered;
        if (searchString) {
            filtered = filteredData.filter(item =>
                Object.values(item).some(val =>
                    val && val.toString().toLowerCase().includes(searchString)
                )
            );
        } else {
            // If search field is empty, show all data
            filtered = filteredData;
        }

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
        setIsEditing(false);
        setFormData({
            plantName: "",
            plantBrief: "",
            unitId: "",
            status: true,
        });
    };


    const handleChange = (e) => {
        const { name, value } = e.target || e;
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
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (isEditing) {
                // Update existing plan
                const response = await axiosInstance.put(`${updatePlants}/${plantToEdit.id}`, formData);
                toast.success("Plant updated successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: {
                        backgroundColor: 'color: "#0075a8"',
                    },
                });
            } else {
                // Create new plant
                const response = await axiosInstance.post(createPlants, formData);
                toast.success("Plant added successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: {
                        backgroundColor: 'color: "#0075a8"',
                    },
                });
            }

            fetchData();
            handleCloseDrawer();
            setFormData({
                plantName: "",
                plantBrief: "",
                unitId: "",
                status: true,
            });
            setIsEditing(false);
        } catch (error) {
            toast.error(`Error ${isEditing ? 'updating' : 'adding'} plant: ${error.message}`, {
                autoClose: 3000,
                position: "top-right",
            });
            console.error(`Error ${isEditing ? 'updating' : 'adding'} plant:`, error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = () => {
        const dataString = filteredData.map(row => Object.values(row).join('\t')).join('\n');
        navigator.clipboard.writeText(dataString);
        toast.success("Table data copied successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                backgroundColor: 'color: "#0075a8"',
            },
        });
    };

    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadPlants, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'plants.xlsx');

            toast.success("Plants data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading plants data:', error.message);
            toast.error("Error downloading plants data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };


    const handleSearchNumberChange = (event) => {
        const searchText = event.target.value;
        setSearchNumber(searchText);
        const filtered = visitorsData.filter(item =>
            item.number && item.number.toString().includes(searchText)
        );
        setFilteredData(filtered);
    };


    const handleDelete = async () => {
        if (selectedRows.length === 0) {
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
                    const deleteRequests = selectedRows.map(row => axiosInstance.delete(`${deletePlants}/${row.id}`));
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
            // padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };


    const handleReset = () => {
        setFormData({
            plantName: "",
            plantBrief: "",
            status: true,
        });
    }

    const addInstantVisitors = (
        <>
            <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar} >
                <Typography color="white" style={{ marginLeft: "10px", marginTop: "10px" }}>Add Plant</Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>

            <Grid container spacing={1} sx={{ p: 3 }}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Plant Name"
                            required
                            name="plantName"
                            size="small"
                            value={formData.plantName}
                            onChange={handleChange}
                            placeholder="Enter Data"
                            error={errors.plantName}
                            helperText={errors.plantName}
                        />

                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Brief"
                            required
                            name="plantBrief"
                            value={formData.plantBrief}
                            onChange={handleChange}
                            size="small"
                            placeholder="Enter Data"
                            error={errors.plantBrief}
                            helperText={errors.plantBrief}
                        />
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Autocmp
                            label="Unit ID"
                            name="unitId"
                            value={unitIds.find(option => option.value === formData.unitId) || null}
                            onChange={handleAutocompleteChange}
                            options={unitIds}
                            required
                            getOptionLabel={(option) => option.value}
                            getOptionSelected={(option, value) => option.value === value.value}
                            size="small"
                            error={errors.unitId}
                        />
                        {errors.unitId && (
                            <Typography variant="caption" color="error">{errors.unitId}</Typography>
                        )}

                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} >
                <Grid item lg={12} md={12} xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: "15px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                size="small"
                                type="submit"
                                onClick={handleFormSubmit}
                                variant="contained"
                                backgroundColor={colors.navbar}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Reset"
                                size="small"
                                type="submit"
                                onClick={handleReset}
                                color="success"
                                variant="contained"
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
        setOpen(true);
    };

    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit') {
            handleEdit();
        }
    };

    const handleEdit = () => {
        const plant = selectedRows[0];
        setPlantToEdit(plant);
        setFormData({
            plantName: plant.plantName,
            plantBrief: plant.plantBrief,
            unitId: plant.unitId,
            status: plant.status,
        });
        setIsEditing(true);
        setOpen(true);
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
                        <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Plant View</Typography>
                        {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
                    </Box>
                </Grid>
                <Box boxShadow={3} padding={2} borderRadius={2} marginLeft="20px" width="100%" marginTop="9px">
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box >
                            <Box marginBottom={2} display="flex" style={{ gap: "10px" }}>
                                <Texxt placeholder="Enter Data" label="Search for Plant View" size="small" fullWidth
                                    value={searchNumber}
                                    onChange={handleSearchNumberChange}
                                />
                                {/* <IconButton color="primary">
                                    <Search />
                                </IconButton> */}
                            </Box>
                            {showMoreFilters && (
                                <>
                                    <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                                        <FormControl fullWidth>
                                            <Autocmp size="small" label="Active" options={data}
                                                onChange={(event, value) => handleAutocompleteChange(value)}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <Autocmp size="small" label="Plant" options={data}
                                                onChange={(event, value) => handleAutocompleteChange(value)}
                                            />
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            <Box style={{ gap: "10px", marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                                <ButtonComponent size="small" backgroundColor={colors.navbar} variant="contained" style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                    name="Submit" />
                                <ButtonComponent size="small"
                                    style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                    backgroundColor={colors.navbar}
                                    variant="contained"
                                    name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                    onClick={handleMoreFiltersClick}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Box>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box boxShadow={3} borderRadius={2} backgroundColor={colors.navbar} height="35px" borderWidth="0">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" mt="8px" variant="h10" fontSize="12px" color="white">Filtered By : Active </Typography>
                            {/* <Typography mr="10px" variant="h10" color="white">Count = 0 </Typography> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            columns={columns}
                            data={filteredData}
                            onSearch={handleSearch}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            copyEnabled={true}
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}
                            onDownloadXLSX={handleDownloadXLSX}
                            paginationPerPageOptions={[10, 20, 30]}
                            paginationRowsPerPageOptionsLabel={`Rows per page: ${rowsPerPage} (${currentPage * rowsPerPage - rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows})`}
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

export default Plant;
