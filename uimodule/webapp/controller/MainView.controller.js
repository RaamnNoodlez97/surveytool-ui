sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("mta.MTA1.controller.MainView", {
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("surveyData");

                if (oModel) {
                    // Retrieve and log the model data
                    var oData = oModel.getData();
                    console.log("surveyInfo model content: ", oData);
                } else {
                    console.error("surveyInfo model is not available!");
                }
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
            },

            onNavigateToCreateSurvey: function (oEvent) {
                var oButton = oEvent.getSource();
                var sContentKey = oButton.getCustomData()[0].getValue(); // Get value from CustomData
    
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("createSurvey", { contentType: sContentKey });
            }
 
        });
    }
);