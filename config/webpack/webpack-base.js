const path = require('path');
const rootPath = process.cwd();
const context = path.join(rootPath, "src");
const outputPath = path.join(rootPath, 'dist');
const bannerPlugin = require('./plugins/banner');

module.exports = {
  context,
  entry: {
    cornerstoneArchiveImageLoader: './imageLoader/index.js',
    cornerstoneArchiveImageLoaderWebWorker: './webWorker/index.js'
  },
  target: 'web',
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    path: outputPath,
    umdNamedDefine: true
  },
  devtool: 'source-map',
  externals: {
    jquery: {
      commonjs: "jquery",
      commonjs2: "jquery",
      amd: "jquery",
      root: '$'
    },
    'cornerstone-core': {
      commonjs: "cornerstone-core",
      commonjs2: "cornerstone-core",
      amd: "cornerstone-core",
      root: 'cornerstone'
    },
    'cornerstone-dicom-parser-utf8': {
      commonjs: "cornerstone-dicom-parser-utf8",
      commonjs2: "cornerstone-dicom-parser-utf8",
      amd: "cornerstone-dicom-parser-utf8",
      root: 'dicomParser'
    },
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'eslint-loader',
      options: {
        failOnError: true
      }
    }, {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  plugins: [
    bannerPlugin()
  ]
};
