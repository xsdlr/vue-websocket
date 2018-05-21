const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

const app = express()
require('express-ws')(app)
const compiler = webpack(webpackConfig)

app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
)
app.use(require('webpack-hot-middleware')(compiler))
app.use(express.static(__dirname))

app.ws('/ws', function(ws) {
  ws.send(
    JSON.stringify({
      type: 'reply',
      message: 'hello world'
    })
  )
  ws.on('message', function(message) {
    ws.send(
      JSON.stringify({
        type: 'echo',
        message
      })
    )
  })
})

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  /*  eslint-disable no-console */
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
