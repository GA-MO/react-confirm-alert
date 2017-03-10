var path = require('path')
var webpack = require('webpack')

module.exports = {
  // devtool: 'source-map',
  entry: './dev/index.js',
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
      _: 'lodash',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      minimize: true,
    }),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/, include: __dirname },
    ],
  },
  resolve: {
    alias: {
      'react-confirm-alert': path.join(__dirname, 'src')
    },
    extensions: ['', '.js', '.jsx', '.json'],
  },
}
