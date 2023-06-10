function extractReasonFromErrorMessage(error) {

    if (error && error.message) {
        const errorMessage = error.message;
        const startIndex = errorMessage.indexOf('"');
        if (startIndex !== -1) {
            const endIndex = errorMessage.indexOf('"', startIndex + 1);
            if (endIndex !== -1) {
                return errorMessage.substring(startIndex, endIndex + 1);
            }
        }
    }
    return 'Unhandled Error';
}


function calculateDuration(startTimestamp, endTimestamp) {
    const start = new Date(startTimestamp).getTime(); // Convert to milliseconds
    const end = new Date(endTimestamp).getTime(); // Convert to milliseconds

    const durationInMilliseconds = end - start;

    // Calculate individual units (days, hours, minutes, seconds)
    const seconds = Math.floor(durationInMilliseconds / 1000) % 60;
    const minutes = Math.floor(durationInMilliseconds / 1000 / 60) % 60;
    const hours = Math.floor(durationInMilliseconds / 1000 / 60 / 60) % 24;
    const days = Math.floor(durationInMilliseconds / 1000 / 60 / 60 / 24);

    // Format the duration as a string
    const formattedDuration = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    return formattedDuration;
}



function convertSeconds(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;

    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let result = '';

    if (days > 0) {
        result += days + (days === 1 ? ' day ' : ' days ');
    }

    if (hours > 0) {
        result += hours + (hours === 1 ? ' hour ' : ' hours ');
    }

    if (minutes > 0) {
        result += minutes + (minutes === 1 ? ' minute ' : ' minutes ');
    }

    if (seconds > 0 || result === '') {
        result += seconds + (seconds === 1 ? ' second ' : ' seconds ');
    }

    return result.trim();
}

function convertToDateTime(unixTimestamp) {
    const date = new Date(unixTimestamp);

    const dateTimeFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} 
                            ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return dateTimeFormat;
}

module.exports = {
    extractReasonFromErrorMessage,
    calculateDuration,
    convertSeconds,
    convertToDateTime
}