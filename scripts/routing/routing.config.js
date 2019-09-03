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
        });
    });
})();