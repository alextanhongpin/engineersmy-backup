const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./dist'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(8080, () => {
  console.log('listening to port *:8080. press ctrl + c to cancel.')
})
