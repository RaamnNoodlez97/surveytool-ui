sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
      "use strict";

      return Controller.extend("mta.MTA1.controller.SFApi", {
          onInit: function () {
              console.log('in sfapi controller');
            },
            onGoBack: function() {
              var oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("RouteMainView");
          }
      });
  }
);
