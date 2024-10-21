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

export function timeAgo(date: Date | number): string {
    const now = new Date();
    const inputDate = date instanceof Date ? date : new Date(date);

    const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function isBirthdayWithinTos(birthday: Date): boolean {
    const tosAge = 13;

    const today = new Date();

    // Calculate the date tosAge years ago from today
    const minAllowedDate = new Date(
        today.getFullYear() - tosAge,
        today.getMonth(),
        today.getDate()
    );

    // Check if the birthday is on or before the minimum allowed date
    return birthday <= minAllowedDate;
}