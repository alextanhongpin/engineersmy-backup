// repo.js scrapes a github user's repo

// E.g. githubApiEndpoint: https://api.github.com/users/alextanhongpin/repos
const debug = require('debug')('app:github')
const Promise = require('bluebird')
const request = require('request-promise')
const circuitBreaker = require('opossum')

const circuitBreakerOptions = {
  timeout: 600000, // 10 minutes
  errorThresholdPercentage: 50,
  resetTimeout: 300000 // 5 minutes
}

// fetchGithubUserInfo will get a user's info by the login name
async function fetchGithubUserInfo ({ login, accessToken }) {
  debug(`Fetching info for ${login}`)
  const options = {
    url: `https://api.github.com/users/${login}`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${accessToken}`
    },
    json: true
  }

  const breaker = circuitBreaker(request, circuitBreakerOptions)
  return breaker.fire(options)
}

// fetchGithubUsersInfo will iterate through a list of login name and fetch the user's information
async function fetchGithubUsersInfo ({ data = [], year, accessToken }) {
  if (!data.length) {
    return []
  }
  const logins = data.map((user) => ({
    accessToken,
    login: user.login
  }))

  const users = await Promise.resolve(logins).map(fetchGithubUserInfo, {
    concurrency: 5
  })
  return users
}

module.exports = fetchGithubUsersInfo
