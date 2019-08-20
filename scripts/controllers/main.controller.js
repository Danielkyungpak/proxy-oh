(function () {
    angular.module("ProxyOh")
        .controller('MainController', MainController)
    MainController.$inject = ['$scope', "$yugiohCardService"];

    function MainController($scope, $yugiohCardService) {
        var vm = this;
        vm.$scope = $scope;
        vm.$yugiohCardService = $yugiohCardService;
        vm.cards = [{ id: 1, name: "daniel" }, { id: 2, name: "jeffrey" }]
        vm.queue = [];

        vm.addCardToQueue = _addCardToQueue;
        vm.removeCard = _removeCard;
        vm.startsWith = _startsWith;

        initialize();

        function initialize() {
            vm.$yugiohCardService.get().then(_onGetCardsSuccess);
        };

        function _onGetCardsSuccess(data) {
            vm.cards = data;
            console.log(data)
        }
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

        function _startsWith(card, viewValue) {
            return card.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
        }


    }

})();
