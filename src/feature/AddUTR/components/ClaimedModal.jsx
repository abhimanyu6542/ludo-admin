import React from 'react'

function ClaimedModal({ setShowClaimedModal, utr_data }) {

    function formatDate(dateString) {
        // Create a new Date object from the ISO date string
        const date = new Date(dateString);

        // Define arrays for month names and suffixes
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const daySuffixes = ["th", "st", "nd", "rd"];

        // Extract the day, month, and year from the date object
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        // Determine the correct suffix for the day
        const suffix = (day % 10 > 3 || Math.floor((day % 100) / 10) === 1) ? daySuffixes[0] : daySuffixes[day % 10];

        // Format the date as "dayWithSuffix Month, Year"
        return `${day}${suffix} ${month}, ${year}`;
    }
    const formatted_date = formatDate(utr_data.created_at)


    return (
        <div className="w-full h-full z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
            <div className="p-10 bg-secondary border-0 rounded-lg w-[700px]">

                <div className='flex items-center justify-between mb-5'>
                    <p className='text-2xl font-medium text-black'>Claimed <span className='text-green-600'>{utr_data?.amount} RS</span> by <span className='text-red-600'>User</span> </p>
                    <p className='text-base text-gray-600'>{formatted_date} </p>
                </div>

                <div className='flex flex-col justify-center items-center'>
                    <p className='text-2xl text-gray-600'>{utr_data?.utr_no} </p>
                </div>

                <div className='flex items-center justify-center mt-5'>
                    <button onClick={() => setShowClaimedModal(false)} className="rounded-md flex justify-center items-center gap-3 border-2 border-primary py-1.5 px-8 text-center text-sm font-medium text-secondary cursor-pointer bg-primary">Close</button>
                </div>

            </div>
        </div>
    )
}

export default ClaimedModal;