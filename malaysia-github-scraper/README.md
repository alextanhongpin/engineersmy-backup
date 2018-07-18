# node-github-api


:page_with_curl: sample github api queries with nodejs for scraping purposes

## Description

Scraping github users based by the year the account is created. The reason we do this is due to github's api limitation that limits only 1000 results.


# Data

The folder `data/search` contains the data from the Github's Search API. It contains the list of the Github users from Malaysia based on when the account was created.

The folder `data/user` contains the data of the users from the Github's User API endpoint. It has additional field compared to the results from the Github's Search API.

The folder `data/repo` contains the data for each user's repositories.


### Setup 


Before running the program, ensure you have the following environment variables:

```bash
ACCESS_TOKEN=<YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
COUNTRY=malaysia # The country where the Github users resides
PER_PAGE=30 # The max amount of items Github returns per page
PORT=4000 # The port where the server is listening to
```

### Scraping

To start the scraping:

```bash
$ nf start
```

### Todos

- [ ] Report generation
- [ ] Automate scraping
- [ ] User can see summary