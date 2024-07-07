import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const ReusableTabs = ({ tabs, selectedTab, onChange }) => {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={selectedTab}
                onChange={onChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                TabIndicatorProps={{
                    style: {
                        backgroundColor: 'white', // Set the underline color to white
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        value={index}
                        sx={{
                            color: 'white',
                            fontSize: "10px",
                            '&.Mui-selected': {
                                color: 'white',
                            },
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default ReusableTabs;
