const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { index: path.join(__dirname, 'src/index.js') },
  output: {
    filename: 'static/js/[name].[chunkhash].js',
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html'
    })
  ]
};
