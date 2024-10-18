export function getCasualMonthDayStringFromDate(date: Date) {
    // Array of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Function to get the day suffix
    function getDaySuffix(day: number): string {
        if (day > 3 && day < 21) return 'th'; // Special cases for 11, 12, 13
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Get the month name and day
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const dayWithSuffix = `${day}${getDaySuffix(day)}`;

    // Format the final string
    const formattedDate = `${monthName} ${dayWithSuffix}`;
    return formattedDate;
}

export function getCasualMonthDayYearStringFromDate(date: Date) {
    // Array of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Function to get the day suffix
    function getDaySuffix(day: number): string {
        if (day > 3 && day < 21) return 'th'; // Special cases for 11, 12, 13
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Get the month name and day
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const dayWithSuffix = `${day}${getDaySuffix(day)}`;
    const year = date.getFullYear();

    // Format the final string
    const formattedDate = `${monthName} ${dayWithSuffix}, ${year}`;
    return formattedDate;
}