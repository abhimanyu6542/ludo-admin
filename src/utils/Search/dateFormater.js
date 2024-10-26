export function dateFormater(milliseconds) {
    // Create a new Date object with the provided milliseconds
    const date = new Date(milliseconds);
  
    // Extract year, month, and day components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
  
    // Form the 'yyyy-mm-dd' formatted string
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }