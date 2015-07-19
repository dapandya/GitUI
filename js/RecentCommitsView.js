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
      $breadCrumb,
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
      _.processStart();
      $.when(Model().get(url))
        .done(function (data) {
          parseData(data);

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
      $commitList = $outlet.find(LIST_SELECTOR);
      $new = $outlet.find(SEL_PAGINATION + ' ' + SEL_NEW);
      $old = $outlet.find(SEL_PAGINATION + ' ' + SEL_OLD);
      $breadCrumb = $outlet.find('header h4 a');

      // $commitList to commit detail page: index.html?page=commitDetail..
      //$commitList.on('click', 'li', function(evt) {
      //  _.navigateUrl(evt);
      //});

      $new.on('click', handlePrevious);
      $old.on('click', handleNext);
      $breadCrumb.on('click', _.navigateUrl);
    }

    /**
     * Disable pagination
     */
    function disableNavigation () {
      if($new) {
        $new.prop('disabled');
      }
      if($old) {
        $old.prop('disabled');
      }
      if($breadCrumb) {
        $breadCrumb.off();
      }
    }

    /**
     * Handler for previous clicked
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
     * Handler for next clicked
     */
    function handleNext() {
      currentPage++;
      deinit();
      init();
      // update url to reflect page number
      updateUrl();
    }

    /**
     * Massaging some data
     * @param data
     */
    function parseData (data) {
      var currTime = new Date().getTime(),
        date, 
        hours;
      data.forEach(function (v) {
        date = new Date(v.commit.committer.date);
        hours = currTime - date.getTime();
        v.commit.committer.hoursAgo = parseInt(hours / 1000/60/60, 10);
        
         
      });
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
