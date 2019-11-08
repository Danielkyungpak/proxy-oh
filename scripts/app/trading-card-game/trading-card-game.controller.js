(function () {
    angular.module("ProxyOh")
        .controller('TradingCardGameController', TradingCardGameController)
    TradingCardGameController.$inject = ['$scope', "$cardService", "$modalService", "$utilService"];

    function TradingCardGameController($scope, $cardService, $modalService, $utilService) {
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
            name: "Small (2.33 x 3.375in)",
            width: 2.33,
            height: 3.375
        };


        initialize();

        function initialize() {
            var localQueue = localStorage.getItem("tcgCurrentQueue");
            if (localQueue) {
                vm.queue = JSON.parse(localQueue);
            }
        };

        function _addImageLink() {
            var imageArray = vm.imageLink.split("\n")
            
            for (var i = 0; i < imageArray.length; i++) {
                vm.$utilService.getDataUriOrCheckImage(imageArray[i].trim(), "url", true).then(function (url) {
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
            _saveLocalStorage();
            vm.imageLink = "";
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
            card.quantity++;
            _saveLocalStorage();
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

        function _saveLocalStorage() {
            localStorage.setItem("tcgCurrentQueue", JSON.stringify(vm.queue));
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
                localStorage.setItem("tcgCurrentQueue", []);;
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
