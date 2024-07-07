import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import Texxt from '../../components/Textfield';
import Autocmp from '../../components/AutoComplete';
import { Search as SearchIcon } from '@mui/icons-material';
import ButtonComponent from '../../components/Button';
import colors from '../colors';
import { toast, ToastContainer } from 'react-toastify';

const purposeOptions = [
    { label: 'Meeting', value: 'meeting' },
    { label: 'Interview', value: 'interview' },
    { label: 'Delivery', value: 'delivery' },
];

const plantoptions = [
    { label: 'a', value: 'a' },
    { label: 'b', value: 'b' },
    { label: 'c', value: 'c' },
];

const WithMaterial = () => {
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        purpose: null,
        plant: null,
        driverNumber: "",
        driverName: "",
        vehicleType: "",
        vehicleNumber: "",
        locationFrom: "",
        vehicleOwner: "",
        ownerMobile: "",
        mDesc: "",
        quantity: "",
        invoiceNumber: "",
        billNo: "",
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
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    const validate = (values) => {
        const errors = {};
        const numberRegex = /^\d{10}$/;

        if (!values.driverNumber) {
            errors.driverNumber = "Driver Number is required";
        } else if (!numberRegex.test(values.driverNumber)) {
            errors.driverNumber = "Driver Number must be 10 digits";
        }

        if (!values.driverName) {
            errors.driverName = "Driver Name is required";
        } else if (values.driverName.length < 2 || values.driverName.length > 19) {
            errors.driverName = "Driver Name must be between 2 and 19 characters";
        }

        if (!values.purpose) {
            errors.purpose = "Purpose is required";
        }

        if (!values.plant) {
            errors.plant = "Plant is required";
        }

        if (!values.vehicleNumber) {
            errors.vehicleNumber = "Vehicle Number is required";
        }

        if (!values.locationFrom) {
            errors.locationFrom = "Location From is required";
        }

        if (!values.vehicleOwner) {
            errors.vehicleOwner = "Field is required";
        }

        if (!values.ownerMobile) {
            errors.ownerMobile = "Owner Mobile is required";
        }

        if (!values.mDesc) {
            errors.mDesc = "Field is required";
        }

        return errors;
    };

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("Form Data:", formData);  // Log the form data to the console
            toast.success("Form submitted successfully!", {
                autoClose: 3000,
                position: "top-right",
                style: { color: "#0075a8" },
            });
            setFormData({
                purpose: null,
                plant: null,
                driverNumber: "",
                driverName: "",
                vehicleType: "",
                vehicleNumber: "",
                locationFrom: "",
                vehicleOwner: "",
                ownerMobile: "",
                mDesc: "",
                quantity: "",
                invoiceNumber: "",
                billNo: "",
            });
        } else {
            toast.error("Validation Error! Please check the form for errors.", {
                autoClose: 3000,
                position: "top-right",
                style: { color: "#0075a8" },
            });
        }
    };

    return (
        <>
            <ToastContainer style={{ marginTop: '60px' }} toastStyle={{ color: 'white' }} />
            <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Driver Mobile"
                            name="driverNumber"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.driverNumber}
                            helperText={formErrors.driverNumber}
                            onChange={(e) => handleChange('driverNumber', e.target.value)}
                            value={formData.driverNumber}
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
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Driver Name"
                            name="driverName"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.driverName}
                            helperText={formErrors.driverName}
                            onChange={(e) => handleChange('driverName', e.target.value)}
                            value={formData.driverName}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Autocmp
                            options={purposeOptions}
                            label="Visit Purpose"
                            size="small"
                            placeholder="Select Purpose"
                            required
                            value={formData.purpose}
                            onChange={(event, newValue) => handleChange('purpose', newValue)}
                            error={formErrors.purpose}
                            helperText={formErrors.purpose}
                            getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Type"
                            name="vehicleType"
                            placeholder="Enter Data"
                            size='small'
                            onChange={(e) => handleChange('vehicleType', e.target.value)}
                            value={formData.vehicleType}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Number"
                            name="vehicleNumber"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.vehicleNumber}
                            helperText={formErrors.vehicleNumber}
                            onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                            value={formData.vehicleNumber}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Location From"
                            name="locationFrom"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.locationFrom}
                            helperText={formErrors.locationFrom}
                            onChange={(e) => handleChange('locationFrom', e.target.value)}
                            value={formData.locationFrom}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Autocmp
                            label="Plant To"
                            options={plantoptions}
                            size="small"
                            placeholder="Select Plant"
                            required
                            value={formData.plant}
                            onChange={(event, newValue) => handleChange('plant', newValue)}
                            error={formErrors.plant}
                            helperText={formErrors.plant}
                            getOptionLabel={(option) => option.label}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Vehicle Owner"
                            name="vehicleOwner"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.vehicleOwner}
                            helperText={formErrors.vehicleOwner}
                            onChange={(e) => handleChange('vehicleOwner', e.target.value)}
                            value={formData.vehicleOwner}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Owner Mobile"
                            name="ownerMobile"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.ownerMobile}
                            helperText={formErrors.ownerMobile}
                            onChange={(e) => handleChange('ownerMobile', e.target.value)}
                            value={formData.ownerMobile}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Material Description"
                            name="mDesc"
                            required
                            placeholder="Enter Data"
                            size='small'
                            error={formErrors.mDesc}
                            helperText={formErrors.mDesc}
                            onChange={(e) => handleChange('mDesc', e.target.value)}
                            value={formData.mDesc}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Quantity"
                            name="quantity"
                            placeholder="Enter Data"
                            size='small'
                            onChange={(e) => handleChange('quantity', e.target.value)}
                            value={formData.quantity}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="Invoice Number"
                            name="invoiceNumber"
                            placeholder="Enter Data"
                            size='small'
                            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                            value={formData.invoiceNumber}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Box>
                        <Texxt
                            label="No. Of Bill"
                            name="billNo"
                            placeholder="Enter Data"
                            size='small'
                            onChange={(e) => handleChange('billNo', e.target.value)}
                            value={formData.billNo}
                        />
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} marginTop="10px">
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ gap: "10px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                variant="contained"
                                size="small"
                                onClick={handleSubmit}
                                backgroundColor={colors.navbar}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Reset"
                                variant="contained"
                                size="small"
                                style={styles.resetButton}
                                onClick={() => setFormData({
                                    purpose: null,
                                    plant: null,
                                    driverNumber: "",
                                    driverName: "",
                                    vehicleType: "",
                                    vehicleNumber: "",
                                    locationFrom: "",
                                    vehicleOwner: "",
                                    ownerMobile: "",
                                    mDesc: "",
                                    quantity: "",
                                    invoiceNumber: "",
                                    billNo: "",
                                })}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default WithMaterial;
