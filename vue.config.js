const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  filenameHashing: true,
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('csv')
      .test(/\.(csv)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(() => {
        const options = {
          limit: 8192,
          mimetype: false,
        };
        return options;
      });
    config.module
      .rule('shp')
      .test(/\.(shp)(\?.*)?$/)
      .use('raw-loader')
      .loader('raw-loader');

    return config;
  },
  configureWebpack: (config) => {
    console.log(`NODE_ENV ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )[1];
                return `npm.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      };
      const imagemin = new ImageMinimizerPlugin({
        minimizerOptions: {
          // Lossless optimization with custom option
          severityError: 'warning',
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [
              'svgo',
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      });
      config.plugins.push(imagemin);
      const brotli = new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        minRatio: 0.8,
      });
      config.plugins.push(brotli);
      config.plugins.push(new CompressionPlugin());
    }
  },
};
