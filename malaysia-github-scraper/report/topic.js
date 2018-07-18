
const start = 2016 // Github was founded
const current = new Date().getFullYear()
const years = Array(current - start + 1).fill(0).map((_, i) => i + start)
let stopwords = require('stopwords').english

stopwords = stopwords.concat([
  '1',
  '2',
  '3',
  '4',
  '5'
])

// Load all users by year
const reposByYear = years.map((year) => {
  return require(`../data/repo/${year}.json`)
})

const bagOfWords = reposByYear.map((yearSegment) => {
  return yearSegment.map((user) => {
    return user.repos
    .map(repo => repo.description)
    .filter(notNull => notNull)
    .map(a => a.toLowerCase())
    .map(description => description.split(' '))
    .reduce((a, b) => a.concat(b), [])
    .filter(notNull => notNull)
    .map(a => {
      const match = a.match(/[\w\d]+/img)
      return match && match[0]
    })
    .filter(notNull => notNull)
    .filter(token => !stopwords.includes(token))
  }).reduce((a, b) => a.concat(b), [])
}).reduce((a, b) => a.concat(b))

const tokenizer = bagOfWords.reduce((a, b) => {
  if (!a[b]) {
    a[b] = 0
  }
  a[b] += 1
  return a
}, {})

const entries = Object.entries(tokenizer)
let max = 0
const sorted = entries.sort((a, b) => {
  max = Math.max(max, a[1])
  max = Math.max(max, b[1])
  return b[1] - a[1]
})

console.log(sorted.splice(0, 100).map(([text, size]) => ({ text, size })))
