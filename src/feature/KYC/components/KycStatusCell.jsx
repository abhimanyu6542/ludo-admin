import React from 'react'

const KycStatusCell = ({value}) => {
  return (
    <div>
      
        <div className={value === "rejected" ? "text-xs font-medium capitalize text-[#ea4845] font-poppins": value === 'confirmed' ?"text-xs font-medium capitalize text-[#32a050] font-poppins": "text-xs font-medium capitalize text-[#caca3c] font-poppins" }>{value} </div>
   
    </div>
  )
}

export default KycStatusCell