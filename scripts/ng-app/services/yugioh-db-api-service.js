(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('ApiService', ApiService);

  ApiService.$inject = [
    '$http',
  ];

  return {
    getById: getById
  };

  function getById(id) {
    return $http
      .get('YugiohDB.json')
      .then(r => {
        return r.data;
      })
      .catch(e => {
        return e;
      });
  }

})();