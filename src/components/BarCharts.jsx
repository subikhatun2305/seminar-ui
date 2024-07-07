import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';

const ReusableBarChart = ({ data, title, xKey, yKeys, sum }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
    const [saveAsMenuOpen, setSaveAsMenuOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setDownloadMenuOpen(false);
        setSaveAsMenuOpen(false);
    };

    const handleDownloadMenuOpen = () => {
        setDownloadMenuOpen(true);
    };

    const handleSaveAsMenuOpen = () => {
        setSaveAsMenuOpen(true);
    };

    const handleDownload = (format) => {
        const chart = document.getElementById('chart-container');
        switch (format) {
            case 'png':
                toPng(chart).then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `${title}.png`;
                    link.href = dataUrl;
                    link.click();
                });
                break;
            case 'jpg':
                toJpeg(chart).then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `${title}.jpg`;
                    link.href = dataUrl;
                    link.click();
                });
                break;
            case 'svg':
                toSvg(chart).then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `${title}.svg`;
                    link.href = dataUrl;
                    link.click();
                });
                break;
            case 'pdf':
                toPng(chart).then((dataUrl) => {
                    const pdf = new jsPDF();
                    pdf.addImage(dataUrl, 'PNG', 0, 0);
                    pdf.save(`${title}.pdf`);
                });
                break;
            default:
                break;
        }
        handleMenuClose();
    };

    const handleSaveAs = (format) => {
        switch (format) {
            case 'csv':
                const csvContent = `data:text/csv;charset=utf-8,${data.map(d => `${d[xKey]},${d.IN},${d.OUT}`).join('\n')}`;
                saveAs(new Blob([csvContent], { type: 'text/csv' }), `${title}.csv`);
                break;
            case 'xlsx':
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, `${title}.xlsx`);
                break;
            case 'json':
                saveAs(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${title}.json`);
                break;
            default:
                break;
        }
        handleMenuClose();
    };

    const handleAnnotate = () => {
        // Implement your annotation logic here
        alert('Annotate feature coming soon!');
        handleMenuClose();
    };

    const handlePrint = () => {
        const chart = document.getElementById('chart-container');
        toPng(chart).then((dataUrl) => {
            const newWindow = window.open();
            newWindow.document.write(`<img src="${dataUrl}" onload="window.print();window.close()" />`);
            newWindow.document.close();
        });
        handleMenuClose();
    };

    return (
        <Card style={{ boxShadow: theme.shadows[3], borderRadius: theme.shape.borderRadius, margin: '20px 0', border: '1px solid #ccc', position: 'relative' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                    {title} : {sum}
                    <IconButton
                        aria-label="download"
                        onClick={handleMenuOpen}
                        style={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Typography>
                <div id="chart-container" style={{ width: '100%', height: '300px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey={xKey} />
                            <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]} />
                            <Tooltip />
                            <Legend />
                            {yKeys.map((yKey, index) => (
                                <Bar
                                    key={index}
                                    dataKey={yKey}
                                    fill={yKey === 'OUT' ? 'red' : theme.palette.primary.main}
                                    barSize={30}
                                >
                                    <LabelList dataKey={yKey} position="top" />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDownloadMenuOpen}>Download As</MenuItem>
                <MenuItem onClick={handleSaveAsMenuOpen}>Save As</MenuItem>
                <MenuItem onClick={handleAnnotate}>Annotate</MenuItem>
                <MenuItem onClick={handlePrint}>Print</MenuItem>
            </Menu>

            {/* Download As Menu */}
            <Menu
                anchorEl={anchorEl}
                open={downloadMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleDownload('png')}>PNG</MenuItem>
                <MenuItem onClick={() => handleDownload('jpg')}>JPG</MenuItem>
                <MenuItem onClick={() => handleDownload('svg')}>SVG</MenuItem>
                <MenuItem onClick={() => handleDownload('pdf')}>PDF</MenuItem>
            </Menu>

            {/* Save As Menu */}
            <Menu
                anchorEl={anchorEl}
                open={saveAsMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleSaveAs('csv')}>CSV</MenuItem>
                <MenuItem onClick={() => handleSaveAs('xlsx')}>XLSX</MenuItem>
                <MenuItem onClick={() => handleSaveAs('json')}>JSON</MenuItem>
            </Menu>
        </Card>

    );
};

export default ReusableBarChart;
