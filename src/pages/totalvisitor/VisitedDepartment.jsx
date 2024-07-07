import React from 'react'
import ReusableBarChart from '../../components/BarCharts'
import { Grid } from '@mui/material';

const VisitedDepartment = () => {
    const data = [
        { name: 'Engineering', Department: 24 },
        { name: 'Finance', Department: 8 },
        { name: 'HR-BU2', Department: 6 },
        { name: 'IT', Department: 15 },
        { name: 'Maintenance', Department: 4 },
        { name: 'Material & Store', Department: 3 },
        { name: 'Plant Maint...', Department: 17 },
        { name: 'QA', Department: 16 },
        { name: 'Tool Room', Department: 19 },
    ];

    return (
        <>
            <Grid container>
                <Grid item lg={12} md={12} xs={12}>
                    <ReusableBarChart
                        data={data}
                        title="Visited Department"
                        xKey="name"
                        yKeys={["Department"]}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default VisitedDepartment
