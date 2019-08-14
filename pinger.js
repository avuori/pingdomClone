/**
 * The pinger loop is here.
 */

var rp = require('request-promise');

module.exports = () => {
    return {
        start: start
    }
}

function start(targets, interval, backends) {
    // The emit function passes events to all backend handlers
    let emit = (status, url, description) => {
        backends.forEach((backend) => {
            let datetime = new Date().toLocaleString();
            backend.emit(status, {
                datetime: datetime,
                status: status,
                url: url,
                description: description
            });
        });
    }
    targets.forEach((t) => {
        Promise.resolve().then(function resolver() {
            let hrstart = process.hrtime();
            return rp(t.url).then((body) => {
                let hrend = process.hrtime(hrstart);
                let durationMs = hrend[0] * 1000 + (hrend[1] / 1000000);
                if (durationMs > t.maxLoadTime) {
                    emit('alert', t.url, `Maximum load time exceeded: ${durationMs}ms.`);
                    
                } else if (body.indexOf(t.matchString) === -1) {
                    emit('alert', t.url, `Request response does not contain string "${t.matchString}". ${durationMs}.`);
                } else {
                    emit('ok', t.url, `${durationMs}ms.`);
                }
            }).then(() => {
                setTimeout(resolver, t.interval);
            }).catch((err) => {
                setTimeout(resolver, t.interval);
                emit('alert', t.url, `Request failed: ${err}`);
            })
        });
    });
}
