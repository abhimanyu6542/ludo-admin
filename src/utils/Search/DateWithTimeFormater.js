export function DateWithTimeFormater(isoDate) {
    // const date = new Date(isoDate);

    // // Format the day with a "th" suffix
    // const day = date.getUTCDate();
    // const dayWithSuffix = day + "th";

    // // Format the month (e.g., Aug)
    // const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });

    // // Format the year
    // const year = date.getUTCFullYear();

    // // Format the time in 12-hour format with AM/PM
    // const hours = date.getUTCHours();
    // const minutes = date.getUTCMinutes();
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // const formattedHours = hours % 12 || 12;
    // const formattedMinutes = minutes.toString().padStart(2, '0');

    // return `${dayWithSuffix} ${month} ${year} ${formattedHours}:${formattedMinutes}${ampm}`;
    const date = new Date(isoDate);

    // Format the day with a "th" suffix
    const day = date.getDate();
    const dayWithSuffix = day + "th";

    // Format the month (e.g., Aug)
    const month = date.toLocaleString('en-US', { month: 'short' });

    // Format the year
    const year = date.getFullYear();

    // Format the time in 12-hour format with AM/PM in local time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${dayWithSuffix} ${month} ${year} ${formattedHours}:${formattedMinutes}${ampm}`;
}