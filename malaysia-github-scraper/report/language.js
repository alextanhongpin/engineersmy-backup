// language.js generates report for the languages in the repo

const dictVectorizer = require('../utils/dict-vectorizer')

const repoFolder = './data/repo/'
const fs = require('fs')
const Promise = require('bluebird')

// Get the dictionary vector for the languages for each user
// function getDictVectorLanguagesForUser (year) {
//   const data = require(`../data/repo/${year}.json`)
//   return data.map((repo) => {
//     const languages = repo.repos.filter((repo) => {
//       return repo && !repo.fork
//     })
//     return {
//       vectors: dictVectorizer(languages.map(r => r.language)),
//       login: repo.repos[0].owner.login
//       // avatarUrl: repo.repos[0].owner.avatar_url
//     }
//   })
// }

// console.log(getDictVectorLanguagesForUser(2017))

function getDictVectorLanguagesForUsers (data) {
  return data.repos.filter((repo) => {
    return repo && !repo.fork
  }).map(r => r.language)
  .reduce((a, b) => {
    return a.concat(b)
  }, [])
}

console.time('benchmark-file')
fs.readdir(repoFolder, (err, files) => {
  if (err) {
    throw err
  }
  const output = files.filter(f => f.includes('.json'))
    .map(file => [ '.', repoFolder, file ].join(''))
    .map(fileName => require(fileName))

  Promise.all(output)
    .then((data) => {
      return data.reduce((a, b) => {
        return a.concat(b)
      }, [])
      .map(getDictVectorLanguagesForUsers)
      .reduce((a, b) => {
        return a.concat(b)
      }, [])
      .filter(x => x)
    }).then((output) => {
      console.log(dictVectorizer(output))
      console.timeEnd('benchmark-file')
    }).catch(console.log)
})
