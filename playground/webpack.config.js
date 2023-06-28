const LwcWebpackPlugin = require('@lukethacoder/lwc-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  plugins: [
    new LwcWebpackPlugin({
      rootDir: './',
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
}
