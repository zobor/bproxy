var path = require('path');
module.exports = {
  entry:[
    'main.jsx'
  ],
  output: {
    path: __dirname + '/dist/',
    publicPath: "/dist/",
    filename: 'main.js'
  },
  resolve: {
    root: path.resolve('./src/'),
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: { root: path.join(__dirname, "node_modules") },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};