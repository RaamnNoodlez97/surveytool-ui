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
], function (Controller, JSONModel, WizardStep, VBox, Label, RadioButtonGroup, RadioButton, Button, Text, History) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.SurveyView", {
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

                // Dynamically generate wizard steps
                this.generateSurveyWizardSteps();
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

            //     // Once loaded, dynamically generate wizard steps
            //     this.generateSurveyWizardSteps();
            // })
            // .catch(error => {
            //     console.error("Error loading survey data:", error);
            //     sap.m.MessageToast.show("Could not load survey data.");
            // });

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

                    // Get answer options based on question type, default to an empty array if type is unknown
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
        
            let oResponseData = {
                responseHeader: {
                    responseUser: "Mark Antony",  // Hardcoded for now; update dynamically if needed
                    responseDate: new Date().toISOString(),
                    responseSurvey: oSurveyData.surveyHeader.surveyName
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
                            let sectionIndex = stepIndex; // Maps step index to section index
                            let questionIndex = Math.floor(aItems.indexOf(item) / 2); // Assumes question order
        
                            let questionData = oSurveyData.surveySections[sectionIndex].sectionQuestions[questionIndex];
        
                            if (questionData) {
                                let questionType = questionData.questionType.toLowerCase();
                                let numericValue = selectedIndex + 1; // Convert to 1-based index
        
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
