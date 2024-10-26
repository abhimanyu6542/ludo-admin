import React from 'react';
import CheckMark from '/assets/check-mark.png';
const TxnStatusCell = ({ value }) => {
  const getTransactionHeading = (heading) => {
    switch (heading) {
      case 'pending': {
        const modifiedClass = 'text-sm text-yellow-600 font-bold';
        const status = 'pending';
        return { modifiedClass, status };
      }
      case 'approved': {
        const modifiedClass = 'text-sm text-green-600 font-bold';
        const status = 'approved';
        return { modifiedClass, status };
      }
      case 'rejected': {
        const modifiedClass = 'text-sm text-red-600 font-bold';
        const status = 'rejected';
        return { modifiedClass, status };
      }
      default: {
        const modifiedClass = 'text-sm text-black font-bold';
        const status = '----';
        return { modifiedClass, status };
      }
    }
  };

  const { modifiedClass, status } = getTransactionHeading(value);
  return (
    <div>
      <p className={`${modifiedClass} capitalize flex gap-2 font-medium font-poppins`}>
        {' '}
        {status}{' '}
        {value == 'approved' ? <img src={CheckMark} alt="CheckMark" className="w-4 h-4" /> : null}{' '}
      </p>
    </div>
  );
};

export default TxnStatusCell;
