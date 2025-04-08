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
    "sap/m/MessageToast",
    "mta/MTA1/model/formatter"
], function (Controller, JSONModel, WizardStep, VBox, Label, RadioButtonGroup, RadioButton, Button, Text, History, MessageToast, formatter) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.SurveyView", {
        formatter: formatter,

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("survey").attachPatternMatched(this.onObjectMatched, this);
        },

        getCurrentUser: function() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/user-api/currentUser",
                    method: "GET",
                    success: function(data) {
                        // Typically, the user ID is in data.id or data.userName
                        resolve(data.name);
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching current user:", error);
                        reject(error);
                    }
                });
            });
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
                let oSurveyData = oSurveyModel.getData();

                if(!oSurveyData.surveyHeader.hasOwnProperty("responseSurvey")) {
                    oSurveyData.surveyHeader.responseSurvey = surveyId;
                }
        
                // Ensure every question has an answerText initialized
                oSurveyData.surveySections.forEach(section => {
                    section.sectionQuestions.forEach(question => {
                        if (!question.hasOwnProperty("answerText")) {
                            question.answerText = 1; // Default answer value
                        }
                    });
                });

                console.log("Survey Data Loaded with Default Answers:", oSurveyData);
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
            
            this.getCurrentUser().then((userId) => {
                oSurveyData.surveyHeader.responseUser = userId;
                oSurveyData.surveyHeader.responseDate = new Date().toISOString();
                console.log("Survey Data with User:", oSurveyData);
                this.submitSurveyResponse(oSurveyData);
            }).catch((error) => {
                console.error("Could not retrieve user ID:", error);
            });
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
