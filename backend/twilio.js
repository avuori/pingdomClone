/**
 * Backend that uses twilio api for SMS alerts.
 *
 * curl -fSs -u "$ACCOUNTSID:$AUTHTOKEN" -d "From=$CALLERID" -d "To=$PHONE" -d "Body=$MSG" "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNTSID/SMS/Messages"
 */
var rp = require('request-promise');

EventEmitter = require('events');

module.exports = (config) => {

    const emitter = new EventEmitter();

    emitter.on('alert', (data) => {
        let opts = {
            method: 'POST',
            uri: `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/SMS/Messages`,
            form: {
                From: config.callerId || '',
                To: config.phone || '',
                Body: `Alert: ${data.url} — ${data.description}`
            },
            auth: {
                user: config.accountSid,
                pass: config.authToken
            }
        };
        rp(opts)
            .then((parsedBody) => {
                // OK
            })
            .catch((err) => {
                console.log("twilio error: " + err);
            });
    });

    return emitter;
}
