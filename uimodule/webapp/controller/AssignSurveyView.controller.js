sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast"
], function(Controller, JSONModel, History, MessageToast) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.AssignSurveyView", {

        onInit: function () {
            var oFormData = {
                users: "",
                surveyId: "",
                completedRespondents: "",
                unfinishedRespondents: "",
                targetOrgDataType: "Business Unit",
                targetOrgCode: "",
                UnitOfMeasure: "Percentage", // default
                Quantity: "",
                Frequency: "Once_Off", // default
                startDate: new Date().toISOString().split(".")[0] + "Z",
                endDate: ""
            };

            var oComponentVariables = {
                isOrgTypeSelected: true,
                isUserTypeSelected: false
            }

            var oAssignSurveyModel = new JSONModel(oFormData);
            this.getView().setModel(oAssignSurveyModel, "assignSurveyModel");

            var oComponentVariablesModel = new JSONModel(oComponentVariables);
            this.getView().setModel(oComponentVariablesModel, "componentVariables");
        },

        onOrgTypeSelect: function(oEvent) {
            var oView = this.getView();
            var selectedKey = oView.getModel("assignSurveyModel").getProperty("/targetOrgDataType");
            console.log(selectedKey);

            // Update the model's property for org type selected
            var bIsOrgTypeSelected = selectedKey !== "Select Specific Individuals";
            var bIsUserTypeSelected = selectedKey == "Select Specific Individuals";

            oView.getModel("componentVariables").setProperty("/isOrgTypeSelected", bIsOrgTypeSelected);
            oView.getModel("componentVariables").setProperty("/isUserTypeSelected", bIsUserTypeSelected);

            // this.getView().byId("orgCodeLabel").setVisible(this.isOrgTypeSelected);
            // this.getView().byId("orgCodeInput").setVisible(this.isOrgTypeSelected);
        },

        onAssignSurvey() {
            var oView = this.getView();
            var oFormData = oView.getModel("assignSurveyModel").getData();

            console.log(oFormData);

            // $.ajax({
            //     url: "/assignForm",
            //     type: "POST",
            //     contentType: "application/json",
            //     data: JSON.stringify(oFormData),
            //     success: function (response) {
            //         sap.m.MessageToast.show("Survey assigned successfully!");
            //         console.log("Response:", response);
            //     },
            //     error: function (xhr, status, error) {
            //         sap.m.MessageBox.error("Failed to assign survey. Please try again.");
            //         console.error("Error:", error);
            //     }
            // });
        },

        onNavBack() {
			const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("mainView", {}, true);
			}
		}
    });
});