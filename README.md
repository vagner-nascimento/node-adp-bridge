# node-enriching-adp
A Node JS enriching adapter.

This kind of adapter receives data from topics or queues (one or many), transform the data and publishing it into another topics or queues (one or many). Usually it call other sources of data (like other http clients) to enrich the original data.

# stress test result running on docker
    - 100.000 messages in 8:21 minutes (pc configs: intel i7 9th gen and 8GB ram memory)

# requirements
    - [x] consume topics
    - [x] publish on topics
    - [x] call http clients
    - [x] expose por 3000 to check health
    - [x] dockerize app
    - use in data models:
        - [x] strings
        - [x] arrays
        - [x] dates (date time and only date)
        - [x] bool
        - [x] number
    - [ ] tests with coverage
