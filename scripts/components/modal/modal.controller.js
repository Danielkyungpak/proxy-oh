(function () {
    'use strict';

    angular.module("ProxyOh")
        .controller('BaseModalController', BaseModalController);

    function BaseModalController($scope) {
        var vm = this;

        vm.$scope = $scope;

        render();

        vm.confirm = _confirm;
        vm.cancel = _cancel;

        function render() {
        }

        function _confirm() {
            vm.confirmFunction();
            vm.closeFunction();
        }

        function _cancel() {
            vm.dismissFunction();
        }
    }
})();