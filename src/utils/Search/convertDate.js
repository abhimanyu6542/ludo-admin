export function formatDate(dateString) {
    const date = new Date(dateString);

    // Array of month names
    const months = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Get day, month and year from date object
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Function to get ordinal suffix for day
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Combine to form the desired date format
    // Output: 28th May, 2024
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

export const getTime = (created_at) => {
    const [date, time] = created_at.split('T');
    const [hours, minutes, seconds] = time.split(':');
    
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hour}:${minutes} ${ampm}`;
    
    return  formattedTime ;
}