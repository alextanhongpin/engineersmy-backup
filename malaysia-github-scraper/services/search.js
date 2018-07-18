/*
 * search.js
 *
 * DESCRIPTION:
 * This program will perform a search for Github users in Malaysia from a specific range of year
 *
 * USAGE:
 * $ node DEBUG=app:* scripts search.js
 *
 * */

const moment = require('moment')
const request = require('request-promise')
const circuitBreaker = require('opossum')

const circuitBreakerOptions = {
  timeout: 600000, // 10 minutes
  errorThresholdPercentage: 50,
  resetTimeout: 300000 // 5 minutes
}

// Fetch the users data from a particular country
function searchGithubUsers ({ startTimestamp, endTimestamp, country, page, accessToken }) {
  const start = moment(startTimestamp).format('YYYY-MM-DD')
  const end = moment(endTimestamp).format('YYYY-MM-DD')
  const options = {
    // url: `https://api.github.com/search/users?q=alextanhongpin`,
    url: `https://api.github.com/search/users?q=location:${country} created:${start}..${end}&page=${page}`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${accessToken}`
    },
    json: true,
    resolveWithFullResponse: true
  }
  // return request(options)
  const breaker = circuitBreaker(request, circuitBreakerOptions)
  return breaker.fire(options)
}

module.exports = searchGithubUsers
