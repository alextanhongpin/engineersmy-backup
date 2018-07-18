// language.js generates report for the languages in the repo

const dictVectorizer = require('../utils/dict-vectorizer')

const fs = require('fs')
const Promise = require('bluebird')

// Get the dictionary vector for the languages for each user
function getDictVectorLanguagesForUser (year) {
  const data = require(`../data/repo/${year}.json`)
  let unique = {}
  return data.map((repo) => {
      // Some github users do not have any repositories - skip them
    if (!repo.repos.length) {
      return null
    }
    const validRepos = repo.repos.filter((repo) => {
      // Exclude forked repos - only take users that has their own repositories
      return repo && !repo.fork
    })
    if (!validRepos.length) {
      // Filter out github users that does not have their own repositories
      return null
    }
    const languages = validRepos.map(r => r.language).filter(r => r)

    if (!languages.length) {
        // Repo does not contain any languages, return
      return null
    }

    const { login, avatar_url, html_url } = repo.repos[0].owner
    return {
      languages: dictVectorizer(languages),
      username: login,
      avatarUrl: avatar_url,
      url: html_url
    }
  }).filter(repo => repo) // Only filter those with repos
  .filter(repo => { // Filter only unique users
    if (!unique[repo.username]) {
      unique[repo.username] = true
      return true
    }
    return false
  })
}

const years = Array(2017 - 2008 + 1).fill(0).map((_, year) => year + 2008)
const output = years.map(getDictVectorLanguagesForUser).reduce((a, b) => a.concat(b), [])

fs.writeFile('./data/recommendation/input.json', JSON.stringify(output), 'utf-8', (err, ok) => {
  if (err) {
    throw err
  }
  console.log(`Successfully wrote ${output.length} to data/recommendation/data.json`)
})
