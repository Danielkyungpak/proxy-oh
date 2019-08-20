(function () {
    angular.module("ProxyOh")
        .controller('MainController', MainController)
    MainController.$inject = ['$scope'];

    function MainController($scope) {
        var vm = this;
        vm.$scope = $scope;


        initialize();

        function initialize() {
            console.log("hello")
        };

        vm.matches = [{id: 1, name: "daniel"}, {id:2, name: "jeffrey"}]

    }

})();
