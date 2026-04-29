import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    variant?: "light" | "dark"; // Added variant prop
};

const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    variant = "dark" 
}) => {
    if (totalPages <= 1) return null;

    
    const isLight = variant === "light";
    
    const buttonClasses = isLight
        ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm"
        : "bg-[#1c2128] text-gray-200 border-gray-700 hover:bg-gray-800";

    const textClasses = isLight
        ? "text-gray-600"
        : "text-gray-400";

    const numberClasses = isLight
        ? "text-[#1da1f2]"
        : "text-white";

    return (
        <div className="flex justify-end gap-2 mt-6">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${buttonClasses}`}
            >
                Previous
            </button>
            
            <div className="flex items-center px-4">
                <span className={`${textClasses} text-sm`}>
                    Page <span className={`font-semibold ${numberClasses}`}>{currentPage}</span> of <span className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{totalPages}</span>
                </span>
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${buttonClasses}`}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
