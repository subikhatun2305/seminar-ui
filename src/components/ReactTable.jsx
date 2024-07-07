import React, { useState } from 'react';
import './table.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ReusableTable = ({ columns, rows, rowsPerPageOptions = [10, 20, 50], defaultRowsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    const currentRows = rows.slice(start, end);

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.selector(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={() => handleChangePage(0)}
                    disabled={currentPage === 0}
                    className="pagination-btn"
                >
                    <i className="fas fa-angle-double-left"></i>
                </button>
                <button
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="pagination-btn"
                >
                    <i className="fas fa-angle-left"></i>
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="pagination-btn"
                >
                    <i className="fas fa-angle-right"></i>
                </button>
                <button
                    onClick={() => handleChangePage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="pagination-btn"
                >
                    <i className="fas fa-angle-double-right"></i>
                </button>
                <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="pagination-select">
                    {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option} rows per page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ReusableTable;
