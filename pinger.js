/**
 * The pinger loop is here.
 */

var rp = require('request-promise');

module.exports = (targets) => {
    return {
        start: start.bind(null, targets)
    }
}

function start(targets, interval, log) {
}
