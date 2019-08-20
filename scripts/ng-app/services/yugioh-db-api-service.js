(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('ApiService', ApiService);

  ApiService.$inject = [];

  return {
    getById: getById
  };

  function getById(id) {
    return;
  }

})();