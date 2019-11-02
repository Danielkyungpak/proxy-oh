(function () {
  'use strict';

  angular
    .module('ProxyOh')
    .factory('$cardService', cardService);

  cardService.$inject = ['$http'];

  function cardService($http) {

    return {
      getYugiohCards: getYugiohCards,
      getPokemonCards: getPokemonCards,
      getWeissCardsBySet: getWeissCardsBySet,
      getWeissCardSets: getWeissCardSets,
      getMagicCards: getMagicCards

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

    function getWeissCardsBySet(setName) {
      return $http.get('WeissSchwarzDB.json').then(r => {
        return r.data.find(x => x.set == setName).cards;
      })
    }

    function getWeissCardSets() {
      return $http.get('WeissSchwarzDB.json').then(r => {
        return r.data.map(function (s) {
          return s.set;
        })
      })
    }

    function getMagicCards() {
      return $http.get('MagicTheGathering.json').then(r => {
        return r.data;
      })
        .catch(e => {
          return e;
        });
    }
  };

})();