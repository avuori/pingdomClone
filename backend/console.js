/**
 * Console logger backend.
 */

var EventEmitter = require('events');

module.exports = (config) => {
    const emitter = new EventEmitter();

    let log = (data) => {
        console.log(`${data.datetime} — ${data.status} — ${data.url} — ${data.description}`);
    };

    emitter.on('alert', log);
    emitter.on('ok', log);

    return emitter;
};
