var path = require('path');
var URL = require('url');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var StringReplacePlugin = require("string-replace-webpack-plugin");

if (!process.env.API_ENDPOINT) {
  throw new Error('API_ENDPOINT must be set');
}
var SITE_TITLE = process.env.SITE_TITLE || 'ImmuneDB';

module.exports = {
  name: 'browser',
  entry: {
    app: './src/index'
  },
  output: {
    // The output directory as absolute path
    path: path.join(__dirname, process.env.OUT_DIR || 'dist'),
    // The filename of the entry chunk as relative path inside the output.path directory
    filename: '[name].js',
    publicPath: process.env.BASENAME ? '/' + process.env.BASENAME + '/' : '/'
  },
  devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
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
              pattern: /BASENAME/g,
              replacement: function(match, p1, offset, string) {
                if (process.env.BASENAME) {
                  return process.env.BASENAME;
                } else {
                  return '';
                }
              }
            },
            {
              pattern: /VERSION/g,
              replacement: function(match, p1, offset, string) {
                if (process.env.NODE_ENV === 'production') {
                  return 'v ' + require('./package.json').version;
                } else {
                  return 'develop';
                }
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
      template: path.join(__dirname, 'static', 'index.html'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new StringReplacePlugin()
  ],
  devServer: {
    disableHostCheck: true
  }
}
