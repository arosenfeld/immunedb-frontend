var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var StringReplacePlugin = require("string-replace-webpack-plugin");

if (!process.env.BASE_URL || !process.env.API_ENDPOINT) {
  throw new Error('BASE_URL and API_ENDPOINT must be set');
}
var SITE_TITLE = process.env.SITE_TITLE || 'SimLab Database';

module.exports = {
  name: 'browser',
  entry: {
    app: './src/index'
  },
  output: {
    // The output directory as absolute path
    path: path.join(__dirname, 'dist'),
    // The filename of the entry chunk as relative path inside the output.path directory
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.js$|\.jsx$/,
      exclude: /node_modules/,
      loaders: [
        'babel',
        StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /API_ENDPOINT/g,
              replacement: function(match, p1, offset, string) {
                return process.env.API_ENDPOINT;
              }
            },
            {
              pattern: /SITE_TITLE/g,
              replacement: function(match, p1, offset, string) {
                return SITE_TITLE;
              }
            }
          ]
        })
      ]
    }],
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      { test: /\.woff(2)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg|png)?$/, loader: 'file-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.react.js', '.js', '.jsx'],
    modulesDirectories: [
      'src', 'node_modules', 'semantic/dist/', 'static'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: SITE_TITLE,
      baseUrl: process.env.BASE_URL + '/',
      template: path.join(__dirname, 'static', 'index.html'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new StringReplacePlugin()
  ],
}
