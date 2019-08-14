/**
 * Backend that writes to a file.
 */
var EventEmitter = require('events');
var fs = require('fs');

function writeToFile(fd, data) {
    let details = data.description ? `— ${data.description}` : ''
    fs.write(fd, `${data.datetime} [${data.status}] ${data.url} ${details}\n`, (err) => {
        if (err) {
            console.log("logfile error: " + err);
        }
    });
}

module.exports = (config) => {

    const emitter = new EventEmitter();

    try {
        let fd = fs.openSync(config.file, 'a');
        emitter.on('alert', writeToFile.bind(null, fd));
        emitter.on('ok', writeToFile.bind(null, fd));
    } catch (err) {
        console.log("Backend logfile not started: " + err);
    }

    return emitter;
}
