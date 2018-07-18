// Fetches data for the user's repository and carry out processing

const paginator = require('../utils/paginator.js')
const debug = require('debug')('app:github')
const Promise = require('bluebird')
const request = require('request-promise')

const circuitBreaker = require('opossum')

const circuitBreakerOptions = {
  timeout: 600000, // 10 minutes
  errorThresholdPercentage: 50,
  resetTimeout: 300000 // 5 minutes
}

async function fetchGithubRepoForUser ({ login, page, accessToken }) {
  debug(`Fetching repo for user ${login} at page ${page}`)
  const options = {
    url: `https://api.github.com/users/${login}/repos?page=${page}`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${accessToken}`
    },
    json: true
  }
  const breaker = circuitBreaker(request, circuitBreakerOptions)
  return breaker.fire(options)
}

async function fetchGithubReposForUser ({ user, accessToken, perPage }) {
  const pages = paginator.count(user.public_repos, perPage)
  const promises = await Promise.resolve(pages).map((page) => {
    return fetchGithubRepoForUser({
      page,
      accessToken,
      login: user.login
    })
  }, {
    concurrency: 10
  })

  const repos = promises.reduce((a, b) => {
    return a.concat(b)
  }, [])

  return {
    repos: repos,
    user: user.login
  }
}

module.exports = fetchGithubReposForUser
