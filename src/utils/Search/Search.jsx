/* eslint-disable react/prop-types */
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const Search = ({ placeholder_text }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="flex justify-end">
        <div className="max-w-md">
          <div className="relative flex items-center justify-center w-full h-10 overflow-hidden border rounded-lg border-tertiary-t4 bg-secondary focus-within:shadow-lg">
            <div className="w-12 mx-1 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="w-full h-full px-3 text-sm text-gray-700 font-poppins outline-none peer"
              type="text"
              id="search"
              onChange={(e) => setSearchParams({ query: e.target.value })}
              placeholder={ 'Type to search'}
            />
          </div>
        </div>
      </div>
    </>
  );
};
