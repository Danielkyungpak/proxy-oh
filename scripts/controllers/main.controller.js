(function () {
    angular.module("ProxyOh")
        .controller('MainController', MainController)
    MainController.$inject = ['$scope'];

    function MainController($scope) {
        var vm = this;
        vm.$scope = $scope;
        vm.cards = [{ id: 1, name: "daniel" }, { id: 2, name: "jeffrey" }]
        vm.queue = [];

        vm.addCardToQueue = _addCardToQueue;
        vm.removeCard = _removeCard;

        initialize();

        function initialize() {
            console.log("hello")
        };

        function _addCardToQueue(item, model, label) {
            if (vm.queue.indexOf(item) == -1) {
                vm.queue.push(item);
            }
            vm.value = "";
            console.log(vm.queue)
        }

        function _removeCard(item) {
            var index = vm.queue.indexOf(item);
            vm.queue.splice(index, 1);
        }


    }

})();
