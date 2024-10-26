import React, { useEffect, useState } from 'react';

function TableFooter({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  numOfTableEntries,
}) {
  const [numOfPage, setNumOfPage] = useState([]);

  useEffect(() => {
    let pages = pageCount;
    let pageArray = [];
    while (pages > 0) {
      pageArray.push(1);
      pages -= 1;
    }
    setNumOfPage(pageArray);
  }, [pageCount]);

  return (
    <div className="mt-8 flex w-full items-center justify-between ">
      <div>
        <p className="text-sm font-medium text-tertiary-t5 font-poppins">
          Showing {1 * (10 * pageIndex)} to {10 + 1 * (10 * pageIndex)} of {numOfTableEntries}{' '}
          entries.{' '}
        </p>
      </div>

      <div className="flex items-center">
        <button
          className="rounded-md border-2 font-poppins border-tertiary-t4 bg-tertiary-t2 px-3 font-semibold text-tertiary-t5"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>

        {/* -- displaying numbers */}
        <div className="mx-2 flex items-center">
          {numOfPage.map((_, index) => (
            <div key={index}>
              <p
                onClick={() => gotoPage(index)}
                className={`mx-1 cursor-pointer rounded-md border-2 font-poppins px-2 text-sm font-semibold ${
                  pageIndex === index
                    ? 'bg-primary text-white border-primary' // Highlight current page
                    : 'bg-tertiary-t2 text-tertiary-t5 border-tertiary-t4'
                }`}
              >
                {index + 1}
              </p>
            </div>
          ))}
          {numOfPage.length > 3 && (
            <p className="text-lg text-tertiary-t5">...</p>
          )}
        </div>

        <button
          className="rounded-md border-2 font-poppins border-tertiary-t4 bg-tertiary-t2 px-3 font-semibold text-tertiary-t5"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TableFooter;