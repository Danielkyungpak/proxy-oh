(function () {
  angular.module("ProxyOh")
    .controller('MainController', MainController)
  MainController.$inject = ['$scope', 'ApiService'];

  function MainController(
    $scope,
    ApiService) {
    var vm = this;
    vm.$scope = $scope;


    initialize();
    dataTest();

    function initialize() {
      console.log("hello")
    };


    function dataTest() {
      var data = ApiService.get();
    }

    vm.matches = [{ id: 1, name: "daniel" }, { id: 2, name: "jeffrey" }]

  }

})();
