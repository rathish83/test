sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("zuipdf.controller.App", {
        onInit: function() {
          const oSideNavigation = this.byId("sideNavigation");
          this.getView().byId("app").setSideExpanded(false);
          oSideNavigation.setExpanded(false); // Force the side navigation to start collapsed
        },
        onNavigation: function (oEvent) {
          const oSelectedItem = oEvent.getParameter("item");
          const sKey = oSelectedItem.getKey();
          const oRouter = this.getOwnerComponent().getRouter();
    
          if (sKey) {
            oRouter.navTo(sKey);
          }
        }
      });
    });
  