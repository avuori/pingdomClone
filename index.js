var argv = require('minimist')(process.argv.slice(2));
var conf = require('./conf');
var fs = require('fs');

// Validate args
if (!argv.config || !argv.config.length) {
    help();
    process.exit(0);
}

var config;
try {
    config = fs.readFileSync(argv.config);
} catch (err) {
    console.log("Could not read config file: " + err);
    process.exit(1);
}

// Hurray, we have a config.
var targets;
try {
    targets = conf.read(config);
} catch (err) {
    console.log("Invalid config: " + err);
    process.exit(1);
}

if (!targets.length) {
    console.log("Nothing to monitor.");
    process.exit(0);
}

// Valid config: start monitoring.
console.log(`Starting to monitor ${targets.length} targets.`);
targets.forEach((t) => {
    console.log(` ${t.url}, interval ${t.checkIntervalMS}ms, matching "${t.matchString}" with maxDelay ${t.maxDelayMS}ms`);
});
console.log("\nPress Ctrl+C to exit.");

require('./pinger')(targets, argv.interval, argv.log).start();

function help() {
    console.log("Usage:");
    console.log(` node ${process.argv[1]} --config <file> [--interval <ms>] [--log <log>]`);
    console.log("");
    console.log("See config.json for example config file format.");
}
