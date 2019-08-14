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
    ];

    config.targets.forEach((t, i) => {
        if (!requiredFields.every((field) => t.hasOwnProperty(field))) {
            throw `The config item ${i+1} is missing some of the required fields (${requiredFields.join(", ")}).`;
        }
        validate(t);
    });

    return config;
}

function validate(target) {
    // match string empty OK?
}
