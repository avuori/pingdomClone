/**
 * The pinger loop is here.
 */

var EventEmitter = require('events');
var rp = require('request-promise');

module.exports = () => {
    return new Pinger();
}

class Pinger extends EventEmitter {

    _emit(status, url, description) {
        let datetime = new Date().toLocaleString();
        this.emit(status, {
            datetime: datetime,
            status: status,
            url: url,
            description: description
        });
    }

    start(targets, interval) {
        let that = this;
        targets.forEach((t) => {
            Promise.resolve().then(function resolver() {
                let hrstart = process.hrtime();
                let opts = {
                    method: 'GET',
                    uri: t.url,
                    timeout: t.timeout
                }
                return rp(opts).then((body) => {
                    let hrend = process.hrtime(hrstart);
                    let durationMs = hrend[0] * 1000 + (hrend[1] / 1000000);
                    if (durationMs > t.maxLoadTime) {
                        that._emit('alert', t.url, `Maximum load time exceeded: ${durationMs}ms.`);
                    } else if (body.indexOf(t.matchString) === -1) {
                        that._emit('alert', t.url, `Request response does not contain string "${t.matchString}". ${durationMs}.`);
                    } else {
                        that._emit('ok', t.url, `${durationMs}ms.`);
                    }
                }).catch((err) => {
                    that._emit('alert', t.url, `Request failed: ${err}`);
                }).finally(() => {
                    setTimeout(resolver, interval || t.interval);
                });
            });
        });
    }
}
