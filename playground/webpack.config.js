import path from 'path'
import { fileURLToPath } from 'url'

import LwcWebpackPlugin from '@lukethacoder/lwc-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import lwcBabelPlugin from '@lwc/babel-plugin-component'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  mode: 'development',
  target: 'web',
  entry: {
    app: './config/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
  },
  devServer: {
    port: 9000,
    hot: true,
    client: {
      logging: 'error',
    },
  },
  plugins: [
    new LwcWebpackPlugin({
      rootDir: `${process.cwd()}/`,
      // modules: [
      //   {
      //     npm: 'lightning-base-components',
      //   },
      //   // {
      //   //   dir: './node_modules/lightning-base-components/src/lightning',
      //   //   namespace: 'lightning',
      //   // },
      //   { dir: './src/modules/playground', namespace: 'playground' },
      //   { dir: './force-app/main/default/lwc', namespace: 'c' },
      //   {
      //     dirs: ['./multi-test/lwc-one/lwc', './multi-test/lwc-two/lwc'],
      //     namespace: 'multi',
      //   },
      // ],
      experimentalDynamicComponent: true,
      experimentalDynamicDirective: true,
      enableDynamicComponents: true,
    }),
    {
      apply(compiler) {
        compiler.options.module.rules.push({
          test: /\.(js|ts)$/,
          // exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // explicit import instead of a string import so consumers do not need to install '@babel/preset-typescript'
              presets: [['@babel/preset-typescript']],
              plugins: [lwcBabelPlugin],
            },
          },
        })
      },
    },
    new HtmlWebpackPlugin({ template: './config/index.html' }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
}
