(function () {
    "use strict";

    angular.module("ProxyOh")
        .component("modal", {
            controller: "BaseModalController",
            controllerAs: "modal",
            bindings: {
                modalMarkup: '<',
                confirmFunction: '&',
                dismissFunction: '&',
                closeFunction: '&'
            },
            templateUrl: "scripts/components/modal/modal.component.html"
        })

})();