# pingdomClone

A small Pingdom clone for website monitoring.

## Installation

npm install

## Usage

node index.js --config \<config\> [--interval \<ms\>]

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

## Architecture

The program contains four main components: the main program, the targets, the backends and the configuration. 

The main program just initializes and starts things based on what is described in the configuration. The configuration along with the command line arguments are used to set inputs to the program, essentially defining what sites to monitor and what kind of requirements are expected from the sites. Targets are definitions of monitoring requirements, defined in the configuration file.

Backends define what the program does with its output. The backends are decoupled from monitoring, encapsulated in individual backend modules under the backend directory. They are configured from the configuration file. The benefit of this decoupling is that adding new backends does not require us to modify the monitoring logic, and keeps both the monitoring code and the individual backend code small and simple.

## Extending to monitor from multiple geolocations

The selected architecture allows the program to be extended straightforwardly to support monitoring from multiple geolocations. As individual monitoring nodes can define a backend to send results over the network, the data transfer part is just a few lines of code. The Twilio backend works as an example of sending results over a REST API securely (SSL+http auth). Another secure way to transfer the data from multiple locations could be to setup a VPN.

What is missing still, would be a controller node that would receive the individual monitoring results from multiple locations, and combine them to provide an overview of results from all locations. This controller could define a simple REST api and provide an interface to review the combined results.

