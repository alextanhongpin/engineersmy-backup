
const dictVectorizer = (data) => {
  return data.reduce((a, b) => {
    if (!a[b]) {
      a[b] = 0
    }
    a[b] += 1
    return a
  }, {})
}

module.exports = dictVectorizer
