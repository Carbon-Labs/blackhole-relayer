# Relayer for Blackhole CARB

## Getting listed on blackhole.carbontoken.info

1. ...

Disclaimer: Please consult with legal and tax advisors regarding the compliance of running a relayer service in your jurisdiction. The authors of this project bear no responsibility.

USE AT YOUR OWN RISK.


## Deploy


## Run locally


```bash
curl -X POST -H 'content-type:application/json' --data '<input data>' http://127.0.0.1:8000/relay
```

Relayer should return a transaction hash

In that case you will need to add https termination yourself because browsers with default settings will prevent https
blackhole.carbontoken.info UI from submitting your request over http connection


## Architecture