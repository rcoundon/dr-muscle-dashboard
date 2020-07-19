// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins');
const version = require('./package.json').version;
const webpack = require('webpack');

module.exports = {
  productionSourceMap: true,
  transpileDependencies: ['buefy'],
  lintOnSave: true,
  filenameHashing: true,
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false
  //   }
  // }
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
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
            }
          }
        }
      }
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
        filename: '[path].gz[query]',
        algorithm: 'gzip'
      })
    ]
  }
};
