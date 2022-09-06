/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: `${path.join(__dirname, 'src')}/main.ts`
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }, {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  mode: 'development',
  devtool: 'source-map', // comment before compressing
  devServer: { // comment before compressing
    hot: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        // terserOptions: {
        //   // ecma: 'ESNext',
        //   mangle: {
        //     properties: true
        //   },
        // }
      }),
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // comment before compressing
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `${path.join(__dirname, 'public')}/index.html`,
      scriptLoading: 'defer'
    }),
  ]
}
