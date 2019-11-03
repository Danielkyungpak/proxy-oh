(function () {
    angular.module("ProxyOh")
        .controller('MagicTheGatheringController', MagicTheGatheringController)
    MagicTheGatheringController.$inject = ['$scope', "$cardService", "$modalService", "$utilService"];

    function MagicTheGatheringController($scope, $cardService, $modalService, $utilService) {
        var vm = this;
        vm.$scope = $scope;
        vm.$cardService = $cardService;
        vm.$modalService = $modalService;
        vm.$utilService = $utilService;
        vm.cards = [];
        vm.queue = [];

        vm.addCardToQueue = _addCardToQueue;
        vm.removeCard = _removeCard;
        vm.createPDF = _createPDF;
        vm.reduceQuantity = _reduceQuantity;
        vm.increaseQuantity = _increaseQuantity;
        vm.parseCardList = _parseCardList;
        vm.getCounts = _getCounts;
        vm.deleteAll = _deleteAll;
        vm.filterFuzzy = _filterFuzzy;
        vm.removeNotFoundCard = _removeNotFoundCard;
        vm.resolveConflict = _resolveConflict;
        vm.saveLocalStorage = _saveLocalStorage;

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
        vm.selectedSize = {
            name: "Standard  (2.45 x 3.4375in)",
            width: 2.45,
            height: 3.4375
        };

        vm.tableView = false;
        vm.saveTestPage = _saveTestPage;

        initialize();

        function initialize() {
            var localQueue = localStorage.getItem("magicCurrentQueue");
            if (localQueue) {
                vm.queue = JSON.parse(localQueue);
            }

            var importCardList = localStorage.getItem("magicImportCardList");
            if (importCardList != "undefined") {
                vm.importString = JSON.parse(importCardList);
            }
            vm.$cardService.getMagicCards().then(_onGetCardsSuccess);

        };

        function _onGetCardsSuccess(data) {
            vm.cards = data;
            // //Filter out list for new db cards
            // var cards = [];
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i].set_name == "Amonkhet Invocations") {
            //         continue;
            //     }
            //     if (data[i].lang != "en") {
            //         continue
            //     }
            //     if (cards.findIndex(x => x.name == data[i].name) < 0) {
            //         cards.push(data[i])
            //     }
            // }
            // vm.cards = cards;
            // console.log(vm.cards)
        }

        function _addCardToQueue(item, model, label) {
            if (vm.queue.indexOf(item) == -1) {
                vm.queue.unshift(item);
                item.quantity = 1;
                item.imageUrl = item.image_uris.large;
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
            // if (card.quantity < 3) {
            card.quantity++;
            _saveLocalStorage();
            // }
        }

        function _removeCard(item) {
            var index = vm.queue.indexOf(item);
            vm.queue.splice(index, 1);
            _saveLocalStorage();
        }

        async function _createPDF(selectedSize) {
            vm.loading = true;

            await vm.$utilService.convertCardsToPdf(selectedSize, vm.queue, true);

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
            if (vm.importString.length == 0) {
                return;
            }

            vm.notFoundCards = [];
            var cardArray = vm.importString.split("\n")
            var foundCards = [];
            var notFound = [];
            var quantity = 1;
            for (var i = 0; i < cardArray.length; i++) {
                if (!cardArray[i]) {
                    continue;
                }
                //Finding Quantity
                if (cardArray[i][1] != "x" && cardArray[i][2] != "x") {
                    var spaceIndex = cardArray[i].indexOf(" ")
                    quantity = parseInt(cardArray[i][spaceIndex - 1]);
                }
                else {
                    var timesIndex = cardArray[i].indexOf("x")
                    quantity = parseInt(cardArray[i][timesIndex - 1]);
                }

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
                var obj = vm.cards.find(x => x.name.toLowerCase() == cardName.toLowerCase());
                if (obj) {
                    obj.quantity = quantity;
                    obj.imageUrl = obj.image_uris.large;
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

            for (var o = 0; o < foundCards.length; o++) {
                for (var p = 0; p < vm.queue.legnth; p++) {
                    if (foundCards[o].id == vm.queue[p].id) {
                        vm.queue[p].quantity = vm.queue[p].quantity + foundCards[o].quantity;
                    }
                }
            }

            for (var u = 0; u < foundCards.length; u++) {
                if (!vm.queue.find(x => x.id == foundCards[u].id)) {
                    vm.queue.unshift(foundCards[u]);
                }
            }

            vm.notFoundCards = notFound;
            _saveLocalStorage();
        }

        function _resolveConflict(result, card) {
            result.quantity = card.quantity;
            result.imageUrl = result.image_uris.large;
            vm.queue.unshift(result);
            _saveLocalStorage();
            _removeNotFoundCard(card);
        }

        function _saveLocalStorage() {
            localStorage.setItem("magicCurrentQueue", JSON.stringify(vm.queue));
            localStorage.setItem("magicImportCardList", JSON.stringify(vm.importString));
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
                localStorage.setItem("magicCurrentQueue", []);;
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
            return fuse.search(searchValue);

        }

        function _removeNotFoundCard(card) {
            vm.notFoundCards.splice(vm.notFoundCards.indexOf(card), 1);
        }

        function _saveTestPage() {
            vm.$utilService.saveTestPrintPdf(vm.selectedSize);
        }

    }

})();
