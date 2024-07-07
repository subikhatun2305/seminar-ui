import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, IconButton, SwipeableDrawer } from '@mui/material';
import Tooltip from '@mui/material/Tooltip'; // Make sure Tooltip is imported from the correct location
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Texxt from '../../../components/Textfield';
import Autocmp from '../../../components/AutoComplete';
import CustomDataTable from '../../../components/ReactDataTable';
import { user_api } from '../../../Api/Api';
import axios from 'axios';
import FloatingButton from '../../../components/FloatingButton';
import { Add } from "@mui/icons-material";
import { Close as CloseIcon } from '@mui/icons-material';
import ButtonComponent from '../../../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReusableCheckbox from '../../../components/CheckBox';
import { Lock } from "@mui/icons-material"; // Import the Lock icon for Reset Password
import VisibilityIcon from '@mui/icons-material/Visibility';
import colors from './../../colors';


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

const info = [
    { label: "Mail", value: "mail" }, {
        label: "SMS", value: "sms"
    }
]
const accessRight = [
    {
        label: "HR", value: "hr"
    },
    {
        label: "Admin", value: "admin"
    },

]

const dept = [
    { label: "A", value: "a" },

    { label: "B", value: "b" },

    { label: "C", value: "c" },
]

const unmapped = [
    { label: "A", value: "a" },

    { label: "B", value: "b" },

    { label: "C", value: "c" },
]

