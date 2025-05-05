sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("zuipdf.controller.DocApp", {
        onInit: function() {
          this.getView().getModel("App").setData({
          });
        }
       
      });
    });