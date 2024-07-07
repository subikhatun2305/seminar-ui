import React from 'react'
import ReusableBarChart from '../../components/BarCharts';
import { Grid } from '@mui/material';

const data = [
    { name: 'Interview', Purpose: 10 },
    { name: 'Other', Purpose: 16 },
    { name: 'Scrap Loading', Purpose: 2 },
];
const VisitedPurpose = () => {
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <ReusableBarChart
                        data={data}
                        title="Visited Purpose"
                        xKey="name"
                        yKeys={["Purpose"]}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default VisitedPurpose;