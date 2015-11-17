var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  name: 'browser',
  entry: {
    app: ['./src/index']
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
      loaders: ['babel']
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
      template: path.join(__dirname, 'static', 'index.html'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
}
