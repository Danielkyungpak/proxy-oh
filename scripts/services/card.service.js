(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('$cardService', cardService);

    cardService.$inject = ['$http'];

  function cardService($http) {

    return {
      getYugiohCards: getYugiohCards,
      getPokemonCards: getPokemonCards
    };

    function getYugiohCards() {
      return $http.get('YugiohDB.json').then(r => {
        return r.data;
      })
        .catch(e => {
          return e;
        });
    };

    function getPokemonCards() {
      return $http.get('PokemonDB.json').then(r => {
        return r.data;
      })
        .catch(e => {
          return e;
        });
    };

  };

})();