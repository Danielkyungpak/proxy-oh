(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('ApiService', ApiService);

  ApiService.$inject = [
    '$http',
  ];

  function ApiService($http) {

    return {
      get: get,
    };

    function get() {
      console.log("in get")
      return $http
        .get('YugiohDB.json')
        .then(r => {
          console.log("success");
          return r.data;
        })
        .catch(e => {
          console.log("err");
          return e;
        });
    };
  };

})();