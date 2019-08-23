(function () {
    'use strict';

    angular.module("ProxyOh")
        .factory('$modalService', ModalService);


    function ModalService($uibModal) {

        var service = {
            openModal: openModal
        };

        return service;

        function openModal(modelMarkup, confirmFunction) {
            $uibModal.open({
                animation: true,
                template: '<modal modal-markup="uib.modalMarkup" confirm-function="uib.confirmFunction()" dismiss-function="$dismiss()" close-function="$close()"></modal>',
                controller: ['modalMarkup', 'confirmFunction', function (modalMarkup, confirmFunction) {
                    var vm = this;
                    vm.modalMarkup = modalMarkup;
                    vm.confirmFunction = confirmFunction;
                }],
                controllerAs: 'uib',
                resolve: {
                    modalMarkup: function () {
                        return modelMarkup;
                    },
                    confirmFunction: function () {
                        return confirmFunction;

                    },
                }
            }).result.then(function () {
                //after close function fires here
            }, function () {
                //after dismiss function
            });

        }
    }
})();