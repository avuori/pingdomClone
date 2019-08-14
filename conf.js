module.exports.read = read;
module.exports.validate = validate; // Expose for testing

function read(configJson) {
    let config;
    try {
        config = JSON.parse(configJson);
    } catch (err) {
        throw new Error("Parse error Check the syntax.");
    }

    if (!Array.isArray(config.targets)) {
        throw new Error("Check the config for correctness. A toplevel targets object seems to be missing.");
    }

    let requiredFields = [
        'url',
        'maxLoadTime',
        'matchString',
        'interval',
        'timeout',
    ];

    config.targets.forEach((t, i) => {
        if (!requiredFields.every((field) => t.hasOwnProperty(field))) {
            throw `The config item ${i+1} is missing some of the required fields (${requiredFields.join(", ")}).`;
        }
        try {
            validate(t);
        } catch (err) {
            throw "Config error: " + err;
        }
    });

    return config;
}

function validatePositiveNumber(name, target) {
    if (typeof target[name] != 'number' || target[name] < 0) {
        throw `target ${target.url} — ${name} must be a positive number.`;
    }
}

function validate(target) {
    if (typeof target.url != 'string' || !/^https?:/.test(target.url)) {
        throw `target ${target.url} — check if this is a valid URL.`;
    }

    validatePositiveNumber("maxLoadTime", target);
    validatePositiveNumber("interval", target);
    validatePositiveNumber("timeout", target);

    if (typeof target.matchString != 'string') {
        throw `target ${target.url} — matchString type must be a string.`;
    }
}
