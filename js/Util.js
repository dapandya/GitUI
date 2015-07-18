/**
 * Util functions
 */
(function ($, window) {

  var instance,
    $eventBus = $({}),
    EVENT_ROUTE_CHANGE = 'route:change',
    $body = $('body');

  /**
   * prototypal extend
   * @param destination
   * @param source
   * @returns {*}
   */
  function extend(child, base) {
    var f = function(){};
    f.prototype = base;
    child.prototype = new f();
    child.prototype.super = base;
    return child;
  }

  /**
   * Renders template and appends to given outlet DOM element
   * @param templateId
   * @param context
   * @param outletEl
   */
  function render(templateId, context, outletEl) {
    var source   = $('#' + templateId).html(),
      template = Handlebars.compile(source),
      html    = template(context);

    $(outletEl).html(html);
  }

  /**
   * Gets search query string params
   * ?page=main&user=netflix --> {page: 'main',...}
   * @returns {{}}
   */
  function getSearchParams() {
    var params = {},
      tmpArr,
      queryString = window.location.search;
    if(queryString) {
      queryString = queryString.substr(1);
      tmpArr = queryString.split('&');
      tmpArr.forEach(function(v) {
        v = v.split('=');
        params[v[0]] = v[1];
      });
    }

    return params;
  }

  /**
   * Navigate to url by pushing history state
   * Also trigger route:change so router can act on it.
   * @param evt
   */
  function navigateUrl (evt) {
    var url = $(evt.target).attr('href');
    evt.preventDefault();
    evt.stopPropagation();

    window.history.pushState(null, null, url);
    $eventBus.trigger(EVENT_ROUTE_CHANGE);
  }

  /**
   * Shows  progress indicator
   */
  function processStart() {
    $body.addClass('loading');
  }

  /**
   * Removes progress indicator
   */
  function processEnd() {
    $body.removeClass('loading');
  }

  instance = exports._ || {};
  instance.extend = extend;
  instance.render = render;
  instance.getSearchParams = getSearchParams;
  instance.navigateUrl = navigateUrl;
  instance.processStart = processStart;
  instance.processEnd = processEnd;

  // using jquery object as event bus
  // different component of the app will hook into this to listen / trigger events
  instance.eventBus = $eventBus;

  exports._ = instance;

}($, window));
