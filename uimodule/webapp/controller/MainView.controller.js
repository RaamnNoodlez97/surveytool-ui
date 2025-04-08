sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
 
        return Controller.extend("mta.MTA1.controller.MainView", {
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("surveyDataTest");

                if (oModel) {
                    // Retrieve and log the model data
                    var oData = oModel.getData();
                    console.log("surveyInfo model content: ", oData);
                } else {
                    console.error("surveyInfo model is not available!");
                }
              },
              
            onNavigateToContent: function (oEvent) {
                var oButton = oEvent.getSource();
                var sContentKey = oButton.getCustomData()[0].getValue();
    
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("contentView", { contentType: sContentKey });
            },

            onNavigateToCreateSurvey: function (oEvent) {
                var oButton = oEvent.getSource();
                var sContentKey = oButton.getCustomData()[0].getValue();
    
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("createSurvey", { contentType: sContentKey });
            },

            onNavigateToAssignSurvey: function (oEvent) {
                var oButton = oEvent.getSource();
                var sContentKey = oButton.getCustomData()[0].getValue();

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("assignSurvey", { contentType: sContentKey })
            },

            onTest: function(oEvent) {
                const sInputValue = this.getView().byId("testInput").getValue();
                
                try {
                    const oPayload = typeof sInputValue === 'string' 
                        ? JSON.parse(sInputValue) 
                        : sInputValue;
                    this.submitTestPayload(oPayload);
                } catch (e) {
                    MessageToast.show("Invalid JSON format");
                    console.error("JSON parse error:", e);
                }
            },

            submitTestPayload: function(oPayload) {
                fetch("/api/submitResponse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(oPayload)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    MessageToast.show("Test successful!");
                    console.log("API response:", data);
                })
                .catch(error => {
                    MessageToast.show("Test failed");
                    console.error("API error:", error);
                });
            }
 
        });
    }
);