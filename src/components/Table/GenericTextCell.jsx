/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

function GenericTextCell({ value }) {
  return (
    <>
      {value.user_name ? (
        <Link to={'/users'} className="text-xs font-medium text-[#EF4444] underline font-poppins">
          {value.user_name}{' '}
        </Link>
      ) : value.versus ?   <Link to={'/users'} className="text-xs font-medium text-[#065F46] underline font-poppins">
      {value.versus}{' '}
    </Link> : (
        <div className="text-xs font-medium text-black font-poppins">{value} </div>
      )}
    </>
  );
}

export default GenericTextCell;
