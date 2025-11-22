import React, { useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-col items-center gap-6 mt-12 mb-8">
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    ← Previous
                </button>

                {pageNumbers.map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                ? 'bg-gray-900 text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 text-gray-400">
                            {page}
                        </span>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Next →
                </button>
            </div>

            <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} (Pokémon shown)
            </p>
        </div>
    );
}

export default React.memo(Pagination);
