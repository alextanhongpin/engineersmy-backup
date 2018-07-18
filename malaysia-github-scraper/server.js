const debug = require('debug')('app:github')
const Promise = require('bluebird')
const moment = require('moment')
const app = require('express')()

const config = require('./config.js')
const writer = require('./utils/writer.js')
const paginator = require('./utils/paginator.js')

// Pipeline
const searchGithubUsers = require('./services/search')
const fetchGithubUsersInfo = require('./services/user')
const fetchGithubReposForUser = require('./services/repo')

// The start date and end date can be defined so that you do not need to scrape from scratch
const startDate = new Date(2017, 0, 1)
const endDate = new Date(2017, 11, 1)
const year = endDate.getFullYear()

debug(`Scraping data from range ${moment(startDate).format('do MM YYYY')} to ${moment(endDate).format('do MM YYYY')}`)

async function scrapeUsers () {
  const searchParams = {
    country: config.country,
    startTimestamp: startDate,
    endTimestamp: endDate,
    page: 1,
    accessToken: config.accessToken
  }

  const metadata = await searchGithubUsers(searchParams)

  if (metadata && metadata.headers) {
    const limit = metadata.headers['x-ratelimit-limit']
    const remaining = metadata.headers['x-ratelimit-remaining']
    const reset = metadata.headers['x-ratelimit-reset']
    debug('x-ratelimit-limit =>', limit)
    debug('x-ratelimit-remaining =>', remaining)
    debug('x-ratelimit-reset =>', moment().calendar(new Date(parseInt(reset, 10) * 1000)))
  }

  const { total_count: totalCount } = metadata.body
  debug(`Total users found => ${totalCount}`)
  // Need to fetch item from pages, max 1000 search results
  const pages = paginator.count(totalCount, config.perPage)
  debug(`Scraping data from ${pages.length} pages`)

  const usersBlocks = await Promise.all(pages).map((_, page) => {
    debug(`At page ${page}`)
    return searchGithubUsers({
      page,
      startTimestamp: new Date(2017, 0, 1),
      endTimestamp: new Date(2018, 0, 1),
      country: config.country,
      accessToken: config.accessToken
    })
  }, {
    concurrency: 20 // Fetch a maximun of 20 users per request
  })

  const users = usersBlocks.reduce((a, b) => {
    return a.concat(b.body.items)
  }, [])

  debug(`Constructing user array => ${users.length} users total`)
  const fileName = `./data/search/${year}.json`
  await writer.toJSON(fileName, users)

  debug(`Wrote search data to ${fileName}`)
  return users
}

// The data provided from the search github users is insufficient - get more information for each users
async function fetchUserInfo (users) {
  const usersInfo = await fetchGithubUsersInfo({
    year,
    accessToken: config.accessToken,
    data: users
  })

  const fileName = `./data/user/${year}.json`
  await writer.toJSON(fileName, usersInfo)
  debug(`Wrote user data to ${fileName}`)
  return usersInfo
}

async function fetchGithubReposForUsers (users) {
  const repos = await Promise.resolve(users).map((user) => {
    return fetchGithubReposForUser({
      user,
      accessToken: config.accessToken,
      perPage: config.perPage
    })
  }, {
    concurrency: 5
  })
  const fileName = `./data/repo/${year}.json`
  await writer.toJSON(fileName, repos)
  debug(`Wrote repo data to ${fileName}`)
  return repos
}

async function main () {
  try {
    const users = await scrapeUsers()
    const usersInfo = await fetchUserInfo(users)
    await fetchGithubReposForUsers(usersInfo)

    debug('Done. Process exiting.')
  } catch (error) {
    debug(error.message)

    if (error && error.response && error.response.headers) {
      const limit = error.response.headers['x-ratelimit-limit']
      const remaining = error.response.headers['x-ratelimit-remaining']
      const reset = error.response.headers['x-ratelimit-reset']
      debug('x-ratelimit-limit =>', limit)
      debug('x-ratelimit-remaining =>', remaining)
      debug('x-ratelimit-reset =>', moment().calendar(new Date(parseInt(reset, 10) * 1000)))
    }
  }
}
main()

app.listen(process.env.PORT, () => {
  debug(`listening to port *:4000. press ctrl + c to cancel.`)
})
