/**
 * Git UI App test runner
 */
(function ($) {
  'use strict';

  var _ = require('_'),
    Router = require('Router'),
    App = require('App'),
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

  // set up processing indicator
  $.ajax({
    start: function(){
      $('body').addClass('busy');
    },
    complete: function(){
      $('body').removeClass('busy');
    }
  });

}($));

// Start the app
var App = require('App');
window.addEventListener('load', function () {
  var app = new App();
});