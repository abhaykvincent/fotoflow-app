// PaginationControl.jsx
import { useState } from 'react';

export default function PaginationControl({ currentPage, totalPages, handlePageChange, saveSelectedImages,handleSelectionCompleted }) {
    const [expanded, setExpanded] = useState(false);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <div
                className={`button light-mode primary ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </div>
            {
                expanded ?
                    pageNumbers.map((number) => (
                        <div
                            key={number}
                            className={`button light-mode ${currentPage === number ? 'primary' : 'secondary'}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </div>
                    ))
                    :
                    <>
                        {pageNumbers.slice(0, 2).map((number) => (
                            <div
                                key={number}
                                className={`button light-mode ${currentPage === number ? 'primary' : 'secondary'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </div>
                        ))}

                        {
                            currentPage > 3 && currentPage < totalPages - 1 ?
                                <>
                                    <div
                                        className="button light-mode secondary"
                                        onClick={() => setExpanded(true)}
                                    >
                                        ...
                                    </div>
                                    <div
                                        key={currentPage}
                                        className={`button light-mode primary`}
                                        onClick={() => handlePageChange(currentPage)}
                                    >
                                        {currentPage}
                                    </div>
                                    <div
                                        className="button light-mode secondary"
                                        onClick={() => setExpanded(true)}
                                    >
                                        ...
                                    </div>
                                </>
                                :
                                <div
                                    className="button light-mode secondary"
                                    onClick={() => setExpanded(true)}
                                >
                                    ...
                                </div>
                        }
                        {pageNumbers.slice(-2).map((number) => (
                            <div
                                key={number}
                                className={`button light-mode ${currentPage === number ? 'primary' : 'secondary'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </div>
                        ))}
                    </>
            }
            {currentPage === totalPages?<div
                className={`button primary`}
                onClick={() => {
                    handlePageChange(currentPage + 1)
                    handleSelectionCompleted()
                }}
            >
                Send
            </div>:
            <div
                className={`button primary ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </div>}
        </div>
    );
}
