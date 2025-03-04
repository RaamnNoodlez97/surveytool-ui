sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("mta.MTA1.controller.MainView", {
            onInit: function () {
                var oModel = this.getView().getModel("sfData");
                // this.getView().setModel(oModel, "sfData");
  
                // console.log('in main view controller, sfData (principal propagation) oModel: ' + oModel);
              },
              // onShowHelloWorld: function() {
              //   var oRouter = this.getOwnerComponent().getRouter();
              //   oRouter.navTo("helloworld");
              // },
              // onShowSFPrincipalPropagation: function() {
              //   var oRouter = this.getOwnerComponent().getRouter();
              //   oRouter.navTo("sf");
              // },
              // onShowSFapi: function() {
              //   var oRouter = this.getOwnerComponent().getRouter();
              //   oRouter.navTo("sfapi");
              // }
              onNavigateToContent: function (oEvent) {
                var oButton = oEvent.getSource();
                var sContentKey = oButton.getCustomData()[0].getValue(); // Get value from CustomData
    
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("contentView", { contentType: sContentKey });
            }
 
        });
    }
);