import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ReusablePieChart = ({ data, width = 200, height = 200, outerRadius = 80, legendHidden = true }) => {
    const COLORS = data.map(item => item.color);
    const TOTAL = data.reduce((acc, item) => acc + item.value, 0);

    // const renderLabel = ({ value, name }) => `${name}: ${((value / TOTAL) * 100).toFixed(0)}%`;

    return (
        <PieChart width={width} height={height}>
            <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                // label={renderLabel}
                labelLine={false}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            {!legendHidden && <Legend />}
            <Tooltip />
        </PieChart>
    );
};

export default ReusablePieChart;
