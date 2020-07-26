const moment = require('moment');

module.exports = {
    ifeq(a, b, options) {
        if (String(a) === String(b)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    getTime(timeStamp) { return moment(timeStamp * 1000).format('DD-MMM-YYYY') },
    getTimeAll(timeStamp) { return moment(timeStamp * 1000).format('DD-MMM-YYYY, HH:mm:ss') },
    getDescription(string) { return string.substring(0, 350) + '...' }
};