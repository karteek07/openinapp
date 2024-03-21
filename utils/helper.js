const dateParser = (date) => {
    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4);
    return `${day}-${month}-${year}`;
};

const dateCompare = (date) => {
    currentDate = new Date().toDateString();
    date = dateParser(date);
    date = deformatDate(date).toDateString();

    if (date <= currentDate) {
        return true;
    }

    return false;
};

const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
};

const deformatDate = (formattedDate) => {
    const parts = formattedDate.match(/(\d+)-(\d+)-(\d+)/);
    if (!parts) {
        throw new Error('Invalid date format');
    }
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    let year = parseInt(parts[3], 10);
    if (year < 100) {
        year += 2000;
    }
    return new Date(year, month, day);
};

const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
};

const deformatDateTime = (formattedDate) => {
    const parts = formattedDate.match(/(\d+)-(\d+)-(\d+), (\d+):(\d+):(\d+)/);
    if (!parts) {
        throw new Error('Invalid date format');
    }
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    let year = parseInt(parts[3], 10);
    if (year < 100) {
        year += 2000;
    }
    const hours = parseInt(parts[4], 10);
    const minutes = parseInt(parts[5], 10);
    const seconds = parseInt(parts[6], 10);
    return new Date(year, month, day, hours, minutes, seconds);
};

const dateDifference = (date) => {
    const date1 = new Date();
    const date2 = new Date(deformatDate(date));
    const differenceMs = date2 - date1;
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
    return differenceDays.toFixed(2);
};

const priorityOrder = (d) => {
    if (d > 5) {
        return 3;
    }

    if (d > 2 && d < 5) {
        return 2;
    }

    if (d > 0 && d < 3) {
        return 1;
    }

    if (d <= 0) {
        return 0;
    }
};

module.exports = {
    dateParser,
    dateCompare,
    dateDifference,
    priorityOrder,
    formatDate,
    deformatDate,
    formatDateTime,
    deformatDateTime,
};
