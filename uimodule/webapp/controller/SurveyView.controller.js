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

            // Initialize response model
            let oResponseModel = new sap.ui.model.json.JSONModel({
                responseHeader: {
                    responseUser: "EU_ASHIR",
                    responseDate: new Date().toISOString(),
                    responseSurvey: ""
                },
                responseAnswers: []
            });

            this.getView().setModel(oResponseModel, "responseData");
        },

        onObjectMatched(oEvent) {
			let surveyId = window.decodeURIComponent(oEvent.getParameter("arguments").surveyId);
            console.log("Survey ID:", surveyId);
            this.loadSurveyData(surveyId);
		},

        loadSurveyData: function (surveyId) {
            // let oView = this.getView();
            // let oSurveyModel = new JSONModel();

            // let sUrl = "/api/getSurvey?code=" + encodeURIComponent(surveyId);

            // oSurveyModel.loadData(sUrl)
            // .then(() => {
            //     console.log("Survey Data Loaded:", oSurveyModel.getData());
            //     oView.setModel(oSurveyModel, "surveyData");

            //     this.generateSurveyWizardSteps();
            // })
            // .catch(error => {
            //     console.error("Error loading survey data:", error);
            //     sap.m.MessageToast.show("Failed to load survey. Please try again.");
            // });

            let oView = this.getView();
            let oSurveyModel = new JSONModel();

            oSurveyModel.loadData("../model/surveyData.json")
            .then(() => {
                console.log("Survey Data Loaded:", oSurveyModel.getData());
                oView.setModel(oSurveyModel, "surveyData");

                let oSurveyData = oSurveyModel.getData();
                let oResponseModel = oView.getModel("responseData");

                let aResponseAnswers = [];
                oSurveyData.surveySections.forEach(section => {
                    section.sectionQuestions.forEach(question => {
                        aResponseAnswers.push({
                            question: question.questionExternalCode,
                            answerText: 1 // Default value
                        });
                    });
                });

                oResponseModel.setProperty("/responseAnswers", aResponseAnswers);
                console.log("Initialized Response Model:", oResponseModel.getData());
            })
            .catch(error => {
                console.error("Error loading survey data:", error);
                sap.m.MessageToast.show("Could not load survey data.");
            });

        },

        generateSurveyWizardSteps() {
            let oView = this.getView();
            let oSurveyData = oView.getModel("surveyData").getData();
            let oWizard = oView.byId("surveyWizard");

            // Clear existing steps
            oWizard.removeAllSteps();

            let oAnswerOptions = {
                "satisfaction": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
                "frequency": ["Never", "Rarely", "Sometimes", "Often", "Always"],
                "agreement": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
                "quality": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
            };
        

            oSurveyData.surveySections.forEach((section, index) => {
                let oStep = new WizardStep({
                    title: section.sectionName
                });

                let oVBox = new VBox();

                section.sectionQuestions.forEach(question => {
                    let oLabel = new Label({ text: question.questionText });
                    let oRadioButtonGroup = new RadioButtonGroup({ columns: 1 });

                    let aOptions = oAnswerOptions[question.questionType.toLowerCase()] || [];

                    aOptions.forEach(option => {
                        oRadioButtonGroup.addButton(new sap.m.RadioButton({ text: option }));
                    });

                    oVBox.addItem(oLabel);
                    oVBox.addItem(oRadioButtonGroup);
                });

                oStep.addContent(oVBox);
                oWizard.addStep(oStep);
            });
        },

        
        onReview: function () {
            let oView = this.getView();
            let oSurveyModel = oView.getModel("surveyData");
            let oSurveyData = oSurveyModel.getData();
            let oWizard = oView.byId("surveyWizard");    
            
            let surveyId = window.decodeURIComponent(oEvent.getParameter("arguments").surveyId);
        
            let oResponseData = {
                responseHeader: {
                    responseUser: "EU_PRIYULM", 
                    responseDate: new Date().toISOString(),
                    responseSurvey: surveyId
                },
                responseAnswers: []
            };
        
            let aSteps = oWizard.getSteps();
        
            aSteps.forEach((step, stepIndex) => {
                let oVBox = step.getContent()[0];
        
                if (!oVBox || !(oVBox instanceof sap.m.VBox)) {
                    console.warn("Unexpected step content. Skipping this step.");
                    return;
                }
        
                let aItems = oVBox.getItems();
                aItems.forEach(item => {
                    if (item instanceof sap.m.RadioButtonGroup) {
                        let selectedIndex = item.getSelectedIndex();
                        if (selectedIndex !== -1) {
                            let sectionIndex = stepIndex; 
                            let questionIndex = Math.floor(aItems.indexOf(item) / 2); 
        
                            let questionData = oSurveyData.surveySections[sectionIndex].sectionQuestions[questionIndex];
        
                            if (questionData) {
                                let questionType = questionData.questionType.toLowerCase();
                                let numericValue = selectedIndex + 1; 
        
                                oResponseData.responseAnswers.push({
                                    question: questionData.questionExternalCode,
                                    answerText: numericValue
                                });
                            }
                        }
                    }
                });
            });
        
            console.log("Survey Response Data:", oResponseData);
        
            this.submitSurveyResponse(oResponseData);
        },        


        submitSurveyResponse: function (oResponseData) {
            let sUrl = "/api/submitResponse";
            // console.log(oResponseData);
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

            // Get the response model
            let oResponseModel = this.getView().getModel("responseData");

            if (!oResponseModel) {
                console.error("Response model not found!");
                return;
            }

            let oResponseData = oResponseModel.getData();

            let existingEntry = oResponseData.responseAnswers.find(entry => entry.question === sQuestionExternalCode);
    
            if (existingEntry) {
                existingEntry.answerText = iValue; // Update existing entry
            } else {
                oResponseData.responseAnswers.push({ question: sQuestionExternalCode, answerText: iValue }); // Add new entry
            }

            oResponseModel.updateBindings(true);
            console.log("Updated response model:", oResponseData);
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
