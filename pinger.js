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
    targets.forEach((t) => {
        Promise.resolve().then(function resolver() {
            let hrstart = process.hrtime();
            return rp(t.url).then((body) => {
                let hrend = process.hrtime(hrstart);
                console.log(t.url + ": " + hrend[0] + ":" + (hrend[1] / 1000000));
                // Check the request response contains the given string.
                if (body.indexOf(t.matchString) === -1) {
                    console.log(t.url + "does not contain " + t.matchString);
                }
            }).then(() => {
                setTimeout(resolver, t.interval);
            }).catch((err) => {
                console.log(t.url + ": " + err);
                setTimeout(resolver, t.interval);
            })
        });
    });
}
