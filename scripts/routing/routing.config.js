(function () {
    angular.module("ProxyOh").config(function ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) {
        $locationProvider.hashPrefix('');
        $urlMatcherFactoryProvider.strictMode(false);
        $stateProvider.state({
            name: 'home',
            url: '',
            templateUrl: 'scripts/app/yugioh/yugioh.html',
            controller: 'YugiohController',
            controllerAs: 'yc'
        }),
        $stateProvider.state({
            name: 'pokemon',
            url: '/pokemon',
            templateUrl: 'scripts/app/pokemon/pokemon.html',
            controller: "PokemonController",
            controllerAs: 'pc'
        }),
        $stateProvider.state({
            name: 'trading-card-game',
            url: '/trading-card-game',
            templateUrl: 'scripts/app/trading-card-game/trading-card-game.html',
            controller: "TradingCardGameController",
            controllerAs: 'tcgc'
        });
        $stateProvider.state({
            name: 'weiss-schwarz',
            url: '/weiss-schwarz',
            templateUrl: 'scripts/app/weiss-schwarz/weiss-schwarz.html',
            controller: "WeissSchwarzController",
            controllerAs: 'wsc'
        });
        $stateProvider.state({
            name: 'magic-the-gathering',
            url: '/magic-the-gathering',
            templateUrl: 'scripts/app/magic-the-gathering/magic-the-gathering.html',
            controller: "MagicTheGatheringController",
            controllerAs: 'mtgc'
        });


    });
})();