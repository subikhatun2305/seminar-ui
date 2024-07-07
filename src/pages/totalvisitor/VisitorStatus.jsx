import React from 'react'
import { Grid, Box } from '@mui/material';
import ReusableBarChart from '../../components/BarCharts';
const data = [
    { name: 'Date 1', IN: 249, OUT: 150 },
];

const VisitedStatus = () => {

    const totalIn = data.reduce((acc, curr) => acc + curr.IN, 0);
    const totalOut = data.reduce((acc, curr) => acc + curr.OUT, 0);
    const totalSum = totalIn + totalOut;
    return (
        <>
            <Grid container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>

                    <ReusableBarChart
                        data={data}
                        title="Total Visitors"
                        xKey="name"
                        yKeys={["IN", "OUT"]}
                        sum={totalSum}
                    />

                </Grid>
            </Grid>
        </>
    )
}

export default VisitedStatus
