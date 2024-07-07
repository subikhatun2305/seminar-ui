import { Grid, FormControl, Box, IconButton, Typography, Tooltip, SwipeableDrawer } from '@mui/material';
import { Search } from '@mui/icons-material';
import React, { useState, useEffect } from 'react'
import Texxt from '../../components/Textfield';
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import CustomDataTable from '../../components/ReactDataTable';
import axios from 'axios';
import { user_api, unitIdDD, dropDownPurpose, createPreVisitor, getAllPreVisitor, getAllPreVisitorStatusCount, downloadPreVisitorsExcel } from '../../Api/Api';
import { Add, ExitToApp } from "@mui/icons-material";
import FloatingButton from '../../components/FloatingButton';
import { Close as CloseIcon } from '@mui/icons-material';
import ReusableCheckbox from '../../components/CheckBox';
import ReusableRadioButton from '../../components/RadioButton';
import { toast, ToastContainer, POSITION } from 'react-toastify';
import DatePickers from '../../components/DateRangePicker';
import CustomCheckbox from '../../components/CheckBox';
import colors from '../colors';
import ReusableTimePicker from '../../components/TimePicker';
import axiosInstance from '../../components/Auth';
import { saveAs } from "file-saver";



const PreRequest = () => {
    const [open, setOpen] = useState(false);

    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [visitorsData, setVisitorsData] = useState([]);
    const [isExtendedPassRequestChecked, setIsExtendedPassRequestChecked] = useState(false);
    const [isPreferableHoursChecked, setIsPreferableHoursChecked] = useState(false);
    const [unitIds, setUnitIds] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [startHours, setStartHours] = useState();
    const [endHours, setEndHours] = useState();

    const [formData, setFormData] = useState({
        unitId: null,
        status: true,
        name: "",
        mobile: '',
        email: "",
        organizationName: "",
        address: "",
        possessionsAllowed: "",
        meetingPurposeId: null,
        meetingSchedule: null,
        startHours: "",
        endHours: "",
        location: "",
        mail: true,
        sms: true
        // "meetingStatus": ""

    });
    const [formErrors, setFormErrors] = useState({});
    const [visitorsStatusCount, setVisitorsStatusCount] = useState({

        Cancelled: 0,
        Pending: 0,
        Done: 0,
        Rescheduled: 0

    })


    const floatingActionButtonOptions = [
        { label: 'Add', icon: <Add /> },
        // { label: 'Calender View', icon: <ExitToApp /> },
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
        { name: 'mobile', selector: row => row.mobile, sortable: true },
        { name: 'address', selector: row => row.address, sortable: true },
        { name: 'location', selector: row => row.location, sortable: true },
        { name: 'organizationName', selector: row => row.organizationName, sortable: true },

        // { name: 'startHours', selector: row => row.startHours, sortable: true },
        // { name: 'endHours', selector: row => row.endHours, sortable: true },
        { name: 'possessionsAllowed', selector: row => row.possessionsAllowed, sortable: true },
        { name: 'organizationName', selector: row => row.organizationName, sortable: true },
        // { name: 'organizationName', selector: row => row.organizationName, sortable: true },
        // { name: 'organizationName', selector: row => row.organizationName, sortable: true },

    ];

    const handleMoreFiltersClick = () => {
        setShowMoreFilters(!showMoreFilters);
    };

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(getAllPreVisitor);
            const activePlants = response.data.filter(plant => plant.status === true);
            setVisitorsData(activePlants);
            setFilteredData(activePlants);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchVisitorsStatusCount = async () => {
        try {
            const response = await axiosInstance.get(getAllPreVisitorStatusCount);
            setVisitorsStatusCount(response.data)
        } catch (error) {

        }
    }

    // console.log(visitorsStatusCount, "data");

    const fetchUnitIds = async () => {
        try {
            const response = await axiosInstance.get(`${unitIdDD}`);
            const unitIdOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setUnitIds(unitIdOptions);
            // console.log('Unit IDs:', unitIdOptions); 

        } catch (error) {
            console.error('Error fetching unit IDs:', error.message);
        }
    };

    const fetchPurposeDD = async () => {
        try {
            const response = await axiosInstance.get(`${dropDownPurpose}`);
            const userOptions = response.data.map(unit => ({ label: unit.name, value: unit.id }));
            setPurpose(userOptions)
            console.log('ddPurpose:', userOptions);
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };

    const handleDownloadXLSX = async () => {
        try {
            const response = await axiosInstance.get(downloadPreVisitorsExcel, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'PreVisitors.xlsx');

            toast.success("Pre Visitors data downloaded successfully!", {
                autoClose: 3000,
                position: "top-right",
            });
        } catch (error) {
            console.error('Error downloading Pre Visitors data:', error.message);
            toast.error("Error downloading Pre Visitors data. Please try again later.", {
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    useEffect(() => {
        fetchData();
        fetchUnitIds();
        fetchPurposeDD();
        fetchVisitorsStatusCount();
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
            item === row ? { ...item, selected: true } : { ...item, selected: false }
        );
        setFilteredData(updatedData);
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
    const handlePreferableHoursChange = (event) => {
        setIsPreferableHoursChecked(event.target.checked);
    };

    const handleChange = (name, value) => {
        if (name === 'pass') {
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });

        }
    };

    const handleDateChangeTill = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                meetingSchedule: date,
            }));
        }
    };

    const validate = (values) => {
        const errors = {};
        const numberRegex = /^\d{10}$/;

        if (!values.mobile) {
            errors.mobile = "Number is required";
        } else if (!numberRegex.test(values.mobile)) {
            errors.mobile = "Number must be 10 digits";
        }

        if (!values.name) {
            errors.name = "Visitor Name is required";
        } else if (values.name.length < 2 || values.name.length > 50) {
            errors.name = "Visitor Name must be between 2 and 19 characters";
        }

        if (!values.organizationName) {
            errors.organizationName = "Organization Name is required";
        } else if (values.organizationName.length < 3 || values.organizationName.length > 45) {
            errors.organizationName = "Organization Name name must be between 2 and 45 characters";
        }

        if (!values.unitId) {
            errors.unitId = "Unit Id is required";
        }

        if (!values.meetingPurposeId) {
            errors.meetingPurposeId = "Meeting Purpose is required";
        }

        if (!values.purposeId) {
            errors.purposeId = "purposeId is required";
        }
        if (!values.meetingSchedule) {
            errors.meetingSchedule = "Meeting Schedule is required";
        }

        return errors;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);
        const updatedFormData = {
            ...formData,
            meetingSchedule: formData.meetingSchedule == null ? '' : new Date(formData.meetingSchedule.target.value).toISOString().substring(0, 19),
            startHours: startHours == null ? startHours : new Date(startHours).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            endHours: endHours == null ? endHours : new Date(endHours).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
        };

        console.log(updatedFormData, "m");
        try {
            const response = await axiosInstance.post(createPreVisitor, updatedFormData);
            // console.log(response.data);
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#0075a8"
                },
            });
            setFormData({
                unitId: null,
                status: true,
                name: "",
                mobile: '',
                email: "",
                organizationName: "",
                address: "",
                possessionsAllowed: "",
                meetingPurposeId: null,
                meetingSchedule: null,
                startHours: "",
                endHours: "",
                location: "",
                mail: true,
                sms: true
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Validation Error! Please check the form for errors.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#0075a8"
                },
            });
        }
    };

    const handleReset = () => {
        setFormData({
            unitId: null,
            status: true,
            name: "",
            mobile: '',
            email: "",
            organizationName: "",
            address: "",
            possessionsAllowed: "",
            meetingPurposeId: null,
            meetingSchedule: "",
            startHours: "",
            endHours: "",
            location: "",
            mail: true,
            sms: true
        });
        setFormErrors({});
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

    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };
    const handleAutocompleteChangePurposeDD = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            meetingPurposeId: newValue ? newValue.value : null,
        }));
    };
    const handleTimeChangeStartHours = (newTime) => {
        console.log("New Time Selected:", newTime);
        setStartHours(newTime);
        setFormData((prevFormData) => ({
            ...prevFormData,
            startHours: newTime,
        }));
    };
    const handleTimeChangeEndHours = (newTime) => {
        // console.log("New Time Selected:", newTime);
        setEndHours(newTime);
        setFormData((prevFormData) => ({
            ...prevFormData,
            endHours: newTime,
        }));
    };
    const addInstantVisitors = (
        <>
            <Box display="flex" justifyContent="space-between" backgroundColor={colors.navbar}  >
                <Typography color="white" style={{ marginLeft: "10px", marginTop: "10px" }}>Visitor Pre Request</Typography>
                <IconButton onClick={handleCloseDrawer}>
                    <CloseIcon style={{ color: "white", marginRight: "10px" }} />
                </IconButton>
            </Box>
            <Grid container spacing={1} sx={{ p: 3 }}>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="organizationName"
                            size="small"
                            type="text"
                            required
                            label="Visitor Organization"
                            placeholder="Enter Visitor Organization Name"
                            error={formErrors.organizationName}
                            helperText={formErrors.organizationName}
                            value={formData.organizationName}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="name"
                            size="small"
                            type="text"
                            required
                            error={formErrors.name}
                            helperText={formErrors.name}
                            label="Visitor Name"
                            placeholder="Enter Visitor Name"
                            value={formData.name}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />

                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="mobile"
                            size="small"
                            required
                            type="number"
                            error={formErrors.mobile}
                            helperText={formErrors.mobile}
                            label="Visitor Number"
                            placeholder="Enter Visitor Number"
                            value={formData.mobile}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="email"
                            size="small"
                            type="text"
                            label="Visitor Email"
                            placeholder="Enter Visitor Email Id"
                            value={formData.email}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="address"
                            size="small"
                            type="text"

                            label="Visitor Address"
                            placeholder="Enter Visitor Address"
                            value={formData.address}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Texxt
                            name="possessionsAllowed"
                            size="small"
                            type="text"
                            label="Possession Allowed"
                            placeholder="Enter Data"
                            value={formData.possessionsAllowed}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Autocmp
                            name="meetingPurposeId"
                            label="Purpose"
                            size="small"
                            required
                            // error={formErrors.meetingPurposeId}
                            // helperText={formErrors.meetingPurposeId}
                            value={purpose.find(option => option.value === formData.meetingPurposeId) || null}
                            options={purpose}
                            onChange={handleAutocompleteChangePurposeDD}

                        />
                        {formErrors.meetingPurposeId && (
                            <Typography fontSize="14px" color="error">{formErrors.meetingPurposeId}</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box style={{ mt: "20px" }}>
                        <DatePickers
                            label="Meeting Schedule"
                            name="meetingSchedule"
                            required
                            // error={formErrors.meetingSchedule}
                            // helperText={formErrors.meetingSchedule}
                            placeholder="Meeting Schedule"
                            value={formData.meetingSchedule}
                            handleInputChange={handleDateChangeTill}
                        />
                        {formErrors.meetingSchedule && (
                            <Typography fontSize="14px" color="error">{formErrors.meetingSchedule}</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <Autocmp
                            label="Unit ID"
                            required
                            options={unitIds}
                            value={unitIds.find(option => option.value === formData.unitId) || null}
                            onChange={handleAutocompleteChange}
                            error={formErrors.meetingSchedule}
                            helperText={formErrors.meetingSchedule}
                            size="small"
                        />
                        {formErrors.unitId && (
                            <Typography fontSize="14px" color="error">{formErrors.unitId}</Typography>
                        )}

                    </Box>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box>
                        <CustomCheckbox
                            label="Extended Pass Request"
                            checked={formData.pass}
                            onChange={handleExtendedPassRequestChange}
                        />
                        {isExtendedPassRequestChecked && (
                            <DatePickers
                                label="Valid Till"
                                name="meetingSchedule"
                                placeholder="Valid Till"
                                value={formData.meetingSchedule}
                                // handleInputChange={handleInputChange}
                                onChange={(e) => handleChange('meetingSchedule', e.target.checked)} />
                        )}
                    </Box>
                </Grid>
                <Grid container >
                    <Grid item lg={12} md={12} xs={12} sm={12}>
                        <Box>
                            <CustomCheckbox
                                label="Preferable Hours"
                                checked={formData.pass}
                                onChange={handlePreferableHoursChange}
                            />
                            {isPreferableHoursChecked && (
                                <Box display="flex" style={{ gap: "10px" }}>
                                    <FormControl fullWidth>
                                        <ReusableTimePicker
                                            label="Start Hours"
                                            name="startHours"
                                            placeholder="Start Hours"
                                            size="small"
                                            value={startHours}
                                            onChange={handleTimeChangeStartHours}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <ReusableTimePicker
                                            label="End Hours"
                                            name="endHours"
                                            value={endHours}
                                            placeholder="End Hours"
                                            onChange={handleTimeChangeEndHours}
                                        />
                                    </FormControl>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12}>

                    <Box display="flex">
                        <Typography>Notify Employee</Typography>
                        <CustomCheckbox
                            label="Mail"
                            checked={formData.mail} onChange={(e) => handleChange('mail', e.target.checked)}
                        />
                        <CustomCheckbox
                            label="SMS"
                            checked={formData.sms} onChange={(e) => handleChange('sms', e.target.checked)}
                        />
                    </Box>
                </Grid>

            </Grid>
            <Grid container spacing={1} sx={{ p: 3 }}>
                <Grid item lg={12} md={12} xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ml: "25px", mb: "20px", flexDirection: "row", gap: "20px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                size="small"
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                backgroundColor={colors.navbar}
                            // style={{ backgroundColor: "rgb(60,86,91)", fontSize: "12px", color: "white" }}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Reset"
                                size="small"
                                variant="contained"
                                onClick={handleReset}
                                style={styles.resetButton}
                            // style={{ backgroundColor: "rgb(60,86,91)", fontSize: "12px", color: "white" }}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Cancel"
                                size="small"
                                onClick={handleCloseDrawer}
                                style={{ backgroundColor: "red", fontSize: "12px", color: "white" }}
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
            <Box backgroundColor={colors.navbar}>
                <Typography style={{ marginTop: "-15px", color: "white", marginLeft: "10px" }}>Visitors Pre Request</Typography>
                {/* <hr style={{ marginTop: "-0px", height: "4px", borderWidth: "0", color: "rgb(60,86,91)", backgroundColor: "rgb(60,86,91)" }} /> */}
            </Box>
            <Grid container spacing={3} >


                <Grid item lg={5} md={5} sm={12} xs={12} style={{ marginTop: "4px" }}>
                    {/* <Box boxShadow={3} padding={2} borderRadius={2}> */}
                    <Box>
                        <Box marginBottom={2} display="flex" style={{ gap: "10px" }}>
                            <Texxt placeholder="Enter Data" label="Search Visitors Activity" size="small" />
                            {/* <IconButton color="primary">
                                <Search />
                            </IconButton> */}
                        </Box>
                        <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                            <DatePickers
                                label="From Date"
                                // name="fromDate"
                                placeholder="From Date"
                                value={formData.fromDate}
                            // handleInputChange={handleInputChange}
                            />
                            <DatePickers
                                label="To Date"
                                // name="fromDate"
                                placeholder="To Date"
                                value={formData.toDate}
                            // handleInputChange={handleInputChange}
                            />
                        </Box>
                        {showMoreFilters && (
                            <>
                                <Box display="flex" style={{ gap: "10px", marginTop: "15px" }}>
                                    <FormControl fullWidth>
                                        <Autocmp size="small" label="Pending"
                                            onChange={(event, value) => handleAutocompleteChange(value)}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <Autocmp size="small" label="Purpose"
                                            onChange={(event, value) => handleAutocompleteChange(value)}
                                        />
                                    </FormControl>
                                </Box>

                            </>
                        )}
                        <Box style={{ gap: "10px", marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                            <ButtonComponent backgroundColor={colors.navbar} variant="contained" style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }} size="small" name="Submit" />
                            <ButtonComponent backgroundColor={colors.navbar} variant="contained"
                                style={{ borderRadius: "8px", fontSize: "12px", textTransform: "none" }}
                                name={showMoreFilters ? "Hide Filters" : "More Filters"}
                                onClick={handleMoreFiltersClick}
                                size="small"
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={7} md={7} sm={12} xs={12}>
                    <Box borderRadius={2} mt="10px">
                        <Box display="flex" flexDirection="row" gap="20px">
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="center" alignItems="center" backgroundColor="#413839" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Pending</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">{visitorsStatusCount.Pending}</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#007C80" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Done</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">{visitorsStatusCount.Done}</Typography></Box>
                            </Box>
                            <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="rgb(37,65,23)" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Rescheduled</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">{visitorsStatusCount.Rescheduled}</Typography></Box>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" gap="20px" mt="20px">
                            <Box width="50%" borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#FF4500" color="white">
                                <Typography variant="body1" mt="10px" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Cancelled</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">{visitorsStatusCount.Cancelled}</Typography></Box>
                            </Box>
                            {/* <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#AA6C39" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center" fontSize="12px">Missed</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1" fontSize="12px">0</Typography></Box>
                            </Box> */}
                            {/* <Box width="50%" boxShadow={1} padding={1} borderRadius={2} justifyContent="space-between" alignItems="center" backgroundColor="#800000" color="white">
                                <Typography variant="body1" display="flex" justifyContent="center" alignItems="center">Rejected</Typography>
                                <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="body1">0</Typography></Box>
                            </Box> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box boxShadow={3} borderRadius={2} backgroundColor={colors.navbar} height="35px" borderWidth="0">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography ml="10px" mt="8px" variant="h10" fontSize="10px" color="white">Filtered By : </Typography>
                            {/* <Typography mr="10px" variant="h10" color="white">Count = 0 </Typography> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box width="100%" boxShadow={3} padding={2} borderRadius={2} bgcolor='white'>
                        <CustomDataTable columns={columns} data={filteredData} onSearch={handleSearch} downloadEnabled={true}
                            copyEnabled={true}
                            onDownloadXLSX={handleDownloadXLSX}
                        />
                    </Box>
                </Grid>
                <FloatingButton options={floatingActionButtonOptions} bottomOffset="100px" onButtonClick={handleAddVisitorClick} />
            </Grid>
        </>
    )
}

export default PreRequest;
