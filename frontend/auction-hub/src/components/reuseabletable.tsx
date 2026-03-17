import React from 'react';
import Pagination from './Pagination';

export interface Column<T>{
    header:string;
    render:(row:T)=>React.ReactNode;
    className?:string;
}

interface DataTableProps<T>{
    columns:Column<T>[];
    data:T[];
    isLoading:boolean;
    page:number;
    totalPages:number;
    onPageChange:(newPage:number)=>void;
    keyExtractor:(row:T)=>string | number;
    emptyMessage?:string;
}

export default function DataTable<T>({
    columns,
    data,
    isLoading,
    page,
    totalPages,
    onPageChange,
    keyExtractor,
    emptyMessage='no Data found',
}:DataTableProps<T>){
     return (
    <div className="w-full">
      <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-sm animate-pulse">Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#1c2128] border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                {columns.map((col, index) => (
                  <th key={index} className={`py-4 px-6 font-semibold ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-white/5 transition group">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`py-4 px-6 ${col.className || ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination Controls */}
      {!isLoading && data.length>0 &&(
        <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        />
      )}
    </div>
  );
}