import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, IconButton, SwipeableDrawer } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Texxt from '../../../components/Textfield';
import Autocmp from '../../../components/AutoComplete';
import CustomDataTable from '../../../components/ReactDataTable';
import { addDepartment, deleteDepartmentsData, unitIdDD, getDepartmentsData, downloadDepartmentsData, updateDepartment } from '../../../Api/Api';
import axios from 'axios';
import FloatingButton from '../../../components/FloatingButton';
import { Add } from "@mui/icons-material";
import { Close as CloseIcon } from '@mui/icons-material';
import ButtonComponent from '../../../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import colors from '../../colors';
import axiosInstance from '../../../components/Auth';
import Swal from 'sweetalert2';

const dateOptions = [
    { label: "Date Wise", value: "dateWise" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Weekly", value: "weekly" },
    { label: "Yearly", value: "yearly" },
];

const statusOptions = [
    { label: "Active", value: "active" },
    { label: "In Active", value: "inactive" },
];

const ViewDepartment = () => {
    const [open, setOpen] = useState(false);
    const [visitorsData, setVisitorsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [status, setStatus] = useState("active");
    const [unitIds, setUnitIds] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [formData, setFormData] = useState([{
        unitId: null,
        departmentName: "",
        departmentCode: ""
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [deptToEdit, setdeptToEdit] = useState(null);

    const [errors, setErrors] = useState([
        {
            departmentName: '',
            departmentCode: '',
            unitId: ''
        }
    ]);
    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    const handleRefresh = () => {
        console.log('Refresh clicked');
    };

    const handleStatusChange = (event, newValue) => {
        setStatus(newValue ? newValue.value : '');
    };

    const columns = [
        {
            name: 'Select',
            selector: 'select',
            cell: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleRowSelected(row)} />,
            sortable: false,
        },
        { name: 'Department Name', selector: row => row.departmentName, sortable: true },
        { name: 'Department Code', selector: row => row.departmentCode, sortable: true },
        { name: 'Created By', selector: row => row.createdBy, sortable: true },
        { name: 'Updated By', selector: row => row.updatedBy, sortable: true },
        {
            name: 'Created At',
            selector: row => formatDate(row.createdAt),
            sortable: true
        },
        {
            name: 'Status',
            cell: (row) => row.status ? 'Active' : 'Inactive',
            sortable: true,
        },
    ];


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


    const fetchData = async (page = 1, size = 10) => {
        try {
            // console.log(`Fetching data for page ${page} with size ${size}`);
            const response = await axiosInstance.get(`${getDepartmentsData}`, {
                params: {
                    page: page - 1, // Adjust if necessary for 0-based index
                    size: size
                }
            });
            // console.log('API Response:', response.data); // Log the response data
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

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
        fetchUnitIds();
    }, [currentPage, rowsPerPage]);


    const floatingActionButtonOptions = selectedRows.length === 0 ? [
        { label: 'Add', icon: <Add /> },
    ] : selectedRows.length === 1 ? [
        { label: 'Edit', icon: <EditIcon /> },
        { label: 'Delete', icon: <DeleteIcon /> },
    ] : [
        { label: 'Delete', icon: <DeleteIcon /> },
    ];
    const handleAddDepartment = () => {
        setFormData([
            ...formData,
            {
                unitId: null,
                departmentName: "",
                departmentCode: ""
            }
        ]);
        setErrors([
            ...errors,
            {
                departmentName: '',
                departmentCode: '',
                unitId: ''
            }
        ]);
    };

    const handleRemoveDepartment = (index) => {

        const updatedFormData = [...formData];
        updatedFormData[index] = {
            ...updatedFormData[index],
            departmentName: "New Department Name"
        };
        setFormData(updatedFormData);


        const updatedErrors = [...errors];
        updatedErrors.splice(index, 1);
        setErrors(updatedErrors);
    };

    const handleInputChange = (index, field, value) => {
        const updatedFormData = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);
    };
    const handleRowSelected = (row) => {
        const updatedData = filteredData.map((item) =>
            item === row ? { ...item, selected: !item.selected } : item
        );
        setFilteredData(updatedData);
        const selected = updatedData.filter(item => item.selected);
        setSelectedRows(selected);
    };

    const handleSearch = (searchText) => {
        const filtered = visitorsData.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };
    const handleAutocompleteChange = (index, event, newValue) => {
        const updatedFormData = [...formData];
        updatedFormData[index].unitId = newValue ? newValue.value : null;
        setFormData(updatedFormData);
    };

    const validateForm = () => {
        const newErrors = formData.map(data => {
            const errors = {};
            if (!data.departmentName) {
                errors.departmentName = "Department is required";
            }

            if (!data.unitId) {
                errors.unitId = "Unit ID is required";
            }

            if (!data.departmentCode) {
                errors.departmentCode = "Department Code is required";
            }

            return errors;
        });

        setErrors(newErrors);

        return newErrors.every(error => Object.keys(error).length === 0);
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         try {

    //             const formDataToSend = {
    //                 unitId: formData[0].unitId,
    //                 departmentName: formData[0].departmentName,
    //                 departmentCode: formData[0].departmentCode
    //             };

    //             // Get token from axiosInstance or wherever it's stored
    //             // const token = axiosInstance.defaults.headers.common['Authorization'];

    //             // Sending POST request to the API with token in headers
    //             const response = await axiosInstance.post(`${addDepartment}`, formDataToSend, {
    //                 // headers: {
    //                 //     'Authorization': token
    //                 // }
    //             });

    //             console.log('Form submitted:', formData);

    //             // Reset form and close drawer
    //             setFormData([{ unitId: null, departmentName: "", departmentCode: "" }]);
    //             setOpen(false);
    //             toast.success("Department added successfully!", {
    //                 autoClose: 3000,
    //                 position: "top-right",
    //                 style: {
    //                     color: "#0075a8"
    //                 },
    //             });
    //             fetchData(currentPage, rowsPerPage);
    //         } catch (error) {
    //             toast.error("Failed to add department", {
    //                 autoClose: 3000,
    //                 position: "top-right",
    //                 style: {
    //                     color: "red"
    //                 },
    //             });
    //         }
    //     }
    // };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (isEditing) {
                // Update existing plan
                const response = await axiosInstance.put(`${updateDepartment}/${deptToEdit.id}`, formData[0]);
                toast.success("Plant updated successfully!", {
                    autoClose: 3000,
                    position: "top-right",
                    style: {
                        backgroundColor: 'color: "#0075a8"',
                    },
                });
            } else {
                // Create new plant
                const response = await axiosInstance.post(addDepartment, formData);
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
            setFormData([{
                unitId: null,
                departmentName: "",
                departmentCode: ""
            }]);
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

    const handleEdit = () => {
        const dept = selectedRows[0];
        setdeptToEdit(dept);
        setFormData([
            {
                unitId: dept.unitId,
                departmentName: dept.departmentName,
                departmentCode: dept.departmentCode,
            }
        ]);
        setIsEditing(true);
        setOpen(true);
    };



    const handleDelete = async () => {
        if (selectedRows.length === 0) {
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete the selected departments?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            width: 350,
            height: 350,
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deleteRequests = selectedRows.map(row =>
                        axiosInstance.delete(`${deleteDepartmentsData}/${row.id}`)
                    );
                    await Promise.all(deleteRequests);

                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Departments deleted successfully!',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        width: 350,
                        height: 350, // Custom width
                        timer: 3000,
                        timerProgressBar: true
                    });

                    fetchData(currentPage, rowsPerPage);
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: `Error deleting departments: ${error.message}`,
                        icon: 'error',
                        confirmButtonColor: '#d33',
                        timer: 3000,
                        timerProgressBar: true
                    });
                    console.error('Error deleting departments:', error.message);
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

    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit') {
            handleEdit()
        }
    };

    const handlePageChange = (page) => {
        // console.log(`Page changed to ${page}`);
        setCurrentPage(page);
        fetchData(page, rowsPerPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1); // Reset to the first page when changing rows per page
        fetchData(1, newRowsPerPage);
    };


    const addInstantVisitors = (
        <>
            <ToastContainer style={{ marginTop: '45px' }} />

            <Box component="form" sx={{ mt: "63px", mb: "20px", gap: "10px" }}>
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box component="form" sx={{ mt: "0px", mb: "20px", gap: "10px" }} >
                            <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar}>
                                        <Typography variant="h6" color="white" ml="10px">Add Department</Typography>
                                        <IconButton onClick={handleCloseDrawer}>
                                            <CloseIcon style={{ color: "white" }} />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box px={2}>
                            {formData.map((data, index) => (
                                <Box key={index} mb={2} style={{ marginBottom: '20px' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Autocmp
                                                id={`unitId-${index}`}
                                                options={unitIds}
                                                value={unitIds.find((option) => option.value === data.unitId) || null}
                                                label="Unit Name"
                                                size="small"
                                                required
                                                onChange={(event, newValue) => handleAutocompleteChange(index, event, newValue)}
                                                error={Boolean(errors[index]?.unitId)}
                                                helperText={errors[index]?.unitId}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Texxt
                                                id={`departmentName-${index}`}
                                                value={data.departmentName}
                                                label="Department Name"
                                                size="small"
                                                required
                                                onChange={(e) => handleInputChange(index, 'departmentName', e.target.value)}
                                                error={Boolean(errors[index]?.departmentName)}
                                                helperText={errors[index]?.departmentName}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Texxt
                                                id={`departmentCode-${index}`}
                                                value={data.departmentCode}
                                                label="Department Code"
                                                size="small"
                                                required
                                                onChange={(e) => handleInputChange(index, 'departmentCode', e.target.value)}
                                                error={Boolean(errors[index]?.departmentCode)}
                                                helperText={errors[index]?.departmentCode}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            {index === formData.length - 1 && (
                                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ textAlign: 'center' }}>
                                                    <Box style={{ gap: "20px" }}>
                                                        <IconButton onClick={handleAddDepartment}>
                                                            <AddIcon style={{ color: "white", backgroundColor: "green", borderRadius: "50%", width: "40px", height: "40px" }} />
                                                        </IconButton>
                                                        {formData.length > 1 && (
                                                            <IconButton onClick={() => handleRemoveDepartment(index)} >
                                                                <RemoveIcon style={{ color: "white", backgroundColor: "red", borderRadius: "50%", width: "40px", height: "40px" }} />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px" }}>
                        <ButtonComponent name="Save" variant="contained" size="small" backgroundColor={colors.navbar} onClick={handleSubmit} />
                        {/* <ButtonComponent name="Reset" variant="contained" size="small" style={styles.resetButton} onClick={handleReset} /> */}
                        <ButtonComponent name="Cancel" variant="contained" style={{ color: "white", backgroundColor: "red" }} size="small" onClick={handleCloseDrawer} />

                    </Box>
                </Grid>
            </Box>
        </>
    );

    const handleCopy = () => {
        const dataString = filteredData.map(row => Object.values(row).join('\t')).join('\n');
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
            const response = await axiosInstance.get(downloadDepartmentsData, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'departments.xlsx');

            toast.success("Departments data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading Departments data:', error.message);
            toast.error("Error downloading Departments data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const handleAddVisitorClick = () => {
        setOpen(true);
    };

    const handleFormClick = () => {
        setOpen(true);
    };


    return (
        <>

            {/* <ToastContainer style={{ marginTop: '45px', color: "white" }} /> */}
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
                <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>View Department</Typography>
                {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
            </Box>
            {/* <hr style={{ width: "100%" }} /> */}
            <Box boxShadow={3} p={3} borderRadius={2} marginTop="10px">
                <Grid container spacing={3}>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Box>
                            <Texxt
                                label="Search"
                                placeholder="Enter Data"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Box>
                            <Autocmp
                                label="Department"
                                name="department"
                                size="small"
                                variant="outlined"
                                options={dateOptions}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Box>
                            <Autocmp
                                name="status"
                                size="small"
                                label="Status"
                                variant="outlined"
                                options={statusOptions}
                                onChange={handleStatusChange}
                            // onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} marginTop="10px">
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box boxShadow={3} borderRadius={2} bgcolor={colors.navbar} height="35px" borderWidth="0">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" mt="8px" variant="h10" fontSize="12px" color="white">Filtered By : Active</Typography>
                            {/* <Typography mr="10px" variant="h10" color="white">Count = 0 </Typography> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable
                            title="Visitors"
                            columns={columns}
                            data={filteredData}
                            selectableRows
                            onSelectedRowsChange={(selectedRows) => setSelectedRows(selectedRows)}
                            clearSelectedRows={!selectedRows.length}
                            pagination
                            paginationServer={false} // Ensure this is false for client-side pagination
                            paginationTotalRows={totalRows} // Ensure paginationTotalRows reflects the totalRows state
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            subHeader
                            subHeaderComponent={<>
                                <IconButton color="primary" onClick={handleRefresh}>
                                    <RefreshIcon />
                                </IconButton>
                            </>}
                            onSearch={handleSearch}
                            searchPlaceholder="Search Department"
                            copyEnabled
                            downloadEnabled
                            onCopy={handleCopy}
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

export default ViewDepartment;
