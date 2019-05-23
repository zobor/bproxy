var path = require('path');
module.exports = {
  entry:[
    './src/main.jsx'
  ],
  output: {
    path: __dirname + '/dist/',
    publicPath: "/dist/",
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  mode: 'production',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react']
          }
        }
      }
    ]
  }
};