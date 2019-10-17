(function () {
    angular.module("ProxyOh")
        .controller('WeissSchwarzController', WeissSchwarzController)
        WeissSchwarzController.$inject = ['$scope', "$cardService", "$modalService", "$utilService"];

    function WeissSchwarzController($scope, $cardService, $modalService, $utilService) {
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
        vm.getCounts = _getCounts;
        vm.deleteAll = _deleteAll;
        vm.filterFuzzy = _filterFuzzy;
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

        vm.tableView = false;
        vm.addImageLink = _addImageLink;
        vm.saveTestPage = _saveTestPage;
        vm.getSetByCard = _getSetByCard;

        vm.cardSizes = [
            {
                name: "Small (2.33 x 3.375in)",
                width: 2.33,
                height: 3.375
            }, {
                name: "Standard  (2.45 x 3.4375in)",
                width: 2.45,
                height: 3.4375
            }
        ];
        vm.selectedSize = {
            name: "Standard  (2.45 x 3.4375in)",
            width: 2.45,
            height: 3.4375
    };


        initialize();

        function initialize() {
            vm.$cardService.getWeissCardSets().then(function(data){vm.cardSets = data; })
            // var localQueue = localStorage.getItem("weissSchwarzQueue");
            // if (localQueue) {
            //     vm.queue = JSON.parse(localQueue);
            // }
        };
        
        function _getSetByCard(setName) {
            vm.$cardService.getWeissCardsBySet(setName).then(_onGetCardsSuccess)
        }

        function _onGetCardsSuccess(data) {
            vm.cardsFromSet = data;
        }
        function _addImageLink() {
            var imageArray = vm.imageLink.split("\n")
            
            for (var i = 0; i < imageArray.length; i++) {
                vm.$utilService.getDataUriOrCheckImage(imageArray[i].trim(), "url").then(function (url) {
                    var card = {
                        dateAdded: new Date().valueOf(),
                        imageUrl: url,
                        quantity: 1
                    }
                    vm.queue.unshift(card);
                    $scope.$digest();
                }, error => {
                })
            }
            //_saveLocalStorage();
            vm.imageLink = "";
        }

        function _addCardToQueue(item, model, label) {
            if (vm.queue.indexOf(item) == -1) {
                vm.queue.unshift(item);
                item.quantity = 1;
            }
            vm.value = "";
            //_saveLocalStorage();

        }
        function _reduceQuantity(card) {
            if (card.quantity == 1) {
                var index = vm.queue.indexOf(card)
                vm.queue.splice(index, 1);
                card.quantity = 0;
            }
            if (card.quantity > 1) {
                card.quantity--;
                //_saveLocalStorage();
            }
            console.log(vm.queue)
        }
        function _increaseQuantity(card) {
            if (!card.quantity) {
                card.quantity = 0;
            }
            card.quantity++;
            if (vm.queue.indexOf(card) < 0) {
                vm.queue.push(card);
            }
            console.log(vm.queue)
            _saveLocalStorage();
        }

        function _removeCard(item) {
            var index = vm.queue.indexOf(item);
            vm.queue.splice(index, 1);
            _saveLocalStorage();
        }

        async function _createPDF(selectedSize) {
            vm.loading = true;

            await vm.$utilService.convertCardsToPdf(selectedSize, vm.queue);

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

        function _saveLocalStorage() {
            localStorage.setItem("weissSchwarzQueue", JSON.stringify(vm.queue));
        }

        function _deleteAll() {
            vm.modalMarkup = {
                header: "Remove all stored card data",
                bodyLine1: "Are you sure you want to remove all cards?"
            }
            vm.$modalService.openModal(vm.modalMarkup, _deleteQueue());
        }

        function _deleteQueue() {
            return function () {
                vm.queue = [];
                // localStorage.setItem("weissSchwarzQueue", []);
                for (var i = 0; i < vm.cardsFromSet.length; i++) {
                    vm.cardsFromSet[i].quantity = 0;
                }
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

        function _saveTestPage() {
            vm.$utilService.saveTestPrintPdf(vm.selectedSize);
        }

    }

})();
