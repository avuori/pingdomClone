var argv = require('minimist')(process.argv.slice(2));
var conf = require('./conf');
var fs = require('fs');

// Validate args
if (!argv.config || !argv.config.length) {
    help();
    process.exit(0);
}

var configJson;
try {
    configJson = fs.readFileSync(argv.config);
} catch (err) {
    console.log("Could not read config file: " + err);
    process.exit(1);
}

// Hurray, we have a config.
var config;
try {
    config = conf.read(configJson);
} catch (err) {
    console.log("Invalid config: " + err);
    process.exit(1);
}

if (!config.targets.length) {
    console.log("Nothing to monitor.");
    process.exit(0);
}

if (!config.backends.length) {
    console.log("You must define at least one backend.");
    process.exit(0);
}

// Init backends
var backends = config.backends.map((backend) => {
    let backendDir = './backend/';
    try {
        if (!fs.existsSync(backendDir + backend.name + ".js")) {
            throw "Invalid backend: " + backend.name;
        }
        return require(backendDir + backend.name)(backend);
    } catch (err) {
        console.log("Error setting up backends: " + err);
        throw err;
    }
});

// Valid config: start monitoring.
console.log(`Starting to monitor ${config.targets.length} targets.`);
config.targets.forEach((t) => {
    console.log(` ${t.url}, interval ${t.interval}ms, matching "${t.matchString}" with maxLoadTime ${t.maxLoadTime}ms`);
});
console.log("\nPress Ctrl+C to exit.");

var pinger = require('./pinger')();

// Wire pinger to backends
backends.forEach((backend) => {
    pinger.on('ok', backend.emit.bind(backend, 'ok'));
    pinger.on('alert', backend.emit.bind(backend, 'alert'));
});
pinger.start(config.targets, argv.interval);

function help() {
    console.log("Usage:");
    console.log(` node ${process.argv[1]} --config <file> [--interval <ms>]`);
    console.log("");
    console.log("See config.json for example config file format.");
}
