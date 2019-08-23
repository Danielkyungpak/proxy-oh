angular.module("ProxyOh").directive("limitToBetween", function () {
  return {
    link: function (scope, element, attributes) {
      element.on("keydown keyup", function (e) {
        if ((Number(element.val()) > Number(attributes.max) ||
          Number(element.val()) < Number(attributes.min)) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          if (element.val() > Number(attributes.max)) {
            element.val(3);
          }
          else if (element.val() < Number(attributes.min)){
            element.val(1);
          }
        }
      });
    }
  };
});