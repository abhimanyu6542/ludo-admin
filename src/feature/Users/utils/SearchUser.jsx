/* eslint-disable react/prop-types */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

export const SearchUser = ({ placeholder_text }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="flex items-center gap-[0.2vw] rounded-md border-tertiary-t3 bg-secondary border-2 w-[15vw] px-[0.5vw] ">
        <IoSearch className='text-tertiary-t5 text-[2vw] ' />

        <input
          className="flex items-center justify-center text-[1.1vw] px-2 w-full border-0 h-[2.5vw] outline-none"
          type="text"
          id="search"
          onChange={(e) => setSearchParams({ query: e.target.value })}
          placeholder={placeholder_text ? placeholder_text : 'Search user'}
        />
      </div>
    </>
  );
};
