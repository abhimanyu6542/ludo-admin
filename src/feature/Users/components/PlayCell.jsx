import React from 'react';
import { Link } from 'react-router-dom';

const PlayCell = ({ value }) => {
  return (
    <div className="flex justify-start items-center gap-2">
      <h1 className="text-black text-base">{value}</h1>
      <Link to={'/'} className="text-sm font-poppins font-medium text-orange-600">
        view history
      </Link>
    </div>
  );
};

export default PlayCell;
