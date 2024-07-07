import { Grid, Box } from '@mui/material'
import React, { useState } from 'react'
import Texxt from '../../../components/Textfield'
import ButtonComponent from '../../../components/Button'
import { toast, ToastContainer, POSITION } from 'react-toastify';
import colors from '../../colors'
const EditUser = () => {

    const [formData, setFormData] = useState({
        name: "",
        communicationName: "",
        employeeId: "",
        mobileNumber: "",
        emailId: "",
    })

    const [formErrors, setFormErrors] = useState({});
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const validate = (values) => {
        const errors = {};
        const numberRegex = /^\d{10}$/;

        if (!values.name) {
            errors.name = "Name is required";
        }
        if (!values.communicationName) {
            errors.communicationName = "Communication Name is required";
        }
        if (!values.employeeId) {
            errors.employeeId = "Employee ID  is required";
        }
        if (!values.mobileNumber) {
            errors.mobileNumber = "Number is required";
        } else if (!numberRegex.test(values.mobileNumber)) {
            errors.mobileNumber = "Number must be 10 digits";
        }
        return errors;
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);


        if (Object.keys(errors).length === 0) {
            console.log('Form data before submission:', formData);
            toast.success("User Edited ", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: 'rgb(60,86,91)',
                    color: "#0075a8",
                },
            });
            setFormData({
                name: "",
                communicationName: "",
                employeeId: "",
                mobileNumber: "",
                emailId: "",
            })

        } else {
            toast.error("Validation Error! Please check the form for errors.", {
                autoClose: 3000,
                position: "top-right",
                style: {
                    // backgroundColor: 'rgb(60,86,91)',
                    color: "#0075a8",
                },
            });

        }




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
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    return (
        <>
            <ToastContainer style={{ marginTop: '60px' }} />
            <Box boxShadow={3} p={2} borderRadius={3}>
                <Grid container spacing={1}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box>
                            <Texxt
                                name="name"
                                size="small"
                                required
                                placeholder="Enter Data"
                                label="Name"
                                value={formData.name}
                                error={formErrors.name}
                                helperText={formErrors.name}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>

                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <Box>
                            <Texxt
                                name="communicationName"
                                size="small"
                                required
                                placeholder="Enter Data"
                                label="Communication Name"
                                value={formData.communicationName}
                                error={formErrors.communicationName}
                                helperText={formErrors.communicationName}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <Box>
                            <Texxt
                                name="employeeId"
                                size="small"
                                required
                                placeholder="Enter Data"
                                label="Employee Id"
                                value={formData.employeeId}
                                error={formErrors.employeeId}
                                helperText={formErrors.employeeId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <Box>
                            <Texxt
                                name="mobileNumber"
                                type="number"
                                size="small"
                                required
                                placeholder="Enter Data"
                                label="Mobile Number"
                                value={formData.mobileNumber}
                                error={formErrors.mobileNumber}
                                helperText={formErrors.mobileNumber}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                        <Box>
                            <Texxt
                                name="emailId"
                                // type="number"
                                size="small"
                                // required
                                placeholder="Enter Data"
                                label="Email Id"
                                value={formData.emailId}
                                error={formErrors.emailId}
                                helperText={formErrors.emailId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Box>
                            <ButtonComponent
                                name="Save"
                                size="medium"
                                variant="contained"
                                backgroundColor={colors.navbar}
                                style={{ fontSize: "10px" }}
                                onClick={handleSubmit}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default EditUser
