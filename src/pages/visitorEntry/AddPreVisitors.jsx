import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, IconButton, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import Texxt from '../../components/Textfield';
import CustomCheckbox from '../../components/CheckBox';
import ReusableRadioButton from '../../components/RadioButton';
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import { toast, ToastContainer, POSITION } from 'react-toastify';
import colors from '../colors';
import { Search as SearchIcon } from '@mui/icons-material';
import { otpPreRequest, createInstantVisitors, departmentDropDown, userDD, dropDownPurpose, unitIdDD } from './../../Api/Api';
import axiosInstance from './../../components/Auth';

const AddPreVisitors = () => {
    const [formErrors, setFormErrors] = useState({});
    const [otpData, setOtpData] = useState(null);
    const [user, setUser] = useState([]);

    const [formData, setFormData] = useState({
        number: '',
        visitorName: '',
        visitorCompany: '',
        departmentId: '',
        purposeId: '',
        userId: '',
        visitorAddress: '',
        possessionsAllowed: '',
        visitorCardNo: '',
        vehicleNumber: '',
        laptop: '',
        unitId: '',
        mail: true,
        sms: true
    });

    const [otp, setOtp] = useState('');
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [purposeOptions, setPurposeOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [unitIds, setUnitIds] = useState([]);
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = (values) => {
        const errors = {};

        const numberRegex = /^\d{10}$/;

        if (!values.number) {
            errors.number = "Number is required";
        } else if (!numberRegex.test(values.number)) {
            errors.number = "Number must be 10 digits";
        }

        if (!values.visitorName) {
            errors.visitorName = "Visitor Name is required";
        } else if (values.visitorName.length < 2 || values.visitorName.length > 19) {
            errors.visitorName = "Visitor Name must be between 2 and 19 characters";
        }

        if (!values.visitorCompany) {
            errors.visitorCompany = "Visitor Company is required";
        } else if (values.visitorCompany.length < 2 || values.visitorCompany.length > 45) {
            errors.visitorCompany = "Visitor Company name must be between 2 and 45 characters";
        }

        if (!values.department) {
            errors.department = "Department is required";
        }

        if (!values.employeeName) {
            errors.employeeName = "Employee Name is required";
        }

        if (!values.purpose) {
            errors.purpose = "Purpose is required";
        }

        return errors;
    };

    const fetchOtpData = async () => {
        try {
            const response = await axiosInstance.get(`${otpPreRequest}/${otp}`);
            if (response.data) {
                return response.data;
            } else {
                throw new Error('OTP not found');
            }
        } catch (error) {
            console.log(error);
            toast.error("OTP not found! Please enter a valid OTP.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#ff0000"
                },
            });
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

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleSearchClick = async () => {
        const data = await fetchOtpData();
        if (data) {
            setOtpData(data);
        }
    };

    useEffect(() => {
        if (otpData) {
            setFormData({
                number: otpData.mobile || '',
                visitorName: otpData.name || '',
                visitorCompany: otpData.organizationName || '',
                departmentId: otpData.meetingPurpose.department.id || '',
                purposeId: otpData.meetingPurpose.id || '',
                userId: otpData.meetingPurpose.user.id || '',
                visitorAddress: otpData.address || '',
                possessionsAllowed: otpData.possessionsAllowed || '',
                unitId: otpData.unitId || '',
                visitorCardNo: '',
                vehicleNumber: '',
                laptop: '',
                mail: true,
                sms: true
            });


        }
    }, [otpData]);

    useEffect(() => {
        fetchDepartmentDD();
        fetchPurposeDD();
        fetchUnitIds();
        fetchUserDD();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);
        console.log('Form data before submission:', formData);
        try {
            const response = await axiosInstance.post(`${createInstantVisitors}`, formData);
            console.log('API response:', response.data);
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#0075a8"
                },
            });

            setFormData({
                number: '',
                visitorName: '',
                visitorCompany: '',
                departmentId: '',
                purposeId: '',
                userId: '',
                visitorAddress: '',
                possessionsAllowed: '',
                visitorCardNo: '',
                vehicleNumber: '',
                laptop: '',
                unitId: '',
                mail: true,
                sms: true
            });

            // Reset options for Autocomplete components
            setDepartmentOptions([]);
            setPurposeOptions([]);
            setEmployeeOptions([]);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Error submitting form. Please try again.", {
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
            number: '',
            visitorName: '',
            visitorCompany: '',
            department: '',
            purpose: '',
            employeeName: '',
            visitorAddress: '',
            possessionsAllowed: '',
            visitorCardNo: '',
            vehicleNumber: '',
            laptop: '',
            unitId: '',
            mail: true,
            sms: true
        });
        setFormErrors({});
        setDepartmentOptions([]);
        setPurposeOptions([]);
        setEmployeeOptions([]);
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
    const handleAutocompleteChangePurposeDD = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            purposeId: newValue ? newValue.value : null,
        }));
    };
    const handleAutocompleteChangeEmp = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userId: newValue ? newValue.value : null,
        }));
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

    return (
        <>
            <ToastContainer style={{ marginTop: '60px', color: "white" }} />
            <Box component="form" sx={{}}>
                <Grid container spacing={1} sx={{ p: 1 }}>
                    <Grid item lg={10} md={10} sm={12} xs={12}>
                        <Box display="flex" style={{ gap: "10px" }}>
                            <Texxt
                                name="otp"
                                size="small"
                                type="number"
                                label="Visitors OTP"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={handleOtpChange}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={1} md={1} sm={12} xs={12}>
                        <Box marginTop="10px">
                            <Button variant="contained" onClick={handleSearchClick}>
                                <SearchIcon />
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="number"
                                size="small"
                                required
                                type="number"
                                label="Number"
                                placeholder="Enter Number"
                                error={formErrors.number}
                                helperText={formErrors.number}
                                value={formData.number}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorName"
                                size="small"
                                required
                                type="text"
                                label="Visitor Name"
                                placeholder="Enter Visitor Name"
                                error={formErrors.visitorName}
                                helperText={formErrors.visitorName}
                                value={formData.visitorName}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorCompany"
                                size="small"
                                required
                                type="text"
                                label="Visitor Company"
                                placeholder="Enter Visitor Company"
                                error={formErrors.visitorCompany}
                                helperText={formErrors.visitorCompany}
                                value={formData.visitorCompany}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Autocmp
                                label="Department"
                                name="departmentId"
                                options={departmentData}
                                size="small"
                                required
                                value={departmentData.find(option => option.value === formData.departmentId) || null}
                                onChange={handleAutocompleteChangeDept}
                            // error={!!errors.departmentId}
                            // helperText={errors.departmentId}
                            />
                            {formErrors.departmentId && (
                                <Typography fontSize="12px" color="error">{formErrors.departmentId}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Autocmp
                                name="purposeId"
                                label="Purpose"
                                size="small"
                                required
                                value={purpose.find(option => option.value === formData.purposeId) || null}
                                options={purpose}
                                onChange={handleAutocompleteChangePurposeDD}
                            // error={formErrors.purposeId}
                            // helperText={formErrors.purposeId}
                            />
                            {formErrors.purposeId && (
                                <Typography fontSize="12px" color="error">{formErrors.purposeId}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Autocmp
                                name="userId"
                                label="Employee Name"
                                required
                                options={user}
                                value={user.find(option => option.value === formData.userId) || null}
                                size="small"
                                onChange={handleAutocompleteChangeEmp}
                            // error={!!errors.userId}
                            // helperText={errors.userId}
                            />
                            {formErrors.userId && (
                                <Typography fontSize="12px" color="error">{formErrors.userId}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box>
                            <Autocmp
                                label="Unit ID"
                                required
                                options={unitIds}
                                value={unitIds.find(option => option.value === formData.unitId) || null}
                                onChange={handleAutocompleteChange}
                                // error={!!errors.unitId}
                                size="small"
                            // helperText={errors.unitId}
                            />

                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorAddress"
                                size="small"
                                type="text"
                                label="Visitor Address"
                                placeholder="Enter Visitor Address"
                                value={formData.visitorAddress}
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
                                placeholder="Enter Possession Allowed"
                                value={formData.possessionsAllowed}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorCardNo"
                                size="small"
                                type="text"
                                label="Visitor Card No"
                                placeholder="Enter Visitor Card No"
                                value={formData.visitorCardNo}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="vehicleNumber"
                                size="small"
                                type="text"
                                label="Vehicle Number"
                                placeholder="Enter Vehicle Number"
                                value={formData.vehicleNumber}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="laptop"
                                size="small"
                                type="text"
                                label="Laptop"
                                placeholder="Enter Laptop Details"
                                value={formData.laptop}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box display="flex" alignItems="center">
                            <CustomCheckbox
                                name="mail"
                                label="Mail"
                                checked={formData.mail}
                                onChange={(e) => handleChange(e.target.name, e.target.checked)}
                            />
                            <CustomCheckbox
                                name="sms"
                                label="SMS"
                                checked={formData.sms}
                                onChange={(e) => handleChange(e.target.name, e.target.checked)}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item lg={12} md={12} xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ml: "25px", flexDirection: "row", gap: "20px", marginBottom: "20px" }}>
                            <Box>
                                <ButtonComponent
                                    name="Submit"
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    backgroundColor={colors.navbar}
                                    onClick={handleSubmit}
                                />
                            </Box>
                            <Box>
                                <ButtonComponent
                                    name="Reset"
                                    size="small"
                                    variant="contained"
                                    onClick={handleReset}
                                    style={styles.resetButton}
                                />
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default AddPreVisitors;
