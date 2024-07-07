import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../components/Auth'; // Ensure the path is correct
import { getAllVisitors } from '../../../Api/Api';
import ReusableTable from '../../../components/ReactTable';

const columns = [
    { name: 'Visitor Name', selector: row => row.visitorName, sortable: true },
    { name: 'Visitor Company', selector: row => row.visitorCompany, sortable: true },
    { name: 'Visitor Address', selector: row => row.visitorAddress, sortable: true },
    { name: 'Driver Name', selector: row => row.driverName, sortable: true },
    { name: 'Purpose', selector: row => row.purpose.purposeFor, sortable: true },
    { name: 'Exp Date', selector: row => row.expDate, sortable: true },
    { name: 'Employee Mobile', selector: row => row.user.mobile, sortable: true },
    { name: 'Department', selector: row => row.department.departmentName, sortable: true },
    { name: 'Time In', selector: row => row.createdAt, sortable: true },
    { name: 'Possession Allowed', selector: row => row.possessionAllowed, sortable: true },
    { name: 'Visitor Card Number', selector: row => row.visitorCardNumber, sortable: true },
    { name: 'Vehicle Number', selector: row => row.vehicleNumber, sortable: true },
    { name: 'Laptop', selector: row => row.laptop, sortable: true },
];

const ViewContact = () => {
    const [visitorsData, setVisitorsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(getAllVisitors);
            const activeVisitors = response.data.content.filter(visitor => visitor.status === true);
            setVisitorsData(activeVisitors);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <ReusableTable columns={columns} rows={visitorsData} />
        </div>
    );
};

export default ViewContact;
