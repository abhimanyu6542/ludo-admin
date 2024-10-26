import React, { useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import UTRDeletModal from './UTRDeleteModal';


const UtrEditCell = ({ row }) => {
  const [deletemodal, setShowDeleteModal] = useState(false);
 
  return (
    <>
      <div className="flex items-center justify-start">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="rounded-full mx-2 border-0 p-1.5 text-black hover:bg-secondary"
        >
          <RiDeleteBin6Line />
        </button>
      </div>

      {deletemodal ? <UTRDeletModal setShowDeleteModal={setShowDeleteModal} data={row.original.id} /> : null}
     
    </>
  );
};

export default UtrEditCell;
