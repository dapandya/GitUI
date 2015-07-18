/**
 * Renders repo list view
 */
(function ($) {

  var _ = require('_'),
    Model = require('Model');

  /**
   * @constructor
   */
  function RepoListView($outlet, params) {
    var $repoList,
      TMPL = 'tmpl-repoListView',
      TMPL_ERROR = 'tmpl-errorView',
      LIST_SELECTOR = '.repo-list',
      API_URL_REPO = 'https://api.github.com/search/repositories?q=user:$user$&type=Repositories&sort=$sort$&page=$page$',
      API_URL_USER_INFO = 'https://api.github.com/users/$user$',
      DEFAULT_SORT = 'fork',
      currentPage = 1,
      $new,
      $old,
      SEL_PAGINATION = '.pagination',
      SEL_NEW = '.new',
      SEL_OLD = '.old';;

    /**
     * Initialize view
     */
    function init () {
      var urlRepo = API_URL_REPO.replace('$user$', params.user)
        .replace('$sort$', params.sort || DEFAULT_SORT)
        .replace('$page$', params.p || currentPage),
        urlUserInfo = API_URL_USER_INFO.replace('$user$', params.user),
        pagination = {
          disablePrev: false,
          disableNext: false
        },
        userInfo,
        repoItems;

      params.p = null;
      disableNavigation();

      // renders RepoList view
      _.processStart();
      $.when(Model().get(urlRepo), Model().get(urlUserInfo))
        .done(function (dataRepo, dataUserInfo) {

          userInfo = Array.isArray(dataUserInfo) ? dataUserInfo[0] : dataUserInfo;
          repoItems = Array.isArray(dataRepo) ? dataRepo[0] : dataRepo;

          if(!repoItems || !repoItems.items.length) {
            pagination.disableNext = true;
          }
          if (currentPage <= 1) {
            pagination.disablePrev = true;
          }

          massageRepoData(repoItems)
          _.render(TMPL, {repo: repoItems, user: userInfo, pagination: pagination}, $outlet);
          bindEvents();
          _.processEnd();
        }).fail(function(data) {
          _.render(TMPL_ERROR, data.responseJSON, $outlet);
          _.processEnd();
        });
    }

    /**
     * Bind view events
     */
    function bindEvents () {
      // bind events
      $repoList = $outlet.find(LIST_SELECTOR);

      // navigates to recentCommit view: index.html?page=recentCommit
      $repoList.on('click', 'li', function(evt) {
        _.navigateUrl(evt);
      });

      $new = $outlet.find(SEL_PAGINATION + ' ' + SEL_NEW);
      $old = $outlet.find(SEL_PAGINATION + ' ' + SEL_OLD);

      $new.on('click', handlePrevious);
      $old.on('click', handleNext);
    }

    /**
     * Massage data
     * @param data
     */
    function massageRepoData(data) {
      var currTime = new Date().getTime(),
        date;
      data.items.forEach(function (v) {
        date = new Date(v.updated_at);
        date = currTime - date.getTime();
        v.updatedHours = parseInt(date / 1000/60/60, 10);
      });
    }


    /**
     * Disables pagination buttons
     */
    function disableNavigation () {
      if($new) {
        $new.prop('disabled');
      }
      if($old) {
        $old.prop('disabled');
      }
    }

    /**
     * Handler for Previous button click
     */
    function handlePrevious() {
      currentPage--;
      if(currentPage <= 1) {
        currentPage = 1;
      }
      deinit();
      init();
      // update url to reflect page number
      updateUrl();
    }

    /**
     * Handler for next button click
     */
    function handleNext() {
      currentPage++;
      deinit();
      init();
      // update url to reflect page number
      updateUrl();
    }

    /**
     * Update url to show page changes
     */
    function updateUrl () {
      var searchQuery = _.getSearchParams();
      searchQuery.p = currentPage;
      searchQuery = $.param(searchQuery);

      window.history.replaceState(null, null, '?' + searchQuery);
    }

    /**
     * Deinitializes view
     */
    function deinit() {
      // unbind events
      if($repoList) {
        $repoList.off();
      }
    }

    return  {
      init: init,
      deinit: deinit
    }
  }

  exports.RepoListView = RepoListView;

}($));
