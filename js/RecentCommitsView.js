/**
 * Renders repo list view
 */
(function ($) {

  var _ = require('_'),
    Model = require('Model');

  /**
   * @constructor
   */
  function RecentCommitsView($outlet, params) {
    var $commitList,
      currentPage = 1,
      $new,
      $old,
      TMPL = 'tmpl-recentCommitsView',
      TMPL_ERROR = 'tmpl-errorView',
      LIST_SELECTOR = '.commit-list',
      SEL_PAGINATION = '.pagination',
      SEL_NEW = '.new',
      SEL_OLD = '.old',
      API_URL = 'https://api.github.com/repos/$user$/$repo$/commits?page=$page$';

    /**
     * Initialize view
     */
    function init () {
      var pagination = {
        disablePrev: false,
        disableNext: false
      },
        url;

      url = API_URL.replace('$user$', params.user)
        .replace('$repo$', params.repo)
        .replace('$page$', params.p || currentPage);

      params.p = null;

      disableNavigation();
      // renders RepoList view
      $.when(Model().get(url))
        .done(function (data) {
       //   parseData(data);

          if(!data.length) {
            pagination.disableNext = true;
          }
          if (currentPage <= 1) {
            pagination.disablePrev = true;
          }
          _.render(TMPL, {
            items: data,
            pagination: pagination,
            repo: params.repo,
            user: params.user
          }, $outlet);

          bindEvents();
        }).fail(function(data) {
          _.render(TMPL_ERROR, data.responseJSON, $outlet);
        });
    }

    function bindEvents () {
      // bind events
      $commitList = $outlet.find(LIST_SELECTOR);
      $new = $outlet.find(SEL_PAGINATION + ' ' + SEL_NEW);
      $old = $outlet.find(SEL_PAGINATION + ' ' + SEL_OLD);

      // $commitList to commit detail page: index.html?page=commitDetail..
      //$commitList.on('click', 'li', function(evt) {
      //  _.navigateUrl(evt);
      //});

      $new.on('click', handlePrevious);
      $old.on('click', handleNext);
    }

    function disableNavigation () {
      if($new) {
        $new.prop('disabled');
      }
      if($old) {
        $old.prop('disabled');
      }
    }

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

    function handleNext() {
      currentPage++;
      deinit();
      init();
      // update url to reflect page number
      updateUrl();
    }

    function parseData (data) {
      data.forEach(function (v) {
        v.commit.committer.date = new Date(commit.committer.date);
      })
    }

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
      $commitList.off();
      $new.off();
      $old.off();
    }

    return  {
      init: init,
      deinit: deinit
    }
  }

  exports.RecentCommitsView = RecentCommitsView;

}($));
