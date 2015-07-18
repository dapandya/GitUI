/**
 * Renders main view
 */
(function ($) {

  var _ = require('_'),
    Model = require('Model');

  /**
   * @constructor
   */
  function MainView($outlet) {
    var $userList,
      TMPL = 'tmpl-mainView',
      USER_SELECTOR = '.user-list',

      // note: there is no such "API" URL for "users you are following".
      // Instead of hard coding this list in html.. I moved this json in to model cache
      // this way I can have single source of data to work with
      API_URL = '/api/myFavoriteUsers';

    /**
     * Initialize view
     */
    function init () {
      // renders mainView
      $.when(Model().get(API_URL))
        .done(function (data) {
          _.render(TMPL, data, $outlet);
          bindEvents();
        });
    }

    function bindEvents () {
      // bind events
      $userList = $outlet.find(USER_SELECTOR);
      // navigate to repoListView: index.html?page=repoList
      $userList.on('click', 'li', function(evt) {
        _.navigateUrl(evt);
      });
    }

    /**
     * Deinitializes view
     */
    function deinit() {
      // unbind events
      $userList.off();
    }

    return  {
      init: init,
      deinit: deinit
    }
  }

  exports.MainView = MainView;

}($));
