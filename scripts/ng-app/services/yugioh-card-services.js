(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('$yugiohCardService', yugiohCardService);

  yugiohCardService.$inject = [
    '$http',
  ];

  function yugiohCardService($http) {

    return {
      get: get,
    };

    function get() {
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