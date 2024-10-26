import React, {useState} from 'react';
import ClaimedModal from './ClaimedModal';


const utrStatusCell = ({ row, value }) => {
  const [showClaimedModal, setShowClaimedModal] = useState(false);

  const handleOpenClaimedModal = () => {
    if(value === 'claimed'){
      setShowClaimedModal(true);
    }
  }

  return (
    <div>

      <div onClick={handleOpenClaimedModal} className={value === "claimed" ? "text-xs font-medium capitalize text-[#379a41] font-poppins cursor-pointer" : "text-xs font-medium capitalize text-[#4b4b4b] font-poppins"}>{value} </div>

      {showClaimedModal ? <ClaimedModal setShowClaimedModal={setShowClaimedModal} utr_data={row.original} /> : null}

    </div>
  )
}

export default utrStatusCell