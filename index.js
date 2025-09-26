require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/auth.js')

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use('/auth', router)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
