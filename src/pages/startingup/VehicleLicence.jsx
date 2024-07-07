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
import { user_api, addVehicleLicence, unitIdDD, getVehicleLicence, deleteVehicleLicence, downloadVehicleLicence, updateVehicleLicence } from "../../Api/Api";
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
import DatePickers from "../../components/DateRangePicker";
import InputFileUpload from "../../components/FileUpload";
import colors from "../colors";
import axiosInstance from "../../components/Auth";
import Swal from 'sweetalert2';

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

const VehicleLicence = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState([statuss[0]]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        vehicleNumber: "",
        vehicleType: "",
        vehicleOwner: "",
        brief: "",
        pucDate: null,
        registrationDate: null,
        insuranceDate: null,
        attachedFiles: {
            pucFile: null,
            insuranceFile: null,
            registrationFile: null
        }
    });

    const [searchNumber, setSearchNumber] = useState('');
    const [unitIds, setUnitIds] = useState([]);


    const floatingActionButtonOptions =
        selectedRows.length === 0
            ? [{ label: "Add", icon: <Add /> }]
            : selectedRows.length === 1
                ? [
                    { label: "Edit", icon: <EditIcon /> },
                    { label: "Delete", icon: <DeleteIcon /> },
                ]
                : [{ label: "Delete", icon: <DeleteIcon /> }];

    const columns = [
        {
            name: "Select",
            selector: "select",
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={() => handleRowSelected(row)}
                />
            ),
            sortable: false,
        },
        { name: "Vehicle Owner", selector: (row) => row.vehicleOwner, sortable: true },
        { name: "Vehicle Number ", selector: (row) => row.vehicleNumber, sortable: true },
        { name: "Vehicle Type", selector: (row) => row.vehicleType, sortable: true },
        { name: "Puc Date", selector: (row) => row.pucDate, sortable: true },
        { name: "Registration Date", selector: (row) => row.registrationDate, sortable: true },
        { name: "Insurance Date", selector: (row) => row.insuranceDate, sortable: true },
        { name: "Brief", selector: (row) => row.brief, sortable: true },
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
            // padding: '8px 16px',
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
            const response = await axiosInstance.get(getVehicleLicence);
            // console.log(response.data.content, "Vehicle");
            const activeData = response.data.content.filter(item => item.status === true);
            setVisitorsData(activeData);
            setFilteredData(activeData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.vehicleNumber) {
            newErrors.vehicleNumber = "Vehicle Number is required";
        }
        // if (!formData.driverMobile) {
        //     newErrors.driverMobile = 'Mobile Number is required';
        // } else if (!/^\d{10}$/.test(formData.driverMobile)) {
        //     newErrors.driverMobile = 'Mobile Number should be 10 digits long';
        // }
        if (!formData.vehicleType) {
            newErrors.vehicleType = "Vehicle Type is required";
        }
        if (!formData.vehicleOwner) {
            newErrors.vehicleOwner = "Vehicle Owner is required";
        } if (!formData.unitId) {
            newErrors.unitId = "Unit Id is required";
        } if (!formData.insuranceDate) {
            newErrors.insuranceDate = "Insurance Date  is required";
        } if (!formData.pucDate) {
            newErrors.pucDate = "PUC Date is required";
        }
        if (!formData.registrationDate) {
            newErrors.registrationDate = "Registration Date is required";
        }
        if (!formData.brief) {
            newErrors.brief = "Brief is required";
        }
        if (!formData.pucFile) {
            newErrors.pucFile = "Puc File is required";
        }
        if (!formData.insuranceFile) {
            newErrors.insuranceFile = "Insurance File is required";
        }
        if (!formData.registrationFile) {
            newErrors.registrationFile = "Registration File File is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            const jsonString = {
                vehicleNumber: formData.vehicleNumber,
                vehicleType: formData.vehicleType,
                vehicleOwner: formData.vehicleOwner,
                brief: formData.brief,
                unitId: formData.unitId,
                pucDate: formData.pucDate.target.value.substring(0, 10),
                registrationDate: formData.registrationDate.target.value.substring(0, 10),
                insuranceDate: formData.insuranceDate.target.value.substring(0, 10)
            };

            formDataToSend.append('jsonString', JSON.stringify(jsonString));

            if (formData.attachedFiles.pucFile) {
                formDataToSend.append('pucFile', formData.attachedFiles.pucFile);
            }
            if (formData.attachedFiles.insuranceFile) {
                formDataToSend.append('insuranceFile', formData.attachedFiles.insuranceFile);
            }
            if (formData.attachedFiles.registrationFile) {
                formDataToSend.append('registrationFile', formData.attachedFiles.registrationFile);
            }

            let response;
            if (formData.id) {
                // Update existing entry
                response = await axiosInstance.put(updateVehicleLicence, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Add new entry
                response = await axiosInstance.post(addVehicleLicence, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                // Reset the form after successful submission
                toast.success(formData.id ? "Vehicle license updated successfully!" : "Vehicle license added successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: { color: "#0075a8" },
                });
                fetchData(); // Example function to fetch updated data
                // Reset form data state
                setFormData({
                    vehicleNumber: "",
                    vehicleType: "",
                    vehicleOwner: "",
                    brief: "",
                    pucDate: null,
                    registrationDate: null,
                    insuranceDate: null,
                    attachedFiles: {
                        pucFile: null,
                        insuranceFile: null,
                        registrationFile: null
                    }
                });
            } else {
                // Handle unexpected status codes if needed
                console.error("Unexpected status:", response.status);
                toast.error("Failed to submit form. Please try again later.", {
                    autoClose: 3000,
                    position: "top-right",
                    style: { color: "#ff0000" },
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
                style: { color: "#ff0000" },
            });
        }
    };


    const fetchUnitIds = async () => {
        try {
            const response = await axiosInstance.get(`${unitIdDD}`);
            const unitIdOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setUnitIds(unitIdOptions);
            console.log('Unit IDs:', unitIdOptions); // Log unitIds after fetching

        } catch (error) {
            console.error('Error fetching unit IDs:', error.message);
        }
    };

    useEffect(() => {
        fetchUnitIds();
    }, [])

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
            const response = await axiosInstance.get(downloadVehicleLicence, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'VehicleLicence.xlsx');

            toast.success("VehicleLicence data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading VehicleLicence data:', error.message);
            toast.error("Error downloading VehicleLicence data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };


    const removeFile = (type) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            attachedFiles: {
                ...prevFormData.attachedFiles,
                [type]: null,
            },
        }));
    };

    const handleFileUpload = (file, type) => {
        if (file) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                attachedFiles: {
                    ...prevFormData.attachedFiles,
                    [`${type}File`]: file,
                },
            }));
        }
    };

    const handleReset = () => {
        setFormData({
            vehicleNumber: "",
            vehicleOwner: "",
            brief: "",
            vehicleType: "",

            pucDate: null,
            registrationDate: null,
            insuranceDate: null,
            attachedFiles: {
                puc: null,
                insurance: null,
                registration: null
            }
        });
        setAttachedFile(null);

    }

    const handlePucDateChange = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                pucDate: date,
            }));
        }
    };
    const handleRegDateChange = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                registrationDate: date,
            }));
        }
    };

    const handleInsuranceDateChange = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                insuranceDate: date,
            }));
        }
    };


    const handleStatusChange = (event, name, newValue) => {
        setSelectedStatus(newValue);

        // Optionally, handle the change in formData if needed
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
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
                    const deleteRequests = selectedRows.map(row => axiosInstance.delete(`${deleteVehicleLicence}/${row.id}`));
                    await Promise.all(deleteRequests);
                    toast.success("Vehicle Licence Data deleted successfully!", {
                        autoClose: 3000,
                        position: "top-right",
                        style: {
                            backgroundColor: 'color: "#0075a8"',
                        },
                    });
                    fetchData();
                    // setTotalRows(prevTotalRows => prevTotalRows - 1);

                    // If deleting the last item on the current page, move to the previous page
                    // if (filteredData.length === 1 && currentPage > 1) {
                    //     setCurrentPage(currentPage - 1);
                    //     fetchData(currentPage - 1, rowsPerPage);
                    // } else {
                    //     fetchData(currentPage, rowsPerPage);
                    // }
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

    const handleFloatingButtonClick = (label, row) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit' && selectedRows.length === 1) {
            handleEdit(selectedRows[0]);
        }
    };


    const handleEdit = (row) => {
        setEditingRowId(row.id);
        setIsEditing(true);

        setFormData({
            vehicleNumber: row.vehicleNumber,
            vehicleType: row.vehicleType,
            vehicleOwner: row.vehicleOwner,
            brief: row.brief,
            pucDate: row.pucDate,
            registrationDate: row.registrationDate,
            insuranceDate: row.insuranceDate,
            attachedFiles: {
                pucFile: row.pucFile,
                insuranceFile: row.insuranceFile,
                registrationFile: row.registrationFile
            }
        });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };

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
                    Add Vehicle Licence
                </Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>

            <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Number"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="vehicleNumber"
                            // variant="standard"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            error={errors.vehicleNumber}
                            helperText={errors.vehicleNumber}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Type"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="vehicleType"
                            // variant="standard"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            error={errors.vehicleType}
                            helperText={errors.vehicleType}

                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Owner"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="vehicleOwner"
                            // variant="standard"
                            onChange={handleChange}
                            value={formData.vehicleOwner}
                            error={errors.vehicleOwner}
                            helperText={errors.vehicleOwner}

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
                    <Box style={{ marginTop: "15px" }}>
                        <DatePickers
                            placeholder="Insurance Date"
                            label="Insurance Date"
                            value={formData.insuranceDate}
                            handleInputChange={handleInsuranceDateChange}
                            required
                        />
                        {errors.insuranceDate && (
                            <Typography fontSize="12px" color="error">{errors.insuranceDate}</Typography>
                        )}

                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box style={{ marginTop: "15px" }}>
                        <DatePickers
                            placeholder="PUC Date"
                            label="PUC Date"
                            value={formData.pucDate}
                            handleInputChange={handlePucDateChange}
                            required
                        />
                        {errors.pucDate && (
                            <Typography fontSize="12px" color="error">{errors.pucDate}</Typography>
                        )}


                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box style={{ marginTop: "15px" }}>
                        <DatePickers
                            label="Registration Date"
                            placeholder="Registration Date"
                            value={formData.registrationDate}
                            handleInputChange={handleRegDateChange}
                            required
                        />
                        {errors.registrationDate && (
                            <Typography fontSize="12px" color="error">{errors.registrationDate}</Typography>
                        )}

                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Brief"
                            placeholder="Enter Data"
                            size="small"
                            required
                            name="brief"
                            // variant="standard"
                            onChange={handleChange}
                            value={formData.brief}
                            error={errors.brief}
                            helperText={errors.brief}
                        />
                    </Box>

                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px", marginTop: "20px" }}>
                        {formData.attachedFiles.pucFile ? (
                            <>
                                <Typography>{formData.attachedFiles.pucFile.name}</Typography>
                                <IconButton onClick={() => removeFile('pucFile')}>
                                    <CloseIcon style={{ color: "red" }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography>No file attached</Typography>
                                <InputFileUpload
                                    name="PUC"
                                    required
                                    onFileSelect={(file) => handleFileUpload(file, 'puc')}
                                    style={{ backgroundColor: colors.navbar }}
                                />
                            </>
                        )}
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px", marginTop: "20px" }}>
                        {formData.attachedFiles.insuranceFile ? (
                            <>
                                <Typography>{formData.attachedFiles.insuranceFile.name}</Typography>
                                <IconButton onClick={() => removeFile('insuranceFile')}>
                                    <CloseIcon style={{ color: "red" }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography>No file attached</Typography>
                                <InputFileUpload
                                    name="Insurance"
                                    required
                                    onFileSelect={(file) => handleFileUpload(file, 'insurance')}
                                    style={{ backgroundColor: colors.navbar }}
                                />
                            </>
                        )}
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px", marginTop: "20px" }}>
                        {formData.attachedFiles.registrationFile ? (
                            <>
                                <Typography>{formData.attachedFiles.registrationFile.name}</Typography>
                                <IconButton onClick={() => removeFile('registrationFile')}>
                                    <CloseIcon style={{ color: "red" }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Typography>No file attached</Typography>
                                <InputFileUpload
                                    name="Registration"
                                    required
                                    onFileSelect={(file) => handleFileUpload(file, 'registration')}
                                    style={{ backgroundColor: colors.navbar }}
                                />
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                    <Box style={{ marginBottom: "20px" }}>
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
                                // style={{ backgroundColor: "rgb(60,86,91)", color: "white" }}
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
                        <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Vehicle Licence View</Typography>
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
                                    label="Search for Data"
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
                                    style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                    name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                    onClick={handleMoreFiltersClick}
                                    backgroundColor={colors.navbar}
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
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}

                            onDownloadXLSX={handleDownloadXLSX}
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

export default VehicleLicence;
