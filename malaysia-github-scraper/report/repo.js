// repo.js generates a report for the repositories related data

// const fs = require('fs')

const startYear = 2008 // Github's first public launch
const currentYear = new Date().getFullYear() + 1
const numberOfYears = currentYear - startYear

const usersByYear = Array(numberOfYears).fill(0).map((_, year) => {
  const targetYear = startYear + year
  return {
    data: require(`../data/user/${targetYear}.json`),
    label: targetYear
  }
})

const total = usersByYear.map(u => u.data.length).reduce((a, b) => { return a + b }, 0)
console.log('Total users =>', total)

const totalRepositories = usersByYear.map((year) => {
  const publicRepos = year.data.map((user) => {
    return user.public_repos
  })

  const totalPublicRepos = publicRepos.reduce((a, b) => {
    return a + b
  }, 0)
  return totalPublicRepos
}).reduce((a, b) => {
  return a + b
}, 0)

console.log('Total public repositories =>', totalRepositories)

// Calculate the number of users for each year
const data = usersByYear.map((user) => {
  console.log([user.data.length, 'users joined Github in', user.label].join(' '))
  return {
    count: user.data.length,
    label: user.label
  }
})

// writeToJson('users-by-years.json', data).then().catch()

// function writeToJson (name = 'data.json', json) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(name, JSON.stringify(json), 'utf8', (err) => {
//       err ? reject(err) : resolve(true)
//     })
//   })
// }
