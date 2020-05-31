# node-enriching-adp
A Node JS enriching adapter.

This kind of adapter receives data from topics or queues (one or many), transform the data and publishing it into another topics or queues (one or many). Usually it call other sources of data (like other http clients) to enrich the original data.

# requirements
    - [ ] consume topics
    - [ ] publish on topics
    - [ ] call http clients
    - [x] expose por 3000 to check health
    - use in data models:
        - [ ] strings
        - [ ] arrays
        - [ ] dates (date time and only date)
        - [ ] int
        - [ ] bool
        - [ ] float
    - [ ] tests with coverage