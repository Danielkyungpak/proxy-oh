(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('$cardServices', cardServices);

  cardServices.$inject = ['$http'];

  function cardServices($http) {

    return {
      get: get,
    };

    function get() {
      return $http.get('YugiohDB.json').then(r => {
        return r.data;
      })
        .catch(e => {
          return e;
        });
    };
  };

})();