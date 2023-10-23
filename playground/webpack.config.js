const path = require('path')
const LwcWebpackPlugin = require('@lukethacoder/lwc-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new LwcWebpackPlugin({
      rootDir: './',
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
}
