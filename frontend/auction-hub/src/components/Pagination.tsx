import React from "react";

interface PaginationProps{
    currentPage:number;
    totalPages:number;
    onPageChange:(page:number)=>void;
};

const Pagination:React.FC<PaginationProps> = ({currentPage,totalPages,onPageChange})=>{
    if(totalPages<=1) return null;
    return (
        <div className="flex justify-end gap-2 mt-6">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1.5 text-sm font-medium bg-[#1c2128] text-gray-200 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center"
            >
                Previous
            </button>
            
            <div className="flex items-center px-2">
                <span className="text-gray-400 text-sm">
                    Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span>
                </span>
            </div>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                 className="px-3 py-1.5 text-sm font-medium bg-[#1c2128] text-gray-200 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center"
            >
                Next
            </button>
        </div>
    );
}
export default Pagination