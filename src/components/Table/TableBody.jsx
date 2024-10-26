/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import clsx from 'clsx';
import TableFooter from './TableFooter';
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from 'react-table';
// import './TableBody.css';

//searching for each column
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      className="form-control"
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={`Search`}
    />
  );
};

const TableBody = ({ columns, data, numOfTableEntries, isViewData, isFromNotification }) => {
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const { pageIndex, globalFilter } = state;
  // console.log(globalFilter, 'filter');

  return (
    <div id="scrollBar" className="w-full">
      <div className="">
        <table className="min-w-full " {...getTableProps()}>
          <thead className="">
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} className="" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, id) => (
                  <th
                    key={id}
                    className={isViewData? "px-[1vw] py-[1vw] font-semibold font-poppins tracking-wider text-left text-[1.2vw] text-priamry bg-[#ECFDF5]": "px-[1vw] py-[1vw] font-semibold font-poppins tracking-wider text-left text-[1.2vw] text-priamry bg-gray-50" } 
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className=" bg-secondary" {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr key={index} className="" {...row.getRowProps()}>
                  {row.cells.map((cell, id) => (
                    <td
                      key={id}
                      className={clsx(
                        'px-[1vw] py-[0.5vw] text-sm font-medium leading-5 secondaryspace-nowrap text-tertiary-t4'
                      )}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

{
  isFromNotification ? null: <TableFooter
  gotoPage={gotoPage}
  previousPage={previousPage}
  nextPage={nextPage}
  canPreviousPage={canPreviousPage}
  canNextPage={canNextPage}
  pageCount={pageCount}
  pageIndex={pageIndex}
  pageOptions={pageOptions}
  numOfTableEntries={numOfTableEntries}
/>
}
        
      </div>
    </div>
  );
};

export default TableBody;
