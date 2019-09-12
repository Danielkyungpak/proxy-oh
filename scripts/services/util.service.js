(function () {
    'use strict';

    angular
        .module('ProxyOh')
        .factory('$utilService', utilService);

    function utilService($http) {

        return {
            saveTestPrintPdf: saveTestPrintPdf,
            convertCardsToPdf: convertCardsToPdf,
            getDataUriOrCheckImage: getDataUriOrCheckImage
        };

        function saveTestPrintPdf(selectedSize) {
            var inchToPixelMultiplier = 72;

            var cardWidth = selectedSize.width;
            var cardHeight = selectedSize.height;

            var doc = new jsPDF('p', 'pt', 'letter');
            var docWidth = doc.internal.pageSize.width;
            var docHeight = doc.internal.pageSize.height;

            var cardWidthInPixels = cardWidth * inchToPixelMultiplier;
            var cardHeightInPixels = cardHeight * inchToPixelMultiplier;

            var numberOfCardsFitHorizontally = Math.floor(docWidth / cardWidthInPixels);
            var numberOfCardsFitVertically = Math.floor(docHeight / cardHeightInPixels);

            var xMargin = ((docWidth - (cardWidthInPixels * numberOfCardsFitHorizontally)) / 2)
            var yMargin = ((docHeight - (cardHeightInPixels * numberOfCardsFitVertically)) / 2)

            doc.rect(xMargin, yMargin, (cardWidthInPixels * numberOfCardsFitHorizontally), (cardHeightInPixels * numberOfCardsFitVertically));
            
            //Sample Credit Card Size
            doc.rect(xMargin *2, yMargin *2, (3.375 * inchToPixelMultiplier), (2.25 * inchToPixelMultiplier));
            doc.save("test.pdf")
        };

        function getDataUriOrCheckImage(url, type) {
            return new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                    canvas.getContext('2d').drawImage(this, 0, 0);
                    var dataURI = canvas.toDataURL('image/png');
                    // on success
                    if (type == "url") {
                        resolve(url);
                    }
                    else {
                        resolve(dataURI);
                    }
                };

                image.onerror = function () {
                    // on failure
                    reject('Error Loading Image');
                }

                image.setAttribute('crossOrigin', 'anonymous')
                image.src = url;
            })
        }


        async function convertCardsToPdf(selectedSize, queue) {
            var cardWidth = selectedSize.width;
            var cardHeight = selectedSize.height;
            var measureFormat = "inch";

            var cards = [];
            if (queue.length == 0) {
                return;
            }
            for (var a = 0; a < queue.length; a++) {
                var promise = getDataUriOrCheckImage(queue[a].imageUrl).then((imgData) => {
                    queue[a].dataUri = imgData;
                });
                await promise;
                for (var b = 0; b < queue[a].quantity; b++) {
                    cards.push(queue[a]);
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
            var xMargin = ((docWidth - (cardWidthInPixels * numberOfCardsFitHorizontally)) / 2)
            var yMargin = ((docHeight - (cardHeightInPixels * numberOfCardsFitVertically)) / 2)

            cardLoop:
            for (var l = 0; l < cardCount + 1; l++) {
                for (var k = 0; k < pages; k++) {
                    for (var i = 0; i < numberOfCardsFitVertically; i++) {
                        for (var j = 0; j < numberOfCardsFitHorizontally; j++) {
                            //Card Array Version
                            //doc.addImage(cardArray[l], 'JPEG', (xMargin + (cardWidthInPixels * j)), (yMargin + (cardHeightInPixels * i)), cardWidthInPixels, cardHeightInPixels, "")

                            doc.addImage(cards[cardCount].dataUri, 'JPEG', (xMargin + (cardWidthInPixels * j)), (yMargin + (cardHeightInPixels * i)), cardWidthInPixels, cardHeightInPixels, "")
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
    };

})();
