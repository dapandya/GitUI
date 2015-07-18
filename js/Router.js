/**
 * App Router: Similar behavior to common mvc framework routers (like backbonejs Router)
 * Executes a related view based on App Route change
 */
(function ($) {

  var _ = require('_'),
    MainView = require('MainView'),
    RepoListView = require('RepoListView'),
    RecentCommitsView = require('RecentCommitsView'),
    currentActiveView,
    EVENT_ROUTE_CHANGE = 'route:change';

  /**
   * @constructor
   */
  function Router($outlet) {
    var routes = {
      'main': mainPage,         // ?page=main
      'default': mainPage,      // ?page=main
      'repoList': repoListPage, // ?page=repoList&user=[netflix]
      'recentCommits': recentCommitsPage,   // ?page=recentCommits&user=netflix&repoId=[repoId]
      '*': _404Page
    }

    /**
     * Renders MainView
     * @param params
     */
    function mainPage(params) {
      currentActiveView = new MainView($outlet, params);
      currentActiveView.init();
    }

    /**
     * Renders RepoListView
     * @param params
     */
    function repoListPage(params) {
      currentActiveView = new RepoListView($outlet, params);
      currentActiveView.init();
    }

    /**
     * Renders RecentCommitsView
     * @param params
     */
    function recentCommitsPage(params) {
      currentActiveView = new RecentCommitsView($outlet, params);
      currentActiveView.init();
    }

    /**
     * Renders 404 page
     * @param params
     * @private
     */
    function _404Page(params) {
      _.render('tmpl-404View', null, $outlet);
      currentActiveView = null;
    }

    /**
     * Hook for postRoute Change
     */
    function postRouteChange() {
      // intentionally left blank
      // add needed code here.. tracking?

      $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    /**
     * Hook for preRoute Change
     */
    function preRouteChange() {
      if(currentActiveView) {
        // deinitialize the last active view
        currentActiveView.deinit();
      }
    }

    /**
     * Handles route change.
     * Will try to match route or else fallback to 404
     * @param evt
     */
    function handleRouteChange(evt) {
      var params = _.getSearchParams(),
        page = params.page,
        pageFunction = routes[page];


      preRouteChange();

      if(!page) {
        // render default route
        routes.main(params);
      } else if(!pageFunction) {
        // did not find any matching route.. render 404 route
        _404Page(params);
      } else {
        pageFunction(params);
      }

      postRouteChange();
    }

    /**
     * Initialize the router
     */
    function init () {
      // bind events
      _.eventBus.on(EVENT_ROUTE_CHANGE, handleRouteChange);
      window.onpopstate = handleRouteChange;

      // trigger route handle
      handleRouteChange();
    }

    // init
    init();
  }

  exports.Router = Router;

}($));
