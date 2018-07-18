// util/write-json.js
//
// Description: A util to write a javascript object to json file

const { promisify } = require('util')
const fs = require('fs')

function toJSON (filePath, json) {
  const options = { encoding: 'utf-8' }
  return promisify(fs.writeFile)(filePath, JSON.stringify(json), options)
}

module.exports = {
  toJSON
}
