// pagination.js calculates the pagination for the page

// function pageCount (totalPages, perPage) {
//   return Math.ceil(totalPages / parseInt(perPage, 10)) + 1
// }

// function pageArray (pages) {
//   return Array(pages).fill(0).map((_, page) => page + 1)
// }

function count (totalPages, perPage) {
  const pages = Math.ceil(totalPages / parseInt(perPage, 10)) + 1
  return Array(pages).fill(0).map((_, page) => page + 1)
}

module.exports = {
  count
}
