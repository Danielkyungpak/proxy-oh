(function () {
    'use strict';

    angular
        .module('ProxyOh')
        .factory('$fireBaseService', fireBaseService);

    function fireBaseService() {
        var vm = this;
        var database = firebase.database();
        return {
            writeFirebaseExample: writeFirebaseExample,
            readFirebaseExample: readFirebaseExample
        };

        

        function writeFirebaseExample() {
            var boop = 'boop';
            //post
            database.ref('decklist/' + boop).push({
                card1: 'bleh',
                card2: 'bleh2',
                card3: 'bleh3'
            });

            //update
            // vm.database.ref('decklist/').update({
            //     boop: 'boop'
            // });

            //delete
            // vm.database.ref('decklist/' + boop).remove();
        }

        function readFirebaseExample() {
            //read once
            database.ref('/decklist').once('value').then(function (snapshot) {
                console.log(snapshot.val());
            });

            //realtime changes
            // vm.database.ref('/decklist').on('value', function (response) {
            //     console.log(response.val());
            // });
            //turn off realtime changes callback
            // vm.database.ref('/decklist').off();
        }
    }
})();