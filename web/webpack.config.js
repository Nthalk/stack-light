/* eslint-disable */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  argv = argv || {mode: 'development'};
  return {
    mode: argv.mode,
    devtool: argv.mode === 'production' ? false : 'source-map',
    entry: {
      boot: path.resolve(__dirname, 'src/boot.tsx'),
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].chunk.js',
    },
    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
      proxy: {
        '/api': 'http://localhost:8081',
      },
    },
    stats: {
      hash: false,
      assets: false,
      children: false,
      entrypoints: false,
      builtAt: true,
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.[jt]sx?$/,
          loader: 'eslint-loader',
          options: {
            fix: true,
            emitError: true,
            emitWarning: true,
          },
        },
        {
          test: /\.[jt]sx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            configFile: path.resolve('.babelrc'),
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|eot|woff|ttf|svg|woff2|ico)$/,
          loader: 'file-loader',
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules')],
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    watchOptions: {
      aggregateTimeout: 1000,
      poll: 500,
      ignored: /node_modules/,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new (require('html-webpack-plugin'))({
        template: path.resolve(__dirname, 'src/index.html'),
      }),
      new (require('fork-ts-checker-webpack-plugin'))(),
      new (require('clean-terminal-webpack-plugin'))(),
    ].concat(
      argv.mode === 'production'
        ? [
            new (require('compression-webpack-plugin'))(),
            new (require('clean-webpack-plugin').CleanWebpackPlugin)(),
          ]
        : []
    ),
  };
};
