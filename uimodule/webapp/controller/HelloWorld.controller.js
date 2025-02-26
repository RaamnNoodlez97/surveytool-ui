sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
      "use strict";

      return Controller.extend("mta.MTA1.controller.HelloWorld", {
          onInit: function () {
              console.log('in hello world view controller');
            }
          ,
          onGoBack: function() {
              var oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("RouteMainView");
          }
      });
  }
);
