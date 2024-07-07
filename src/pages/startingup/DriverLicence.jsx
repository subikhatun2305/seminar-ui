import {
    Grid,
    FormControl,
    Box,
    IconButton,
    Typography,
    SwipeableDrawer,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Autocmp from "../../components/AutoComplete";
import ButtonComponent from "../../components/Button";
import CustomDataTable from "../../components/ReactDataTable";
import axios from "axios";
import { getDLData, addDLData, unitIdDD, downloadDLData, deleteDLData, updateDLData } from "../../Api/Api";
import FloatingButton from "../../components/FloatingButton";
import { toast, ToastContainer } from "react-toastify";
import Texxt from "../../components/Textfield";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
    Search,
    Add,
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import Swal from 'sweetalert2';

import DatePickers from "../../components/DateRangePicker";
import InputFileUpload from "../../components/FileUpload";
import colors from "../colors";
import Cookies from 'js-cookie';
import axiosInstance from "../../components/Auth";
import { format } from 'date-fns';

const statuss = [
    {
        label: "Active",
        value: "active",
    },
    { label: "In Active", value: "inActive" },
    {
        label: "Black List",
        value: "blacklist",
    },
];

const DriverLicence = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState([statuss[0]]);
    const initialFormData = {
        driverName: "",
        driverMobile: "",
        licence: "",
        brief: "",
        expDate: null,
        unitId: null,
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [editingRowId, setEditingRowId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [unitIds, setUnitIds] = useState([]);

    const [searchNumber, setSearchNumber] = useState('');


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
        { name: 'Brief', selector: row => row.brief, sortable: true },
        { name: 'Mobile No', selector: row => row.driverMobile, sortable: true },
        { name: 'Driver Name', selector: row => row.driverName, sortable: true },
        { name: 'Licence', selector: row => row.licence, sortable: true },
        { name: 'Exp Date', selector: row => row.expDate, sortable: true },
        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },
        // { name: 'unitId', selector: row => row.unitId, sortable: true },
    ];

    const fetchData = async (page, pageSize) => {
        try {
            const response = await axiosInstance.get(`${getDLData}`, {
                params: {
                    page: page - 1,
                    size: pageSize
                }
            });

            // Filter active data
            const activeData = response.data.content.filter(item => item.status === true);

            // Update state with active data
            setFilteredData(activeData);
            setVisitorsData(response.data.content); // Optionally store all data for search purposes

            // Update total rows count for pagination
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
            console.log('Unit IDs:', unitIdOptions);

        } catch (error) {
            console.error('Error fetching unit IDs:', error.message);
        }
    };

    useEffect(() => {
        fetchUnitIds();
        fetchData(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);




    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, rowsPerPage);
    };


    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to first page
        fetchData(1, newRowsPerPage);
    };





    const validateForm = () => {
        const newErrors = {};

        if (!formData.driverName) {
            newErrors.driverName = "Driver Name is required";
        }
        if (!formData.driverMobile) {
            newErrors.driverMobile = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(formData.driverMobile)) {
            newErrors.driverMobile = 'Mobile Number should be 10 digits long';
        }
        if (!formData.licence) {
            newErrors.licence = "Driver Licence is required";
        }
        if (!formData.brief) {
            newErrors.brief = "Brief is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const handleSearch = (searchText) => {
        const filtered = visitorsData.filter((item) =>
            Object.values(item).some((value) =>
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
        setSelectedRows(updatedData.filter((item) => item.selected));
    };

    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    const handleChange = (e, name, value) => {
        if (e && e.target && e.target.name) {
            const { name, value } = e.target;
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleDateChange = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                expDate: date,
            }));
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSend = new FormData();
                const licenceReqDto = {
                    driverName: formData.driverName,
                    driverMobile: formData.driverMobile,
                    licence: formData.licence,
                    brief: formData.brief,
                    expDate: formData.expDate.target.value.substring(0, 10),
                    unitId: formData.unitId,
                };

                formDataToSend.append('licenceReqDto', JSON.stringify(licenceReqDto));

                // Append file to form data only if attachedFile exists
                if (attachedFile) {
                    formDataToSend.append('file', attachedFile);
                }

                let response;
                if (isEditing) {
                    // Handle edit request
                    response = await axiosInstance.put(`${updateDLData}/${editingRowId}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    // Handle add request
                    response = await axiosInstance.post(addDLData, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }

                if (response.status === 201 || response.status === 200) {
                    setFormData(initialFormData);
                    setAttachedFile(null);
                    fetchData();
                    toast.success(`${isEditing ? 'Updated' : 'Added'} successfully!`, {
                        autoClose: 3000,
                        position: 'top-right',
                        style: { color: '#0075a8' },
                    });
                    setIsEditing(false); // Reset editing mode after successful submission
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                console.error('Error submitting form:', error.message);
                toast.error(`Failed to ${isEditing ? 'update' : 'submit'} form. Please try again.`, {
                    autoClose: 3000,
                    position: 'top-right',
                    style: { color: '#0075a8' },
                });
            }
        } else {
            toast.error('Please fill all the required fields.', {
                autoClose: 3000,
                position: 'top-right',
                style: { color: '#0075a8' },
            });
        }
    };
    const handleCopy = () => {
        const dataString = filteredData
            .map((row) => Object.values(row).join("\t"))
            .join("\n");
        navigator.clipboard.writeText(dataString);
        toast.success("Table data copied successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                // backgroundColor: "rgb(60,86,91)",
                color: "#0075a8"
            },
        });
    };

    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadDLData, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'DriverLicence.xlsx');

            toast.success("DriverLicence data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading DriverLicence data:', error.message);
            toast.error("Error downloading DriverLicence data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };

    const handleFileSelect = (file) => {
        console.log("file new", file)
        setAttachedFile(file);
    };

    const removeFile = () => {
        setAttachedFile(null);
    };

    const handleStatusChange = (event, name, newValue) => {
        setSelectedStatus(newValue);

        // Optionally, handle the change in formData if needed
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
    };

    const handleReset = () => {
        setFormData({
            driverName: "",
            driverMobile: "",
            licence: "",
            brief: "",
            expDate: null,
        });
        setAttachedFile(null);
    }
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
                    const deleteRequests = selectedRows.map(row => axiosInstance.delete(`${deleteDLData}/${row.id}`));
                    await Promise.all(deleteRequests);
                    toast.success("Driver Licence Data deleted successfully!", {
                        autoClose: 3000,
                        position: "top-right",
                        style: {
                            backgroundColor: 'color: "#0075a8"',
                        },
                    });

                    setTotalRows(prevTotalRows => prevTotalRows - 1);

                    // If deleting the last item on the current page, move to the previous page
                    if (filteredData.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        fetchData(currentPage - 1, rowsPerPage);
                    } else {
                        fetchData(currentPage, rowsPerPage);
                    }
                } catch (error) {
                    toast.error(`Error deleting Driver Licence: ${error.message}`, {
                        autoClose: 3000,
                        position: "top-right",
                    });
                    console.error('Error deleting Driver Licence:', error.message);
                }
            }
        });
    };



    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit' && selectedRows.length === 1) {
            handleEdit(selectedRows[0]);
        }
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => ({ ...prevValues, [name]: value }));
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

    const handleEdit = (row) => {
        setEditingRowId(row.id);
        setIsEditing(true);

        setFormData({
            driverName: row.driverName,
            driverMobile: row.driverMobile,
            licence: row.licence,
            brief: row.brief,
            expDate: format(new Date(row.expDate), 'MM-dd-yyyy'),
            unitId: row.unitId,
        });
        setOpen(true);
    };
    console.log(formData, "date");


    const addInstantVisitors = (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                backgroundColor={colors.navbar}
            >
                <Typography
                    color="white"
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                >
                    Add Driver Licence
                </Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>

            <Grid container spacing={1} sx={{ p: 2 }}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Driver Name"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="driverName"
                            // variant="contained"
                            value={formData.driverName}
                            onChange={handleChange}
                            error={errors.driverName}
                            helperText={errors.driverName}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Driver Mobile"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="driverMobile"
                            // variant="standard"
                            value={formData.driverMobile}
                            onChange={handleChange}
                            error={errors.driverMobile}
                            helperText={errors.driverMobile}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Licence"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="licence"
                            // variant="standard"
                            onChange={handleChange}
                            value={formData.licence}
                            error={errors.licence}
                            helperText={errors.licence}
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
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box style={{ marginTop: "10px" }}>
                        <DatePickers
                            placeholder="From Date"
                            label="From Date"
                            value={formData.expDate}
                            handleInputChange={handleDateChange}
                            required
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Brief"
                            size="small"
                            name="brief"
                            // variant="standard"
                            required
                            placeholder="Enter Data"
                            onChange={handleChange}
                            value={formData.brief}
                            error={errors.brief}
                            helperText={errors.brief}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px", marginTop: "20px" }}>
                        {attachedFile ? (
                            <>
                                <Typography >{attachedFile.name}</Typography>
                                <IconButton onClick={removeFile}>
                                    <CloseIcon style={{ color: "red" }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography>No file attached</Typography>
                                <InputFileUpload onFileSelect={handleFileSelect}
                                />
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            ml: "25px",
                            flexDirection: "row",
                            gap: "20px",
                        }}
                    >
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
                                color="success"
                                variant="contained"
                                onClick={handleReset}
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

    const handleSearchNumberChange = (event) => {
        const searchText = event.target.value;
        setSearchNumber(searchText);
        const filtered = visitorsData.filter(item =>
            item.number && item.number.toString().includes(searchText)
        );
        setFilteredData(filtered);
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
                <Box sx={{ width: "600px", marginTop: "63px" }}>
                    {addInstantVisitors}
                </Box>
            </SwipeableDrawer>
            <Grid container spacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box backgroundColor={colors.navbar}>
                        <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Driver Licence View</Typography>
                        {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
                    </Box>
                </Grid>
                <Box
                    boxShadow={3}
                    padding={2}
                    borderRadius={2}
                    marginLeft="20px"
                    width="100%"
                    marginTop="9px"
                >
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Box>
                            <Box marginBottom={2} display="flex" style={{ gap: "10px" }}>
                                <Texxt
                                    placeholder="Search Data"
                                    // variant="standard"
                                    label="Search for Driver Licence"
                                    size="small"
                                    fullWidth
                                    value={searchNumber}
                                    onChange={handleSearchNumberChange}
                                />
                                {/* <IconButton color="primary">
                                    <Search />
                                </IconButton> */}
                            </Box>
                            {showMoreFilters && (
                                <>
                                    <Box
                                        display="flex"
                                        style={{ gap: "10px", marginTop: "15px" }}
                                    >
                                        <FormControl fullWidth>
                                            <Autocmp
                                                options={statuss}
                                                name="status"
                                                label="Search By Status"
                                                size="small"
                                                value={selectedStatus}
                                                multiple
                                                onChange={handleStatusChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            <Box
                                style={{
                                    gap: "10px",
                                    marginTop: "15px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <ButtonComponent
                                    size="small"
                                    variant="contained"
                                    backgroundColor={colors.navbar}
                                    style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                    name="Submit"
                                />
                                <ButtonComponent
                                    size="small"
                                    variant="contained"
                                    backgroundColor={colors.navbar}
                                    style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
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
                            <Typography ml="10px" mt="8px" variant="h10" fontSize="12px" color="white">Filtered By : </Typography>
                            {/* <Typography mr="10px" variant="h10" color="white">Count = 0 </Typography> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box
                        width="100%"
                        boxShadow={3}
                        padding={2}
                        borderRadius={2}
                        bgcolor="white"
                    >
                        <CustomDataTable
                            columns={columns}
                            data={filteredData}
                            onSearch={handleSearch}
                            copyEnabled={true}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onDownloadXLSX={handleDownloadXLSX}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
                        />

                    </Box>
                </Grid>
                <FloatingButton
                    options={floatingActionButtonOptions}
                    bottomOffset="100px"
                    onButtonClick={handleFloatingButtonClick}
                />
            </Grid>
        </>
    );
};

export default DriverLicence;
