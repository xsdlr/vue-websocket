const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    app: ['es6-promise/auto', path.join(__dirname, 'app.js'), hotMiddlewareScript]
  },
  output: {
    path: path.join(__dirname, '__build__'),
    filename: 'index.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
      'vue-plugin': path.join(__dirname, '..', 'src')
    }
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
  ]
}