const User = () => {
    const [open, setOpen] = useState(false);
    const [visitorsData, setVisitorsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [status, setStatus] = useState("active");
    const [selectedRows, setSelectedRows] = useState([]);
    const [information, setInformation] = useState(false);

    const [formData, setFormData] = useState({
        department: null,
        unmappedUser: null,
        mobileNumber: '',
        emailId: '',
        userType: null,
        loginId: '',
        password: '',
        confirmPassword: '',
        accessRights: null,
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


    const [errors, setErrors] = useState({});

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

    const handleCheckboxChangeInfo = (e) => {
        const { name, checked } = e.target;
        setInformation(checked);
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.unmappedUser) {
            newErrors.unmappedUser = 'unmapped User is required';
        }
        if (!formData.department) {
            newErrors.department = 'Department is required';
        }
        if (!formData.userType) {
            newErrors.userType = 'user Type   is required';
        }
        if (!formData.loginId) {
            newErrors.loginId = 'loginId   is required';
        }
        if (!formData.loginId) {
            newErrors.loginId = 'Login ID is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.accessRights) {
            newErrors.accessRights = 'Access Rights is required';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form Data:', formData);

            setFormData({
                department: null,
                unmappedUser: null,
                mobileNumber: '',
                emailId: '',
                userType: null,
                loginId: '',
                password: '',
                confirmPassword: '',
                accessRights: null,
            })

            // For demonstration, always showing success. Implement actual form validation and error handling as needed.
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: "rgb(60,86,91)",
                    color: "#0075a8"
                },
            });
        } else {
            toast.error("Please correct the highlighted errors.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: "rgb(60,86,91)",
                    color: "#0075a8"
                },
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const renderIconButton = (label, icon) => (
        <Tooltip title={label}>
            <IconButton  >{icon}</IconButton>
        </Tooltip>
    );

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
                [name]: value
            });
        }
    };

    const handleDelete = () => {
        if (selectedRows.length > 0) {
            const remainingData = filteredData.filter(item => !selectedRows.includes(item));
            setFilteredData(remainingData);
            setSelectedRows([]);
            toast.success("Selected rows deleted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: "rgb(60,86,91)",
                    color: "#0075a8"
                },
            });
        }
    };

    const handleFloatingButtonClick = (label) => {
        if (label === 'Add') {
            handleAddVisitorClick();
        } else if (label === 'Delete') {
            handleDelete();
        } else if (label === 'Edit') {
            // Handle edit action here
        }
    };


    const addInstantVisitors = (
        <>
            {/* <ToastContainer style={{ marginTop: '60px' }} /> */}
            <Box sx={{ backgroundColor: '#f2f2f2', width: "100%", height: "550px" }}>
                <Box component="form" sx={{ mt: "63px", gap: "10px" }} >
                    <Grid container spacing={2} style={{ p: "10px" }}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar}>
                                <Typography variant="h6" color="white" mt="5px" ml="10px">ADD User</Typography>
                                <IconButton onClick={handleCloseDrawer}>
                                    <CloseIcon style={{ color: "white" }} />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box p={2}>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Autocmp
                                    name="department"
                                    label="Department"
                                    value={formData.department}
                                    options={dept}
                                    required
                                    size="small"
                                    onChange={(e, value) => handleChange(e, "department", value)}
                                    renderInput={(params) => (
                                        <Texxt {...params}
                                            name="department"
                                            error={errors.department}
                                            helperText={errors.department}
                                            placeholder="Department"
                                            size="small" />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Autocmp
                                    label="UnMapped user"
                                    name="unmappedUser"
                                    options={unmapped}
                                    value={formData.unmappedUser}
                                    required size="small"
                                    onChange={(e, value) => handleChange(e, "unmappedUser", value)}
                                    renderInput={(params) => (
                                        <Texxt {...params}
                                            name="unmappedUser"
                                            error={errors.unmappedUser}
                                            helperText={errors.unmappedUser}
                                            placeholder="UnMapped user"
                                            size="small" />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Autocmp
                                    label="User Type"
                                    name="userType"
                                    required
                                    options={unmapped}
                                    size="small"
                                    value={formData.userType}
                                    onChange={(e, value) => handleChange(e, "userType", value)}
                                    renderInput={(params) => (
                                        <Texxt {...params}
                                            name="userType"
                                            error={errors.userType}
                                            helperText={errors.userType}
                                            placeholder="User Type"
                                            size="small" />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Texxt
                                    label="Login Id"
                                    required
                                    placeholder="Enter Data" size="small"
                                    name="loginId"
                                    value={formData.loginId}
                                    onChange={handleChange}
                                    error={errors.loginId}
                                    helperText={errors.loginId}
                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Texxt
                                    label="Passwoord" size="small"
                                    name="password"
                                    value={formData.password}
                                    required
                                    placeholder="Enter Password"
                                    onChange={handleChange}
                                    error={errors.password}
                                    helperText={errors.password}

                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Texxt
                                    label="Confirm Passwoord" size="small"
                                    name="confirmPassword"
                                    value={formData.confirmPassword} required
                                    placeholder="Enter Password"
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                />
                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box>
                                <Autocmp
                                    label="Access Rights"
                                    size="small"
                                    name="accessRights"
                                    value={formData.accessRights}
                                    options={accessRight}
                                    required
                                    onChange={(e, value) => handleChange(e, "accessRights", value)}
                                    renderInput={(params) => (
                                        <Texxt {...params}
                                            name="accessRights"
                                            error={errors.accessRights}
                                            helperText={errors.accessRights}
                                            placeholder="Access Rights"
                                            size="small" />
                                    )}
                                />

                            </Box>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px" }}>
                                <Typography marginTop="10px" >Send Info</Typography>
                                <ReusableCheckbox
                                    name="sendInformation"
                                    value={information}
                                    onChange={handleCheckboxChangeInfo}
                                    // label="Send Info"
                                    options={info}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={1} sx={{ p: 3 }}>

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px" }}>

                            <ButtonComponent name="Submit" variant="contained" backgroundColor={colors.navbar} size="small" onClick={handleFormSubmit} />
                            <ButtonComponent name="Cancel" variant="contained" style={{ backgroundColor: "red", color: "white" }} size="small" onClick={handleCloseDrawer} />
                            <ButtonComponent name="Reset" variant="contained" size="small" style={styles.resetButton}
                            />
                        </Box>
                    </Grid>
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

    const handleDownloadXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");
        const wbout = XLSX.write(wb, { type: 'array', bookType: "xlsx" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const fileName = 'table_data.xlsx';
        saveAs(blob, fileName);
        toast.success("Table data downloaded as XLSX successfully!", {
            autoClose: 3000,
            position: "top-right",
            style: {
                // backgroundColor: "rgb(60,86,91)",
                color: "#0075a8"
            },
        });
    };

    const handleAddVisitorClick = () => {
        setOpen(true);
    };
    const handleAutocompleteChange = (value) => {
        // console.log("Selected value:", value);
        // Handle the selected value here
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
                <Box sx={{ width: '600px' }}>
                    {addInstantVisitors}
                </Box>
            </SwipeableDrawer>


            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box backgroundColor={colors.navbar}>
                    <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Manage Users</Typography>
                    {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
                </Box>
            </Grid>
            {/* <hr style={{ width: "100%" }} /> */}
            <Box boxShadow={3} p={3} borderRadius={2} marginTop="8px">
                <Grid container spacing={3}>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Box>
                            <Texxt
                                label="Search Mobile"
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
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Box>
                            <Autocmp
                                name="status"
                                size="small"
                                label="User Type"
                                variant="outlined"
                                options={statusOptions}
                                onChange={handleStatusChange}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} style={{ marginTop: "5px" }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box boxShadow={3} borderRadius={2} bgcolor={colors.navbar} height="35px" borderWidth="0">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" mt="8px" variant="h10" fontSize="12px" color="white">Filtered By : </Typography>
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
                            copyEnabled={true}
                            onCopy={handleCopy}
                            onSelectedRowsChange={(selected) => setSelectedRows(selected.selectedRows)}

                            downloadEnabled={true}
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

export default User;
