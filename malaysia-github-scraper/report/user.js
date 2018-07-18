// user.js gives a report on how many users are registered over years

const start = 2008 // Github was founded
const current = new Date().getFullYear()
const years = Array(current - start + 1).fill(0).map((_, i) => i + start)

// Load all users by year
const usersByYear = years.map((year) => {
  return require(`../data/user/${year}.json`)
})

const report = usersByYear.map((year, i) => {
  let unique = {}
  const uniqueUsers = year.filter((user) => {
    if (!unique[user.login]) {
      unique[user.login] = true
      return user
    }
    return null
  }).filter((notNull) => notNull)

  return {
    count: uniqueUsers.length,
    year: i + start
  }
})

console.log(report)
