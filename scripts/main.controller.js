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

        $scope.matches = [
            "1", "2", "3"
        ]

    }

})();
