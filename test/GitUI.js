/**
 * Git UI App test runner
 */
(function ($) {
  'use strict';

  var _ = require('_'),
    Model = require('Model'),
    SEL_APP_OUTLET = '#app-outlet',
    mockDataInstance = require('mockDataInstance'),
    App = require('App');;


  /**
   * @constructor
   */
  function TestRunner() {
    var $outlet = $(SEL_APP_OUTLET),
      model = new Model(null, true),
      callbackFunction = {
        func:null
      },
      $testOutlet = $('.test-output'),
      testCount = 0;


    function init() {
      _.eventBus.on('render:completed', function() {
        if(callbackFunction.func) {
          callbackFunction.func();
        }
      });
    }

    function renderTest(testInfo) {
      var source   = $('#tmpl-testItemView').html(),
        template = Handlebars.compile(source),
        html;
      testCount++;
      testInfo.testCount = testCount;
      html    = template(testInfo);
      $testOutlet.append(html);

    }


    function runTests() {debugger;

      var testInfo = {
        expect:null,
        actual:null,
        testName:null,
        testDescription:null,
        failureMessage:null
      },
        testData,
        apiUrl;

      // start new app and clean state
      testInfo.testName = 'View: Main, Desc: Ensures number of followed users are present';
      testInfo.failureMessage = 'Failed to ensure correct number of followed users: expected: ';
      new App();
      // screen: MainView: Test 1
      apiUrl = '/api/myFavoriteUsers';
      testData = mockDataInstance[apiUrl][0];
      testInfo.expect = testData.users.length;
      model.set('/api/myFavoriteUsers', testData);
      callbackFunction.func = function () {
        testInfo.actual = $outlet.find('.main-view .user-list li').length;
        testInfo.status = testInfo.actual === testInfo.expect ? true : false;
        renderTest(testInfo);
      }
      testInfo.testName = 'View: Main, Desc: Ensures number of followed users are present';
      testInfo.failureMessage = 'Failed to ensure correct number of followed users: expected: ' + testInfo.expect;
      _.navigateUrl(null, '', true);  // navigate to the start page



      // screen: MainView: Test 2
      new App();
      testData = mockDataInstance[apiUrl][1];
      testInfo.expect = testData.users.length;
      model.set(apiUrl, testData);
      callbackFunction.func = function () {
        testInfo.actual = $outlet.find('.main-view .user-list li').length;
        testInfo.status = testInfo.actual === testInfo.expect ? true : false;
        renderTest(testInfo);
      }

      _.navigateUrl(null, '', true);  // navigate to the start page


      // Screen: RepoListView: Test 3
      testInfo.testName = 'View: Repository list, Desc: Ensures number of repositories are present';
      testInfo.failureMessage = 'Failed to ensure correct number of repositories: expected: ';

      new App();
      apiUrl = 'https://api.github.com/search/repositories?q=user:netflix&type=Repositories&sort=fork&page=1';
      testData = mockDataInstance[apiUrl];
      testInfo.expect = testData.items.length;
      model.set(apiUrl, testData);
      apiUrl = 'https://api.github.com/users/netflix';
      model.set(apiUrl, mockDataInstance[apiUrl]);
      callbackFunction.func = function () {
        testInfo.actual = $outlet.find('.repo-list-view .repo-list .repo-item').length;
        testInfo.status = testInfo.actual === testInfo.expect ? true : false;
        renderTest(testInfo);
      }

      _.navigateUrl(null, '?page=repoList&user=netflix', true);  // navigate to the repository page




      // Screen: CommitListView: Test 4
      testInfo.testName = 'View: Commit list, Desc: Ensures number of Commits are present';
      testInfo.failureMessage = 'Failed to ensure correct number of Commits: expected: ';

      new App();
      apiUrl = 'https://api.github.com/search/repositories?q=user:netflix&type=Repositories&sort=fork&page=1';
      testData = mockDataInstance[apiUrl];
      testInfo.expect = testData.items.length;
      model.set(apiUrl, testData);
      apiUrl = 'https://api.github.com/users/netflix';
      model.set(apiUrl, mockDataInstance[apiUrl]);
      callbackFunction.func = function () {
        testInfo.actual = $outlet.find('.repo-list-view .repo-list .repo-item').length;
        testInfo.status = testInfo.actual === testInfo.expect ? true : false;
        renderTest(testInfo);
      }

      _.navigateUrl(null, '?page=repoList&user=netflix', true);  // navigate to the repository page




















    }

    init();
    runTests();
  }

  exports.TestRunner = TestRunner;


}($));

// Start the app
var TestRunner = require('TestRunner');
window.addEventListener('load', function () {
  var trunner = new TestRunner();
});