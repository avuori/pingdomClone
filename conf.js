module.exports.read = read;
module.exports.validate = validate; // Expose for testing

function read(config) {
    let targets;
    try {
        targets = JSON.parse(config);
    } catch (err) {
        throw new Error("Parse error Check the syntax.");
    }

    if (!Array.isArray(targets.targets)) {
        throw new Error("Check the config for correctness. A toplevel targets object seems to be missing.");
    }

    targets = targets.targets;

    let requiredFields = [
        'url',
        'maxResponseTime',
        'matchString',
        'interval',
    ];

    targets.forEach((t, i) => {
        /*
        if (!requiredFields.every(field) => t.hasOwnProperty(field)) {
            throw `The ${i+1}th config item is missing some of the required fields (${requiredFields.join(", ")}).`;
        }
        validate(t);
        */
    });

    return targets;
}

function validate(target) {
    // match string empty OK?
}
