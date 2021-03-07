const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('running on index')
})
 
app.listen(3000)