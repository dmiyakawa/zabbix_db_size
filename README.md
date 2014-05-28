# What is this?

* Estimates local Zabbix DB size with JavaScript and Zabbix API.
* Tested on Zabbix API 2.2.3.
* Relies on jqzabbix.
* Released under MIT License.
* Copyright (c) Daisuke Miyakawa

## Note

* At this point this works only with localhost.
* Zabbix Server 2.2.3 does not support COURS or JSONP,
and thus there seems no way to let JS obtain cross-domain data.
* Let me know if I'm wrong. I'll be happy to fix my code :-)
* For other Zabbix examples (especially with Python) check https://github.com/dmiyakawa/zabbix_api_examples
