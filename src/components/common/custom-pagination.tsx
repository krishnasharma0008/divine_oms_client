import React from "react";

interface CustomPaginationProps {
  totalRows: number;
  rowsPerPage: number;
  selectedPage: number;
  onPageChange: (newPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalRows,
  rowsPerPage,
  selectedPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startRow = (selectedPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(selectedPage * rowsPerPage, totalRows);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent out-of-bound page changes
    onPageChange(newPage);
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Row range display */}
      <p className="text-sm text-slate-600">
        {totalRows > 0 ? (
          <>
            {startRow}–{endRow} of {totalRows}
          </>
        ) : (
          "0 results"
        )}
      </p>
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(selectedPage - 1)}
        disabled={selectedPage === 1}
        className="rounded-md border border-slate-300 px-2 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        <span className="text-lg font-bold">&lt;</span>
      </button>

      {/* Page information */}
      <p className="text-slate-600">
        Page <strong className="text-slate-800">{selectedPage}</strong> of{" "}
        <strong className="text-slate-800">{totalPages}</strong>
      </p>

      {/* Next button */}
      <button
        onClick={() => handlePageChange(selectedPage + 1)}
        disabled={selectedPage === totalPages}
        className="rounded-md border border-slate-300 px-2 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        {/* Chevron Right Icon */}
        <span className="text-lg font-bold">&gt;</span>
      </button>
    </div>
  );
};

export default CustomPagination;
