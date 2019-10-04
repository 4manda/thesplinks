/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Browser dev server.  This config will be used with `webpack-dev-server`
// to enable hot-reloading.  Sourcemaps and full debugging is enabled.

// ----------------------
// IMPORTS

/* NPM */
import webpack from 'webpack';
import WebpackConfig from 'webpack-config';

// Chalk terminal library
import chalk from 'chalk';

/* Local */


// Import console messages
import { css, stats } from './common';
import { logServerStarted } from '../lib/console';

// Locla paths
import PATHS from '../../config/paths';

// ----------------------

// Host and port settings to spawn the dev server on
const HOST = process.env.BROWSER_HOST || 'localhost';
const PORT = process.env.BROWSER_PORT || 8090;
const LOCAL = `http://${HOST}:${PORT}/`;

export default new WebpackConfig().extend({
  '[root]/browser.js': conf => {
    // Add `webpack-dev-server` polyfills needed to communicate with the browser

    conf.entry.browser.unshift(
      `webpack-dev-server/client?${LOCAL}`, // webpack dev server host and client
      'webpack/hot/only-dev-server',
    );

    return conf;
  },
}, '[root]/dev.js').merge({
  module: {
    rules: [
      // CSS loaders
      ...css.getDevLoaders(),
    ],
  },

  // Dev server configuration
  devServer: {

    // bind our dev server to the correct host and port
    host: HOST,
    port: PORT,
    // link HTTP -> app/public, so static assets are being pulled from
    // our source directory and not the `dist/public` we'd normally use in
    // production.  Use `PATH.views` as a secondary source, for serving
    // the /webpack.html fallback
    contentBase: [
      PATHS.static,
      PATHS.views,
    ],

    // Enables compression to better represent build sizes
    compress: true,

    // Assume app/public is the root of our dev server
    publicPath: '',

    // Inline our code, so we wind up with one, giant bundle
    inline: true,

    // Hot reload FTW! Every change is pushed down to the browser
    // with no refreshes
    hot: true,

    // Disable build's information
    noInfo: false,

    // Show a full-screen overlay in the browser when there is a
    // compiler error
    overlay: true,

    // We're using React Router for all routes, so redirect 404s
    // back to the webpack-dev-server bootstrap HTML
    historyApiFallback: {
      index: '/webpack.html',
    },

    // Allow any origin, for use with Docker or alternate hosts, etc
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },

    // Format output stats
    stats,
  },

  // Extra output options, specific to the dev server -- source maps and
  // our public path
  output: {
    publicPath: `${LOCAL}`,
  },

  plugins: [
    // Log to console when `webpack-dev-server` has finished
    {
      apply(compiler) {
        compiler.plugin('done', () => {
          logServerStarted({
            type: 'hot-reloading browser',
            host: HOST,
            port: PORT,
            chalk: chalk.bgMagenta.green,
            allowSSL: false,
          });
        });
      },
    },

    new webpack.NamedModulesPlugin(),

    // Activate the hot-reloader, so changes can be pushed to the browser
    new webpack.HotModuleReplacementPlugin(),
    
    // Global variables
    new webpack.DefinePlugin({
      // We're not running on the server
      SERVER: false,
      'process.env': {
        // Point the server host/port to the dev server
        HOST: JSON.stringify(process.env.HOST || HOST),
        PORT: JSON.stringify(process.env.PORT || PORT),
        SSL_PORT: process.env.SSL_PORT ? JSON.stringify(process.env.SSL_PORT) : null,

        // Debug development
        NODE_ENV: JSON.stringify('development'),
        DEBUG: true,
        VERSION: JSON.stringify(process.env.VERSION),
        APP_NAME: JSON.stringify(process.env.APP_NAME),
      },
    }),
  ],
});
