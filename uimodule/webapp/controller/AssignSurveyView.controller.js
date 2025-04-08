sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast"
], function(Controller, JSONModel, History, MessageToast) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.AssignSurveyView", {

        onInit: function () {
            // Define default structure for the form

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

            // Create and bind JSON model to the view
            var oAssignSurveyModel = new JSONModel(oFormData);
            this.getView().setModel(oAssignSurveyModel, "assignSurveyModel");
        }

    });
});