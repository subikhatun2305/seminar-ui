import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Box, IconButton, CircularProgress, createTheme, ThemeProvider, Tooltip } from "@mui/material";
import { FileCopy, GetApp } from '@mui/icons-material'; // Import icons for copy, download as XLSX

const CustomDataTable = ({
    title,
    columns,
    data,
    selectableRows,
    onSelectedRowsChange,
    clearSelectedRows,
    pagination,
    paginationServer,
    paginationTotalRows,
    onChangePage,
    onChangeRowsPerPage,
    subHeader,
    subHeaderComponent,
    onSearch,
    searchPlaceholder,
    onCopy, // New prop for copy functionality
    onDownloadXLSX, // New prop for download functionality
    copyEnabled, // New prop to enable/disable copy button
    downloadEnabled // New prop to enable/disable download button
}) => {
    const [loading, setLoading] = useState(true);

    const tableCustomStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                color: "white",
                backgroundColor: '#0075a8',
            },
        },
        cells: {
            style: {
                fontSize: "12px",
                padding: "2px",
                margin: "0px",
            },
        },
        rows: {
            style: {
                minHeight: "48px",
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#E0E0E0',
                },
            },
        },
        pagination: {
            style: {
                fontSize: '12px',
                color: 'white',
                backgroundColor: '#0075a8',
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#E0E0E0',
                minHeight: '40px', // Adjusted footer height
                display: 'flex',
                justifyContent: 'flex-end', // Right-align the pagination buttons
                alignItems: 'center', // Vertically center the pagination buttons
                paddingRight: '10px', // Add some padding to the right
            },
            pageButtonsStyle: {
                borderRadius: '50%',
                height: '30px', // Adjusted button height
                width: '30px', // Adjusted button width
                padding: '6px', // Consistent padding
                margin: '2px', // Consistent margin
                cursor: 'pointer',
                transition: '0.2s',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover:not(:disabled)': {
                    backgroundColor: '#3C565B',
                    color: 'white',
                },
            },
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#3C565B",
            },
        },
    });

    const handleCopy = () => {
        if (onCopy) {
            onCopy();
        }
    };

    const handleDownloadXLSX = () => {
        if (onDownloadXLSX) {
            onDownloadXLSX();
        }
    };

    const handlePageChange = (page) => {
        if (onChangePage) {
            onChangePage(page);
        }
    };

    const handleRowsPerPageChange = (newRowsPerPage, currentPage) => {
        if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newRowsPerPage);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <DataTable
                        customStyles={tableCustomStyles}
                        columns={columns}
                        data={data}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="300px"
                        responsive
                        selectableRowHighlight
                        highlightOnHover
                        striped
                        dense
                        paginationServer
                        paginationTotalRows={paginationTotalRows}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        subHeader
                        subHeaderComponent={
                            <Box display="flex" alignItems="center">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onChange={(e) => onSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '30px',
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '5px',
                                        border: '1px solid #ddd',
                                        marginLeft: '10px',
                                    }}
                                />
                                {copyEnabled && (
                                    <Tooltip title="Copy to clipboard">
                                        <IconButton onClick={handleCopy}>
                                            <FileCopy />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {downloadEnabled && (
                                    <Tooltip title="Download as XLSX">
                                        <IconButton onClick={handleDownloadXLSX}>
                                            <GetApp />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        }
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default CustomDataTable;
