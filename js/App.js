/**
 * Git UI App
 */
(function ($) {
  'use strict';

  var _ = require('_'),
    Router = require('Router'),
    SEL_APP_OUTLET = '#app-outlet';

  /**
   * @constructor
   */
  function App() {
    var $outlet = $(SEL_APP_OUTLET);
    // initialize the router
    var router = new Router($outlet);
  }

  exports.App = App;
}($));

// Start the app
var App = require('App');
window.addEventListener('load', function () {
  var app = new App();
});