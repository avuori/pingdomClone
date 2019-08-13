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
            "maxResponseTime": 200,
            "matchString": "Google",
            "interval": 10000
        },
        {
            "url": "https://f-secure.com/",
            "maxResponseTime": 500,
            "matchString": "F-Secure",
            "interval": 15000
        }
    ]
}
```
