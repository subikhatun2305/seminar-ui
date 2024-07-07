

import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton, Button, Typography } from '@mui/material';
import Texxt from '../../components/Textfield';
import ReusableRadioButton from '../../components/RadioButton';
import Autocmp from '../../components/AutoComplete';
import ButtonComponent from '../../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import CustomCheckbox from './../../components/CheckBox';
import colors from '../colors';
import { Search as SearchIcon } from '@mui/icons-material';
import { departmentDropDown, userDD, dropDownPurpose, unitIdDD, createInstantVisitors, getAllVisitorsCount } from '../../Api/Api';
import axiosInstance from '../../components/Auth';
import DatePickers from '../../components/DateRangePicker';

const departmentOptions = [
    { label: 'HR', value: 'hr' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Marketing', value: 'marketing' },
];




const AddInstantVisitors = () => {
    const [formErrors, setFormErrors] = useState({});
    const [user, setUser] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [unitIds, setUnitIds] = useState([]);

    const [formData, setFormData] = useState({

        visitorName: '',
        visitorcompany: '',
        departmentId: null,
        purposeId: null,
        userId: null,
        visitorAddress: '',
        possessionAllowed: '',
        visitorCardNo: '',
        vehicleNumber: '',
        laptop: '',
        approvalRequired: true,
        validFrom: null,
        validTill: null,
        mail: true,
        sms: true,
        unitId: null,
    });

    const [errors, setErrors] = useState({

        name: '',
        visitorcompany: '',
        departmentId: null,
        purposeId: null,
        userId: null,
        visitorAddress: '',
        possessionAllowed: '',
        visitorCardNo: '',
        vehicleNumber: '',
        laptop: '',
        approvalRequired: true,
        validFrom: null,
        validTill: null,
        mail: true,
        sms: true,
        unitId: null,
    });
    const [departmentData, setDepartmentData] = useState([]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = (values) => {
        const errors = {};
        // const numberRegex = /^\d{10}$/;

        // if (!values.number) {
        //     errors.number = "Number is required";
        // } else if (!numberRegex.test(values.number)) {
        //     errors.number = "Number must be 10 digits";
        // }

        if (!values.visitorName) {
            errors.visitorName = "Visitor Name is required";
        } else if (values.visitorName.length < 2 || values.visitorName.length > 19) {
            errors.visitorName = "Visitor Name must be between 2 and 19 characters";
        }

        if (!values.visitorcompany) {
            errors.visitorcompany = "Visitor Company is required";
        } else if (values.visitorcompany.length < 2 || values.visitorcompany.length > 45) {
            errors.visitorcompany = "Visitor Company name must be between 2 and 45 characters";
        }

        if (!values.department) {
            errors.department = "Department is required";
        }

        if (!values.userId) {
            errors.userId = "Employee Name is required";
        }
        if (!values.expDate) {
            errors.expDate = "Date field is required";
        }

        if (!values.purposeId) {
            errors.purposeId = "purposeId is required";
        }
        if (!values.unitId) {
            errors.unitId = "unitId is required";
        }
        if (!values.departmentId) {
            errors.departmentId = "departmentId is required";
        }
        if (!values.possessionAllowed) {
            errors.possessionAllowed = "possessionAllowed is required";
        }
        if (!values.vehicleNumber) {
            errors.vehicleNumber = "Vehicle Number is required";
        }
        if (!values.visitorAddress) {
            errors.visitorAddress = "Visitor Address is required";
        }

        return errors;
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);
        console.log('Form data before submission:', formData);

        // if (Object.keys(errors).length === 0) {

        const formDataToSubmit = new FormData();

        // Append each field to the FormData object
        formDataToSubmit.append('visitorName', formData.visitorName);
        formDataToSubmit.append('visitorcompany', formData.visitorcompany);
        formDataToSubmit.append('departmentId', formData.departmentId);
        formDataToSubmit.append('purposeId', formData.purposeId);
        formDataToSubmit.append('userId', formData.userId);

        formDataToSubmit.append('unitId', formData.unitId);
        formDataToSubmit.append('visitorAddress', formData.visitorAddress);
        formDataToSubmit.append('possessionAllowed', formData.possessionAllowed);
        formDataToSubmit.append('visitorCardNo', formData.visitorCardNo);
        formDataToSubmit.append('vehicleNumber', formData.vehicleNumber);
        formDataToSubmit.append('laptop', formData.laptop);
        formDataToSubmit.append('approvalRequired', formData.approvalRequired);
        formDataToSubmit.append('mail', formData.mail);
        formDataToSubmit.append('sms', formData.sms);

        // Convert and append date fields 
        if (formData.validFrom) {
            let validFromValue = new Date(formData.validFrom.target.value);
            let formattedValidFrom = validFromValue.toISOString().substring(0, 19); // Extract the first 19 characters for YYYY-MM-DDTHH:MM:SS
            formDataToSubmit.append('validFrom', formattedValidFrom);
        }
        if (formData.validTill) {
            let validTillValue = new Date(formData.validTill.target.value);
            let formattedValidTill = validTillValue.toISOString().substring(0, 19); // Extract the first 19 characters for YYYY-MM-DDTHH:MM:SS
            formDataToSubmit.append('validTill', formattedValidTill);
        }

        try {
            const response = await axiosInstance.post(`${createInstantVisitors}`, formDataToSubmit);
            console.log('API response:', response.data);
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    color: "#0075a8"
                },
            });


            setFormData({

                visitorName: '',
                visitorcompany: '',
                departmentId: null,
                purposeId: null,
                userId: null,
                unitId: null,
                visitorAddress: '',
                possessionAllowed: '',
                visitorCardNo: '',
                vehicleNumber: '',
                laptop: '',
                approvalRequired: true,
                validFrom: null,
                validTill: null,
                mail: true,
                sms: true
            });
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
        // } else {

        // }
    };


    const handleReset = () => {
        setFormData({

            visitorName: '',
            visitorcompany: '',
            department: null,
            purposeId: null,
            userId: null,
            unitId: null,
            visitorAddress: '',
            possessionAllowed: '',
            visitorCardNo: '',
            vehicleNumber: '',
            laptop: '',
            approvalRequired: true,
            mail: true,
            sms: true
        });
        setFormErrors({});
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

    const handleAutocompleteChangeEmp = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            userId: newValue ? newValue.value : null,
        }));
    };

    const handleAutocompleteChange = (event, newValue) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            unitId: newValue ? newValue.value : null,
        }));
    };


    useEffect(() => {
        // fetchData(currentPage, rowsPerPage);
        fetchUnitIds();
        fetchPurposeDD();
        fetchDepartmentDD();
        fetchUserDD();
    }, []);

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
    const handleDateChangeFrom = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                validFrom: date,
            }));
        }
    };

    const handleDateChangeTill = (date) => {
        if (date) {
            setFormData((prevData) => ({
                ...prevData,
                validTill: date,
            }));
        }
    };


    return (
        <>
            <ToastContainer style={{ marginTop: '60px' }} toastStyle={{ color: 'white' }} />
            <Box sx={{}}>
                <Grid container spacing={1} sx={{ p: 1 }}>
                    <Grid item lg={10} md={10} sm={12} xs={12}>
                        <Box style={{ gap: "10px" }}>
                            <Texxt
                                name="number"
                                size="small"
                                type="number"
                                label="Number"
                                placeholder="Enter Number"
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={1} md={1} sm={12} xs={12}>
                        <Box marginTop="10px">
                            <Button variant="contained">
                                <SearchIcon />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={1} sx={{ p: 1 }}>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorName"
                                size="small"
                                type="text"
                                required
                                label="Visitor Name"
                                placeholder="Enter Visitor Name"
                                error={formErrors.visitorName}
                                helperText={formErrors.visitorName}
                                value={formData.name}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorcompany"
                                size="small"
                                required
                                type="text"
                                label="Visitor Company"
                                placeholder="Enter Visitor Company Name"
                                error={formErrors.visitorcompany}
                                helperText={formErrors.visitorcompany}
                                value={formData.visitorcompany}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
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
                            {formErrors.unitId && (
                                <Typography fontSize="12px" color="error">{formErrors.unitId}</Typography>
                            )}

                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="visitorAddress"
                                size="small"
                                type="text"
                                label="Visitor Address"
                                required
                                error={formErrors.visitorAddress}
                                helperText={formErrors.visitorAddress}
                                placeholder="Enter Visitor Address"
                                value={formData.visitorAddress}
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
                                name="userId"
                                label="Employee Name"
                                required
                                value={user.find(option => option.value === formData.userId) || null}
                                options={user}
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
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box>
                            <Texxt
                                name="possessionAllowed"
                                size="small"
                                type="text"
                                required
                                label="Possession Allowed"
                                placeholder="Enter Data"
                                error={formErrors.possessionAllowed}
                                helperText={formErrors.possessionAllowed}
                                value={formData.possessionAllowed}
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
                                required
                                type="text"
                                label="Vehicle Number"
                                placeholder="Enter Vehicle Number"
                                value={formData.vehicleNumber}
                                error={formErrors.vehicleNumber}
                                helperText={formErrors.vehicleNumber}
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
                                placeholder="Enter Data"
                                value={formData.laptop}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
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
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box style={{ marginTop: "10px" }}>
                            <DatePickers
                                label="Valid From"
                                placeholder="Valid From"
                                value={formData.expDate}
                                handleInputChange={handleDateChangeFrom}
                                required
                            />
                            {formErrors.expDate && (
                                <Typography fontSize="12px" color="error">{formErrors.expDate}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box style={{ marginTop: "10px" }}>
                            <DatePickers
                                label="Valid Till"
                                placeholder="Valid Till"
                                value={formData.expDate}
                                handleInputChange={handleDateChangeTill}
                                required
                            />
                            {formErrors.expDate && (
                                <Typography fontSize="12px" color="error">{formErrors.expDate}</Typography>
                            )}

                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        <Box display="flex" style={{ gap: "5px" }}>
                            <Typography marginTop="12px">Approval Required</Typography>

                            <ReusableRadioButton
                                // label="Approval Required"
                                options={[
                                    { label: "Yes", value: "yes" },
                                    { label: "No", value: "no" }
                                ]}
                                defaultValue="yes"
                                onChange={(value) => handleChange('approvalRequired', value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                        {/* <Box>
                            <Typography>Notify Employee</Typography>
                        </Box> */}
                        <Box display="flex" style={{ gap: "5px" }}>
                            <Typography marginTop="10px">Notify Employee</Typography>

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
                <Grid container>
                    <Grid item lg={12} md={12} xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", ml: "25px", flexDirection: "row", gap: "20px", marginBottom: "20px" }}>
                            <Box>
                                <ButtonComponent
                                    name="Submit"
                                    size="small"
                                    type="submit"
                                    onClick={handleSubmit}
                                    variant="contained"
                                    backgroundColor={colors.navbar}
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

export default AddInstantVisitors;

