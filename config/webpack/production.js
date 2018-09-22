// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const sharedConfig = require('./shared.js');
const OfflinePlugin = require('offline-plugin');
const { publicPath } = require('./configuration.js');
const path = require('path');
const { URL } = require('url');

let attachmentHost;

if (process.env.S3_ENABLED === 'true') {
  if (process.env.S3_ALIAS_HOST || process.env.S3_CLOUDFRONT_HOST) {
    attachmentHost = process.env.S3_ALIAS_HOST || process.env.S3_CLOUDFRONT_HOST;
  } else {
    attachmentHost = process.env.S3_HOSTNAME || `s3-${process.env.S3_REGION || 'us-east-1'}.amazonaws.com`;
  }
} else if (process.env.SWIFT_ENABLED === 'true') {
  const { host } = new URL(process.env.SWIFT_OBJECT_URL);
  attachmentHost = host;
} else {
  attachmentHost = null;
}

module.exports = merge(sharedConfig, {
  mode: 'production',

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  devtool: 'source-map', // separate sourcemap file, suitable for production
  stats: 'normal',

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,

        uglifyOptions: {
          mangle: true,

          compress: {
            warnings: false,
          },

          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  plugins: [
    new OfflinePlugin({
      publicPath: publicPath, // sw.js must be served from the root to avoid scope issues
      caches: {},
      ServiceWorker: {
        entry: `imports-loader?ATTACHMENT_HOST=>${encodeURIComponent(JSON.stringify(attachmentHost))}!${encodeURI(path.join(__dirname, '../../app/javascript/mastodon/service_worker/entry.js'))}`,
        cacheName: 'mastodon',
        output: '../assets/sw.js',
        publicPath: '/sw.js',
        minify: true,
      },
    }),
  ],
});
