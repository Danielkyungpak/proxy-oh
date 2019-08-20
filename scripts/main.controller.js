(function () {
    angular.module("ProxyOh")
        .controller('MainController', CharacterContMainControllerroller)
    MainController.$inject = ['$scope'];

    function CharacterController($scope, $characterService) {
        var vm = this;
        vm.$scope = $scope;


        intialize();

        function intialize() {

        };
    }

})();
