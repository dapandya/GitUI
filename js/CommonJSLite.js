/**
 * This is a light version of commonJS implementation
 * It does not support full specification.
 * In a nutshell it is a name / value pair getter / setter.
 *
 * usage:
 * exports.moduleA = function (){...}
 * var moduleA = require('moduleA')
 *
 */
(function (window) {
  'use strict';

  var _exports = {};

  function _require(identifier) {
    var obj = _exports[identifier];

    if (!obj) {
      throw new Error('CommonJSLite: Given identifier "' + identifier + '" does not exist!');
    }

    return obj;
  }

  window.exports = _exports;
  window.require = _require;

}(window));
