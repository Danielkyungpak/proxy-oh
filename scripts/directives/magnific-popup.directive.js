"use strict";

angular.module("ProxyOh").directive('magnificPopup', magnificPopup);

function magnificPopup() {
    return {
        restrict: 'A',
        scope: {},
        link: function ($scope, element, attr) {
            $(element).magnificPopup({
                delegate: '.image',
                type: 'image',
                gallery: {
                    enabled: true
                }
            })
        }
    }
};
