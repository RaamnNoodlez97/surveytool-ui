sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/WizardStep",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/Select",
    "sap/m/ComboBox",
    "sap/m/RadioButton",
    "sap/m/RadioButtonGroup",
    "sap/m/Toolbar",
    "sap/m/Title",
    "sap/ui/core/routing/History",
], function(Controller, JSONModel, WizardStep, VBox, Label, Input, Button, Select, ComboBox, RadioButton, RadioButtonGroup, Toolbar, Title, History) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.CreateSurveyView", {

        sectionQuestionCount: {},  

        onInit: function () {
            let oSurveyModel = new JSONModel({
                surveyHeader: {
                    surveyName: "",
                    surveyDescription: "",
                    surveyStatus: "Draft"
                },
                surveySections: []
            });

            this.getView().setModel(oSurveyModel, "surveyData");
        },


        onSurveyNameChange: function(oEvent) {
            let sValue = oEvent.getParameter("value").trim();  
            let oAddSectionButton = this.getView().byId("addSectionButton");

            oAddSectionButton.setEnabled(sValue.length > 0);
        },

        formatSectionTitle: function(oContext) {
            var aItems = this.getView().getModel("surveyData").getProperty("/surveySections");
            var iIndex = aItems.indexOf(oContext);
            
            return "Section " + (iIndex + 1);
        },


        onAddSection: function() {
            let oWizard = this.getView().byId("surveyDraftWizard");
            
            if (!oWizard.getVisible()) {
                oWizard.setVisible(true);
            }

            let oSurveyModel = this.getView().getModel("surveyData");
            let aSections = oSurveyModel.getProperty("/surveySections");

            aSections.push({
                sectionName: "",
                sectionDescription: "",
                sectionLikertScaleType: "",
                sectionQuestions: []
            });

            oSurveyModel.refresh();
        },


        onRemoveSection: function(oEvent) {
            let oSurveyModel = this.getView().getModel("surveyData");
            let aSections = oSurveyModel.getProperty("/surveySections");
            let oSection = oEvent.getSource().getBindingContext("surveyData").getObject();
            let iIndex = aSections.indexOf(oSection);

            if (iIndex !== -1) {
                aSections.splice(iIndex, 1);
                oSurveyModel.refresh();
            }
        },

        onAddQuestion: function(oEvent) {
            let oSurveyModel = this.getView().getModel("surveyData");
            let oSection = oEvent.getSource().getBindingContext("surveyData").getObject();
            oSection.sectionQuestions.push({ questionText: "" });
            oSurveyModel.refresh();
        },

        onRemoveQuestion: function(oEvent) {
            let oSurveyModel = this.getView().getModel("surveyData");
            let oQuestion = oEvent.getSource().getBindingContext("surveyData").getObject();
            let oSection = oSurveyModel.getProperty("/surveySections").find(sec => sec.sectionQuestions.includes(oQuestion));

            if (oSection) {
                let iIndex = oSection.sectionQuestions.indexOf(oQuestion);
                if (iIndex !== -1) {
                    oSection.sectionQuestions.splice(iIndex, 1);
                    oSurveyModel.refresh();
                }
            }
        },

        onReview: function() {
            let oSurveyModel = this.getView().getModel("surveyData");
            let oSurveyData = oSurveyModel.getData();

            console.log("Survey Data:", oSurveyData);
            this.submitSurveyData(oSurveyData);
        },
        
        submitSurveyData: function (oSurveyData) {
            fetch("/api/submitSurvey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(oSurveyData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Survey submitted successfully:", data);
                sap.m.MessageToast.show("Survey submitted successfully!");
            })
            .catch(error => {
                console.error("Error submitting survey:", error);
                sap.m.MessageToast.show("Failed to submit survey.");
            });
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
