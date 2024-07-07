import React, { useState, useEffect } from 'react';
import { Box, SwipeableDrawer, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FloatingActionButtons from '../components/FloatingButton';
import Texxt from '../components/Textfield';
import ButtonComponent from "../components/Button";
import Autocmp from '../components/AutoComplete';
import axios from 'axios';
import { user_api } from '../Api/Api';
import CustomDataTable from '../components/ReactDataTable';

export default function SwipeableTemporaryDrawer() {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        Name: '',
        Email: '',
        Number: '',
        Address: '',
        Department: '',
        Details: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const toggleDrawer = (isOpen) => {
        setOpen(isOpen);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFormClick = () => {
        setOpen(true);
    };

    const handleSearch = (event) => {
        const text = event.target.value;
        setFilterText(text);
        const filteredItems = fetchedData.filter(
            item =>
                (item.Name && item.Name.toLowerCase().includes(text.toLowerCase())) ||
                (item.Email && item.Email.toLowerCase().includes(text.toLowerCase())) ||
                (item.Number && item.Number.toString().includes(text)) ||
                (item.Address && item.Address.toLowerCase().includes(text.toLowerCase())) ||
                (item.Department && item.Department.toLowerCase().includes(text.toLowerCase())) ||
                (item.Details && item.Details.toLowerCase().includes(text.toLowerCase()))
        );
        setFilteredData(filteredItems);
    };

    const validate = (values) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const numberRegex = /^\d{10}$/;

        if (!values.Name) {
            errors.Name = "Name is required";
        } else if (values.Name.length < 2 || values.Name.length > 19) {
            errors.Name = "Name must be between 2 and 19 characters";
        }

        if (!values.Email) {
            errors.Email = "Email is required";
        } else if (!emailRegex.test(values.Email)) {
            errors.Email = "This is not a valid email format";
        }

        if (!values.Number) {
            errors.Number = "Number is required";
        } else if (!numberRegex.test(values.Number)) {
            errors.Number = "Number must be a 10-digit numeric value";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        setIsSubmit(true);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post(user_api, formValues, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Form data saved:', response.data);

                setFormValues({
                    Name: '',
                    Email: '',
                    Number: '',
                    Address: '',
                    Department: '',
                    Details: ''
                });

                handleCloseDrawer();
                fetchData(); // Fetch updated data
                toast.success('Form submitted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch (error) {
                console.error('There was a problem with the Axios request:', error);

            }

        }
    };

    // Define fetchData function
    const fetchData = async () => {
        try {
            const response = await axios.get(user_api);
            setFetchedData(response.data);
            setFilteredData(response.data); // Set filtered data as well
            console.log('Fetched data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            setIsSubmit(false);
        }
    }, [formErrors, isSubmit]);

    // Fetch data from the API when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            name: 'Name',
            selector: row => row.Name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.Email,
            sortable: true,
        },
        {
            name: 'Number',
            selector: row => row.Number,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.Address,
            sortable: true,
        },
        {
            name: 'Department',
            selector: row => row.Department,
            sortable: true,
        },
        {
            name: 'Details',
            selector: row => row.Details,
            sortable: true,
        },
    ];

    const list = (


        <Box component="form" sx={{ mt: "70px", mb: "20px" }}>

            <Grid container spacing={2} sx={{ p: 3 }}>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Texxt
                            name="Name"
                            size="small"
                            required
                            type="text"
                            label="Name"
                            placeholder="Enter Name"
                            error={formErrors.Name}
                            helperText={formErrors.Name}
                            onChange={handleChange}
                            value={formValues.Name}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Texxt
                            name="Email"
                            size="small"
                            required
                            label="Email"
                            placeholder="Enter Email"
                            error={formErrors.Email}
                            helperText={formErrors.Email}
                            onChange={handleChange}
                            value={formValues.Email}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Texxt
                            name="Number"
                            size="small"
                            required
                            type="number"
                            label="Number"
                            placeholder="Enter Number"
                            error={formErrors.Number}
                            helperText={formErrors.Number}
                            onChange={handleChange}
                            value={formValues.Number}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Texxt
                            name="Address"
                            size="small"
                            type="text"
                            label="Address"
                            placeholder="Enter Address"
                            onChange={handleChange}
                            value={formValues.Address}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Autocmp
                            name="Department"
                            label="Department"
                            size="small"
                            required
                            onChange={handleChange}
                            value={formValues.Department}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Box>
                        <Texxt
                            name="Details"
                            label="Details"
                            required
                            placeholder="Enter Details"
                            size="small"
                            rows="2"
                            multiline
                            onChange={handleChange}
                            value={formValues.Details}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item lg={6} md={6} xs={12}>
                    <Box sx={{ display: "flex", ml: "25px", flexDirection: "row", gap: "20px" }}>
                        <Box>
                            <ButtonComponent
                                name="Submit"
                                size="small"
                                type="submit"
                                style={{ backgroundColor: "#3C565B" }}
                                onClick={handleSubmit}
                            />
                        </Box>
                        <Box>
                            <ButtonComponent
                                name="Close"
                                size="small"
                                style={{ backgroundColor: "#C34A2C" }}
                                onClick={handleCloseDrawer}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>

    );

    return (
        <>
            <ToastContainer />
            <SwipeableDrawer
                anchor="top"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                {list}
            </SwipeableDrawer>

            <Box sx={{ mt: 2 }}>
                <CustomDataTable
                    columns={columns}
                    filteredData={filteredData}
                    filterText={filterText}
                    handleSearch={handleSearch}
                />
            </Box>

            <FloatingActionButtons onFormClick={handleFormClick} />
        </>
    );
}
