(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('$cardService', cardService);

    cardService.$inject = ['$http'];

  function cardService($http) {

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