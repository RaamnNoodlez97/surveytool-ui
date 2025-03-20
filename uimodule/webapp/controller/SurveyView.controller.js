sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/WizardStep",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/RadioButtonGroup",
    "sap/m/RadioButton",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/core/routing/History",
    "mta/MTA1/model/formatter"
], function (Controller, JSONModel, WizardStep, VBox, Label, RadioButtonGroup, RadioButton, Button, Text, History, formatter) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.SurveyView", {
        formatter: formatter,

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("survey").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(oEvent) {
			let surveyId = window.decodeURIComponent(oEvent.getParameter("arguments").surveyId);
            console.log("Survey ID:", surveyId);
            this.loadSurveyData(surveyId);
		},

        loadSurveyData: function (surveyId) {
            let oView = this.getView();
            let oSurveyModel = new JSONModel();

            let sUrl = "/api/getSurvey?code=" + encodeURIComponent(surveyId);

            oSurveyModel.loadData(sUrl)
            .then(() => {
                console.log("Survey Data Loaded:", oSurveyModel.getData());
                oView.setModel(oSurveyModel, "surveyData");
            })
            .catch(error => {
                console.error("Error loading survey data:", error);
                sap.m.MessageToast.show("Failed to load survey. Please try again.");
            });

            // let oView = this.getView();
            // let oSurveyModel = new JSONModel();

            // oSurveyModel.loadData("../model/surveyData.json")
            // .then(() => {
            //     console.log("Survey Data Loaded:", oSurveyModel.getData());
            //     oView.setModel(oSurveyModel, "surveyData");
            // })
            // .catch(error => {
            //     console.error("Error loading survey data:", error);
            //     sap.m.MessageToast.show("Could not load survey data.");
            // });

        },
        
        onReview: function () {
            let oView = this.getView();
            let oSurveyModel = oView.getModel("surveyData");
            let oSurveyData = oSurveyModel.getData();   
            
            oSurveyData.surveyHeader.responseUser = "EU_PRIYULM"; 
            oSurveyData.surveyHeader.responseDate = new Date().toISOString();
        
            console.log("Survey Data with Responses:", oSurveyData);

            // Send the updated model directly
            this.submitSurveyResponse(oSurveyData);
        },        


        submitSurveyResponse: function (oResponseData) {
            let sUrl = "/api/submitResponse";
            $.ajax({
                url: sUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(oResponseData),
                success: function (data) {
                    sap.m.MessageToast.show("Survey submitted successfully!");
                    console.log("Submission Success:", data);
                },
                error: function (xhr, status, error) {
                    console.error("Submission Error:", error);
                    sap.m.MessageToast.show("Failed to submit survey. Please try again.");
                }
            });
        },

        onRadioSelect: function(oEvent) {
            let oSelectedButton = oEvent.getSource();
            let iValue = oSelectedButton.getCustomData()[0].getValue(); // Get the custom data value
            let sQuestionExternalCode = oSelectedButton.getCustomData()[1].getValue();
            console.log("Selected value:", iValue, " selected question: ", sQuestionExternalCode);

            // Get the model
            let oView = this.getView();
            let oSurveyModel = oView.getModel("surveyData");

            if (!oSurveyModel) {
                console.error("Survey model not found!");
                return;
            }

            // Get the survey data
            let oSurveyData = oSurveyModel.getData();

            // Loop through survey sections and find the question to update
            oSurveyData.surveySections.forEach(section => {
                section.sectionQuestions.forEach(question => {
                    if (question.questionExternalCode === sQuestionExternalCode) {
                        if (!question.hasOwnProperty("answerText")) {
                            question.answerText = null;
                        }
                        question.answerText = iValue;
                    }
                });
            });

            oSurveyModel.updateBindings(true);
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
