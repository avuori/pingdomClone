# pingdomClone

A small Pingdom clone for website monitoring.

## Usage

node index.js --config \<config\> [--interval \<ms\>] [--log \<log\>]

If you define --interval, it overrides the specific intervals defined in the configuration file.

## Config file

```json
{
    "targets": [
        {
            "url": "https://google.com/",
            "maxLoadTime": 5000,
            "matchString": "Google",
            "interval": 10000,
            "timeout": 10000
        },
        {
            "url": "https://f-secure.com/",
            "maxLoadTime": 5000,
            "matchString": "F-Secure",
            "interval": 15000,
            "timeout": 10000
        }
    ],
    "backends": [
        {
            "name": "console"
        },
        {
            "name": "logfile",
            "file": "/tmp/pingdomClone.log"
        },
        {
            "name": "twilio",
            "phone": "+358000000000",
            "accountSid": "",
            "authToken": "",
            "callerId": ""
        }
    ]
}
```
### Targets

A target object defines a website URL to monitor.

* url — Target web address to monitor
* maxLoadTime — Maximum web page load time in milliseconds allowed before triggering an alert
* matchString — String that must be found from the response body
* interval — Time interval between each request in milliseconds
* timeout — Controls read timeout and connection timeout

### Backends

A backend object defines which backends are receiving monitoring events. You can define a new backend simply by defining a new module under the 'backend' directory, as long as its only interface out is a function that takes the backend configuration object as a parameter and returns an instance of EventEmitter. The EventEmitter handlers are 'ok' and 'alert' and they both are functions taking 'data' as argument, and the data has the following fields: status (alert|ok), datetime, url, description.

#### Console backend

Writes results to console.

* name — console

#### Logfile backend

Writes results to a local logfile.

* name — logfile
* file — Path to the logfile

#### Twilio backend

Sends alerts only as SMS using Twilio api.

* name — twilio
* phone — The phone number to send SMS to
* accountSid — Twilio ACCOUNTSID
* authToken — Twilio AUTHTOKEN
* callerId — Twilio CALLERID
