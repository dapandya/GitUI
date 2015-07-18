/**
 * Calls Server, returns data given url
 * Maintains data cache and ensures data is always fresh (data freshness latency is 30s)
 */
(function ($) {
  'use strict';

  var _ = require('_'),
    dataCache = {
      // this particular API data is hard coded here (as there is no such api available on gitHub)
      // to render the first page: 'Users you are following'
      '/api/myFavoriteUsers': {
        timeStamp: null,
        data: {users: ['netflix', 'facebook', 'linkedin', 'dapandya']}
      }
    },
    modelInstance,
    cacheExpireDelay;


  /**
   * Generic Model for the App
   *
   * @param _cacheExpireDelay
   * @returns {*}
   * @constructor
   */
  function Model (_cacheExpireDelay) {

    cacheExpireDelay = _cacheExpireDelay || 30000;
    // return singleton instance
    if (modelInstance) {
      return modelInstance;
    }

    function getTime() {
      var currTime = new Date();
      return currTime.getTime();
    }

    /**
     * Checks if cached data is expired or not
     * @param cachedData
     * @returns {boolean}
     */
    function isExpired(cachedData) {
      var timestamp = cachedData['timestamp'];

      if(!timestamp) {
        return false;
      }

      if((timestamp + _cacheExpireDelay) < getTime()) {
        return true;
      }
    }

    /**
     * Sets the data into cache
     * @param url
     * @param data
     */
    function set(url, data) {
      dataCache[url] = {
        timeStamp: getTime(),
        data: data
      };
    }

    /**
     * Performance GET request
     * Return data on resolve given url
     * - immediately returns cachedData if not expired else makes server call
     * @param url
     * @returns promise
     */
    function get(url) {
      var cachedData = dataCache[url],
        promise;

      if (cachedData && !isExpired(cachedData)) {
        cachedData = cachedData.data;
      } else {
        cachedData = false;
      }

      promise =  $.when(cachedData || $.get( url )
          .done(function(data) {
            set(url, data);
          })
          .fail(function(data) {
          }));

      return promise;
    }

    /**
     * Performance POST / PATCH request
     * @param url
     * @param data
     */
    function save(url, data) {
      // not implemented / intentionally left blank

      // remove data from cache.. as we do not know how server may mutate the posted/patched data
    }

    /**
     * Performance DELETE request
     * @param url
     */
    function remove(url) {
      // not implemented / intentionally left blank

      // remove data from cache and send DELETE request to server
    }


    modelInstance = {
      get: get
    };

    return modelInstance;

  }

  exports.Model = Model;

}($));