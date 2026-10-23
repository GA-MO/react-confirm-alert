const path = require('path')

module.exports = {
  mode: 'production',
  entry: './main.js',
  output: { path: path.resolve(__dirname, 'out'), filename: 'main.js' },
  module: { rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }] }
}
