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
            "interval": 10000
        },
        {
            "url": "https://f-secure.com/",
            "maxLoadTime": 5000,
            "matchString": "F-Secure",
            "interval": 15000
        }
    ]
}
```
### Parameters

* url — Target web address to monitor
* maxLoadTime — Maximum web page load time in milliseconds allowed before triggering an alert
* matchString — String that must be found from the response body
* interval — Time interval between each request in milliseconds
