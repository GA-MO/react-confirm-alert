const config = require('./configs')
const path = require('path')

module.exports = {
  devtool: 'eval',
  entry: [ 'babel-polyfill', 'react-hot-loader/patch', './dev/index.js' ],
  output: {
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [ 'babel-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(woff2?|ttf|eot|svg|jpg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  resolve: {
    alias: {
      [config.name]: path.join(__dirname, 'src')
    },
    modules: [ 'node_modules', 'src', 'dev' ],
    extensions: [ '.js', '.jsx' ]
  }
}
