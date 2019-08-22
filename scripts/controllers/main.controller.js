(function () {
    angular.module("ProxyOh")
        .controller('MainController', MainController)
    MainController.$inject = ['$scope', "$cardServices"];

    function MainController($scope, $cardServices) {
        var vm = this;
        vm.$scope = $scope;
        vm.$cardServices = $cardServices;
        vm.cards = [{ id: 1, name: "daniel" }, { id: 2, name: "jeffrey" }]
        vm.queue = [];

        vm.addCardToQueue = _addCardToQueue;
        vm.removeCard = _removeCard;
        vm.createPDF = _createPDF;
        vm.reduceQuantity = _reduceQuantity;
        vm.increaseQuantity = _increaseQuantity;

        vm.tableView = false;

        vm.database = firebase.database();
        vm.writeFirebaseExample = _writeFirebaseExample;
        vm.readFirebaseExample = _readFirebaseExample;

        initialize();

        function initialize() {
            vm.$cardServices.get().then(_onGetCardsSuccess);
        };

        function _onGetCardsSuccess(data) {
            vm.cards = data;
        }

        function _addCardToQueue(item, model, label) {
            if (vm.queue.indexOf(item) == -1) {
                vm.queue.unshift(item);
                item.quantity = 1;
            }
            vm.value = "";

        }
        function _reduceQuantity(card) {
            if (card.quantity > 1) {
                card.quantity--;
            }
        }
        function _increaseQuantity(card) {
            if (card.quantity < 3) {
                card.quantity++;
            }
        }

        function _removeCard(item) {
            var index = vm.queue.indexOf(item);
            vm.queue.splice(index, 1);
        }

        function _getDataUri(url) {
            return new Promise(function (resolve, reject) {

                var image = new Image();

                image.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                    canvas.getContext('2d').drawImage(this, 0, 0);
                    var dataURI = canvas.toDataURL('image/png');
                    // on success
                    resolve(dataURI);
                };

                image.onerror = function () {
                    // on failure
                    reject('Error Loading Image');
                }

                image.setAttribute('crossOrigin', 'anonymous')
                image.src = url;
            })
        }


        async function _createPDF() {
            var cardWidth = 2.33;
            var cardHeight = 3.375;
            var measureFormat = "inch";

            var cards = [];
            if (vm.queue.length == 0) {
                return;
            }
            for (var a = 0; a < vm.queue.length; a++) {
                var promise = _getDataUri(vm.queue[a].card_images[0].image_url).then((imgData) => {
                    vm.queue[a].dataUri = imgData;
                });
                await promise;
                for (var b = 0; b < vm.queue[a].quantity; b++) {
                    cards.push(vm.queue[a]);
                }
            }


            var numberOfCards = cards.length;

            var doc = new jsPDF('p', 'pt', 'letter');
            var docWidth = doc.internal.pageSize.width;
            var docHeight = doc.internal.pageSize.height;

            //Logic for card size
            var inchToPixelMultiplier = 72;
            var cmToPixelMultilier = 182.88;
            var cardWidthInPixels = 1;
            var cardHeightInPixels = 1;

            if (measureFormat == "inch") {
                cardWidthInPixels = cardWidth * inchToPixelMultiplier;
                cardHeightInPixels = cardHeight * inchToPixelMultiplier;
            } else if (measureFormat == "cm") {
                cardWidthInPixels = cardWidth * cmToPixelMultilier;
                cardHeightInPixels = cardHeight * cmToPixelMultilier;
            }

            var numberOfCardsFitHorizontally = Math.floor(docWidth / cardWidthInPixels);
            var numberOfCardsFitVertically = Math.floor(docHeight / cardHeightInPixels);

            var numberOfCardsPerPage = (numberOfCardsFitHorizontally * numberOfCardsFitVertically);

            var pages = 1;
            pages = Math.ceil(numberOfCards / numberOfCardsPerPage);


            var cardCount = 0;
            var xBorders = ((docWidth - (cardWidthInPixels * numberOfCardsFitHorizontally)) / 2)
            var yBorders = ((docHeight - (cardHeightInPixels * numberOfCardsFitVertically)) / 2)

            cardLoop:
            for (l = 0; l < cardCount + 1; l++) {
                for (k = 0; k < pages; k++) {
                    for (var i = 0; i < numberOfCardsFitVertically; i++) {
                        for (var j = 0; j < numberOfCardsFitHorizontally; j++) {
                            //Card Array Version
                            //doc.addImage(cardArray[l], 'JPEG', (xBorders + (cardWidthInPixels * j)), (yBorders + (cardHeightInPixels * i)), cardWidthInPixels, cardHeightInPixels, "")

                            doc.addImage(cards[cardCount].dataUri, 'JPEG', (xBorders + (cardWidthInPixels * j)), (yBorders + (cardHeightInPixels * i)), cardWidthInPixels, cardHeightInPixels, "")
                            cardCount++;
                            if (cardCount == numberOfCards) {
                                break cardLoop;
                            }
                        }
                    }
                    if (k < (pages - 1)) {
                        doc.addPage();
                    }

                }

            }

            doc.save('proxy.pdf');
        }

        function _writeFirebaseExample() {
            var boop = 'boop';
            //post
            vm.database.ref('decklist/' + boop).push({
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

        function _readFirebaseExample() {
            //read once
            vm.database.ref('/decklist').once('value').then(function (snapshot) {
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
