(function () {
    angular.module("ProxyOh")
        .controller('MainController', MainController)
    MainController.$inject = ['$scope', "$cardService", "$modalService"];

    function MainController($scope, $cardService, $modalService) {
        var vm = this;
        vm.$scope = $scope;
        vm.$cardService = $cardService;
        vm.$modalService = $modalService;
        vm.cards = [{ id: 1, name: "daniel" }, { id: 2, name: "jeffrey" }]
        vm.queue = [];

        vm.addCardToQueue = _addCardToQueue;
        vm.removeCard = _removeCard;
        vm.createPDF = _createPDF;
        vm.reduceQuantity = _reduceQuantity;
        vm.increaseQuantity = _increaseQuantity;
        vm.parseCardList = _parseCardList;
        vm.resolveCard = _resolveCard;
        vm.getCounts = _getCounts;
        vm.imagePopOut = _imagePopOut;
        vm.deleteAll = _deleteAll;
        vm.filterFuzzy = _filterFuzzy;

        vm.fuzzySearchOptions = {
            shouldSort: true,
            threshold: 0.2,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name"
            ]
        };

        vm.tableView = false;

        initialize();

        function initialize() {
            var localQueue = localStorage.getItem("currentQueue");
            if (localQueue) {
                vm.queue = JSON.parse(localQueue);
            }
            vm.$cardService.get().then(_onGetCardsSuccess);
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
            _saveLocalStorage();

        }
        function _reduceQuantity(card) {
            if (card.quantity > 1) {
                card.quantity--;
                _saveLocalStorage();
            }
        }
        function _increaseQuantity(card) {
            if (card.quantity < 3) {
                card.quantity++;
                _saveLocalStorage();
            }
        }

        function _removeCard(item) {
            var index = vm.queue.indexOf(item);
            vm.queue.splice(index, 1);
            _saveLocalStorage();
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
            vm.loading = true;

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
            vm.loading = false;
            $scope.$digest();
        }

        function _getCounts() {
            var count = 0;
            for (var i = 0; i < vm.queue.length; i++) {
                count++;
                if (vm.queue[i].quantity > 1) {
                    count = count + (vm.queue[i].quantity - 1)
                }
            }
            return count;
        }

        function _parseCardList() {
            if (importString.length == 0) {
                return;
            }

            vm.notFoundCards = [];
            var cardArray = vm.importString.split("\n")
            var foundCards = [];
            var notFound = [];
            for (var i = 0; i < cardArray.length; i++) {
                //Finding Quantity
                var timesIndex = cardArray[i].indexOf("x")
                var quantity = parseInt(cardArray[i][timesIndex - 1]);

                //Removing Count from String and joining string back together
                var stringArray = "";
                stringArray = cardArray[i].split(" ");
                stringArray.shift();

                for (var j = 0; j < stringArray.length; j++) {
                    if (stringArray.length == 0) {
                        stringArray.splice(j, 1);
                    }
                }
                cardName = stringArray.join(" ");

                //Find Card, if found, add to foundCard array, if not add to notFound for other processing
                var obj = vm.cards.find(x => x.name == cardName);
                if (obj) {
                    obj.quantity = quantity;
                    foundCards.push(obj);
                } else {
                    if (cardName.trim().length != 0) {
                        notFound.push({
                            name: cardName,
                            quantity: quantity
                        })
                    }
                }

            }

            if (notFound.length > 0) {
                var fuse = new Fuse(vm.cards, vm.fuzzySearchOptions);

                for (var k = 0; k < notFound.length; k++) {
                    var result = fuse.search(notFound[k].name);
                    notFound[k].results = result;
                }

            }
            vm.queue = foundCards;
            vm.notFoundCards = notFound;
            _saveLocalStorage();
        }

        function _resolveCard(result) {
            console.log(result);
        }

        function _imagePopOut($event) {
            var image = $event.currentTarget;
            console.log(image)
            image.magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
                image: {
                    verticalFit: true
                },
                zoom: {
                    enabled: true,
                    duration: 300 // don't foget to change the duration also in CSS
                }
            });


        }

        function _saveLocalStorage() {
            localStorage.setItem("currentQueue", JSON.stringify(vm.queue));
        }

        function _deleteAll() {
            vm.modalMarkup = {
                header: "Remove all stored card data",
                bodyLine1: "Are you sure you want to remove all cards?"
            }
            vm.$modalService.openModal(vm.modalMarkup, _deleteQueue());
        }

        function _deleteQueue(contact) {
            return function () {
                vm.queue = [];
                localStorage.clear();
            }
        }

        function _filterFuzzy(searchValue) {

            var strictFuzzySearchOptions = {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "name"
                ]
            };

            var fuse = new Fuse(vm.cards, strictFuzzySearchOptions);
            console.log(searchValue)
            console.log(fuse.search(searchValue))
            return fuse.search(searchValue);
        }

    }

})();
