import {
    Grid, FormControl, Box, IconButton, Typography, SwipeableDrawer
} from '@mui/material';
import React, { useState, useEffect } from 'react'
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import CustomDataTable from '../../components/ReactDataTable';
import axios from 'axios';
import { unitIdDD, createPurpose, departmentDropDown, getAllPurpose, deletePurposeData, downloadExcelPurposeData, userDD, updatePurpose } from '../../Api/Api';
import FloatingButton from '../../components/FloatingButton';
import ReusableRadioButton from '../../components/RadioButton';
import { toast, ToastContainer, POSITION } from 'react-toastify';
import Texxt from '../../components/Textfield';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Add, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import colors from './../colors';
import axiosInstance from '../../components/Auth';
import CustomTimePicker from '../../components/TimePicker';
import TimePicker from '../../components/TimePicker';
import Swal from 'sweetalert2';
import ReusableTimePicker from '../../components/TimePicker';


const data = [
    { label: 'Visitor', value: 'visitor' },
    { label: 'Vehicle', value: 'vehicle' },
    // { label: 'Marketing', value: 'marketing' },
];




const Purpose = () => {
    const [open, setOpen] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [isExtendedPassRequestChecked, setIsExtendedPassRequestChecked] = useState(false);
    // const [errors, setErrors] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [searchNumber, setSearchNumber] = useState('');
    const [formData, setFormData] = useState({

        purposeBrief: "",
        purposeFor: null,
        unitId: null,
        alertTime: '',
        userId: null,
        alert: false,
        departmentId: null,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [unitIds, setUnitIds] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [user, setUser] = useState([]);

    const [editingRow, setEditingRow] = useState(null);
    const [errors, setErrors] = useState({
        purposeBrief: "",
        purposeFor: "",
        unitId: "",
        alertTime: "",
        userId: "",
        departmentId: "",
    });


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

    const [selectedTime, setSelectedTime] = useState();

    const handleTimeChange = (newTime) => {
        // console.log("New Time Selected:", newTime);
        setSelectedTime(newTime);
        setFormData((prevFormData) => ({
            ...prevFormData,
            alertTime: newTime,
        }));
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
        {
            name: 'Purpose', selector: row => row.
                purposeBrief, sortable: true
        },
        { name: 'Purpose For', selector: row => row.purposeFor, sortable: true },
        { name: 'Alert After', selector: row => row.alertTime, sortable: true },
        { name: 'Alert To', selector: row => row.department?.departmentName ?? 'NA', sortable: true },
        // { name: 'updated By', selector: row => row.updatedBy, sortable: true },
        {
            name: 'Created On', selector: row => row.createdAt, sortable: true
        },
        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },


    ];

    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };


    const fetchData = async (page, pageSize) => {
        try {
            const response = await axiosInstance.get(`${getAllPurpose}`, {
                params: {
                    page: page - 1,
                    size: pageSize
                }
            });

            const activePlants = response.data.content.filter(plant => plant.status === true);
            // console.log(response.data, "purpose");

            setFilteredData(response.data.content);
            setVisitorsData(response.data.content);
            setTotalRows(response.data.totalElements);

        } catch (error) {
            console.error('Error fetching data:', error.message);
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

    const fetchDepartmentDD = async () => {
        try {
            const response = await axiosInstance.get(`${departmentDropDown}`);
            const departmentOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setDepartmentData(departmentOptions)
            console.log('Department:', departmentOptions);
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };
    const fetchUserDD = async () => {
        try {
            const response = await axiosInstance.get(`${userDD}`);
            const userOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setUser(userOptions)
            console.log('Department:', userOptions);
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
        fetchUnitIds();
        fetchDepartmentDD();
        fetchUserDD();
    }, [currentPage, rowsPerPage]);

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

    const handleExtendedPassRequestChange = (event) => {
        setIsExtendedPassRequestChecked(event.target.checked);
    };

    const handleChange = (e) => {
        const { name, value } = e.target || e;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        let errorMsg = "";
        switch (fieldName) {
            case "purposeBrief":
                if (!value) {
                    errorMsg = "Purpose brief is required.";
                }
                break;
            case "purposeFor":
                if (!value) {
                    errorMsg = "Purpose For is required.";
                }
                break;
            case "unitId":
                if (!value) {
                    errorMsg = "Unit ID is required.";
                }
                break;
            case "alertTime":
                if (!value) {
                    errorMsg = "Alert time is required.";
                }
                break;
            case "userId":
                if (!value) {
                    errorMsg = "Employee name is required.";
                }
                break;
            case "departmentId":
                if (!value) {
                    errorMsg = "Department is required.";
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: errorMsg,
        }));
    };




    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedFormData = {
                ...formData,
                alertTime: (new Date(selectedTime)).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
            };

            if (editingRow) {
                await axiosInstance.put(`${updatePurpose}/${editingRow.id}`, updatedFormData);
                toast.success("Form updated successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: {
                        color: "#0075a8"
                    },
                });
            } else {
                await axiosInstance.post(createPurpose, updatedFormData);
                toast.success("Form submitted successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: {
                        color: "#0075a8"
                    },
                });
            }

            setFormData({
                purposeBrief: "",
                purposeFor: null,
                unitId: null,
                alertTime: '',
                userId: null,
                alert: false,
                departmentId: null,
            });
            handleCloseDrawer();
            fetchData();
        } catch (error) {
            console.error('Error submitting form:', error.message);
            toast.error("Error submitting form. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#0075a8"
                },
            });
        }
    };

    const handleEdit = () => {
        if (selectedRows.length !== 1) {
            return;
        }

        const rowToEdit = selectedRows[0];
        setFormData({
            purposeBrief: rowToEdit.purposeBrief,
            purposeFor: rowToEdit.purposeFor,
            unitId: rowToEdit.unitId,
            alertTime: rowToEdit.alertTime,
            userId: rowToEdit.userId,
            alert: rowToEdit.alert,
            departmentId: rowToEdit.departmentId,
        });

        setEditingRow(rowToEdit);
        setOpen(true);
    };


    const handleCopy = () => {
        const dataString = filteredData.map(row => Object.values(row).join('\t')).join('\n');
        navigator.clipboard.writeText(dataString);
        toast.success("Table data copied successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                // backgroundColor: 'rgb(60,86,91)',
                color: "#0075a8"
            },
        });
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

    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadExcelPurposeData, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Purpose.xlsx');

            toast.success("Purpose data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading Purpose data:', error.message);
            toast.error("Error downloading Purpose data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const handleDelete = async () => {
        if (selectedRows.length === 0) {
            return;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete the selected Purpose?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deleteRequests = selectedRows.map(row => axiosInstance.delete(`${deletePurposeData}/${row.id}`));
                    await Promise.all(deleteRequests);
                    toast.success("Purpose deleted successfully!", {
                        autoClose: 3000,
                        position: "top-right",
                        style: {
                            backgroundColor: 'color: "#0075a8"',
                        },
                    });

                    fetchData(currentPage, rowsPerPage);
                } catch (error) {
                    toast.error(`Error deleting purpose: ${error.message}`, {
                        autoClose: 3000,
                        position: "top-right",
                    });
                    console.error('Error deleting purpose:', error.message);
                }
            }
        });
    };

    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit') {
            handleEdit(); // Trigger edit functionality
        }
    };


    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };
    const handleAutocompleteChangeDept = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            departmentId: newValue ? newValue.value : null,
        }));
    };
    const handleAutocompleteChangeEmp = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userId: newValue ? newValue.value : null,
        }));
    };
    const handleAutocompleteChangePurpose = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            purposeFor: newValue ? newValue.value : null,
        }));
    };

    const handleReset = () => {
        setFormData({
            purposeBrief: "",
            purposeFor: null,
            unitId: null,
            alertTime: '',
            userId: null,
            alert: true,
            departmentId: null,
        });
        setErrors({});
    };




    const addInstantVisitors = (
        <>
            <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar} >
                <Typography color="white" style={{ marginLeft: "10px", marginTop: "10px" }}>Add Purpose</Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Autocmp
                            label="Purpose For"
                            options={data}
                            value={data.find(option => option.value === formData.purposeFor) || null}
                            onChange={handleAutocompleteChangePurpose}
                            error={!!errors.purposeFor}
                            helperText={errors.purposeFor}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            label="Purpose"
                            name="purposeBrief"
                            value={formData.purposeBrief}
                            onChange={handleChange}
                            error={!!errors.purposeBrief}
                            helperText={errors.purposeBrief}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box display="flex" style={{ gap: "15px" }}>
                        <Typography marginTop="10px"> Alert Option</Typography>
                        <ReusableRadioButton
                            // label="Alert Option"
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]}
                            defaultValue="no"
                            onChange={(value) => {

                                handleChange('approvalRequired', value);
                                setShowAdditionalFields(value === "yes");
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Autocmp
                            label="Unit ID"
                            options={unitIds}
                            value={unitIds.find(option => option.value === formData.unitId) || null}
                            onChange={handleAutocompleteChange}
                            error={!!errors.unitId}
                            helperText={errors.unitId}
                        />


                    </Box>
                </Grid>
                {showAdditionalFields && (
                    <>
                        <Grid item lg={6} md={6} xs={12} sm={12}>
                            <Box>
                                <ReusableTimePicker
                                    label="Alert After"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12} sm={12}>
                            <Box>
                                <Autocmp
                                    label="Department"
                                    options={departmentData}
                                    value={departmentData.find(option => option.value === formData.departmentId) || null}
                                    onChange={handleAutocompleteChangeDept}
                                    error={!!errors.departmentId}
                                    helperText={errors.departmentId}
                                />

                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12} sm={12}>
                            <Box>
                                <Autocmp
                                    name="userId"
                                    label="Employee Name"
                                    value={user.find(option => option.value === formData.userId) || null}
                                    options={user}
                                    onChange={handleAutocompleteChangeEmp}
                                    error={!!errors.userId}
                                    helperText={errors.userId}
                                />
                            </Box>
                        </Grid>
                    </>
                )}
            </Grid>
            <Grid container>
                <Grid item lg={12} md={12} xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ml: "25px", flexDirection: "row", gap: "20px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                size="medium"
                                type="submit"
                                onClick={handleSubmit}
                                variant="contained"
                                backgroundColor={colors.navbar}
                                style={{ fontSize: "12px", borderRadius: "10px" }}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Reset"
                                size="small"
                                type="submit"
                                variant="contained"
                                fontSize="12px"
                                onClick={handleReset}
                                style={styles.resetButton}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Cancel"
                                size="medium"
                                onClick={handleCloseDrawer}
                                style={{ backgroundColor: "red", fontSize: "12px", color: "white", borderRadius: "10px" }}
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
            <ToastContainer style={{ marginTop: '45px' }} />
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
            {/* <Box >
                <Typography variant="h6" style={{ marginTop: "-15px" }}>Purpose View</Typography>
             </Box> */}

            <Grid container spacing={3}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box backgroundColor={colors.navbar}>
                        <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Purpose View</Typography>
                        {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
                    </Box>
                </Grid>
                <Box boxShadow={3} padding={2} borderRadius={2} marginLeft="20px" marginTop="9px" width="100%">
                    <Grid item lg={4} md={4} sm={12} xs={12} >
                        <Box >
                            <Box marginBottom={2} display="flex" style={{ gap: "10px" }}>
                                <Texxt
                                    label="Search By Number"
                                    size="small"
                                    placeholder="Enter Number"
                                    value={searchNumber}
                                    onChange={handleSearchNumberChange}
                                />
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
                                            <Autocmp size="small" label="Purpose" options={data}
                                                onChange={(event, value) => handleAutocompleteChange(value)}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <Autocmp size="small" label="Purpose For" options={data}
                                                onChange={(event, value) => handleAutocompleteChange(value)}
                                            />
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            <Box style={{ gap: "10px", marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                                <ButtonComponent
                                    variant="contained" style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }} backgroundColor={colors.navbar}
                                    name="Submit" size="small" />
                                <ButtonComponent
                                    size="small"
                                    variant="contained"
                                    style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                    backgroundColor={colors.navbar}
                                    name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                    onClick={handleMoreFiltersClick}
                                // style={{ marginLeft: "10px", fontSize: "10px" }}
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
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            onSearch={handleSearch}
                            data={filteredData}
                            columns={columns}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}
                            selectableRows
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
                            copyEnabled={true}
                            onCopy={handleCopy}
                            downloadEnabled={true}
                            onDownloadXLSX={handleDownloadXLSX}
                            selectableRowsHighlight
                        />
                    </Box>
                </Grid>
                {/* <FloatingButton options={floatingActionButtonOptions}
                    bottomOffset="100px"
                    onButtonClick={handleFloatingButtonClick} /> */}
            </Grid>

            <FloatingButton options={floatingActionButtonOptions}
                bottomOffset="100px"
                onButtonClick={handleFloatingButtonClick} />
        </>
    )
}

export default Purpose;