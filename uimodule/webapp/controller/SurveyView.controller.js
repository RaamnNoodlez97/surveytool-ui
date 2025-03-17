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
            this.loadSurveyData();
		},

        loadSurveyData() {
            // let oView = this.getView();
            // let oSurveyModel = new JSONModel();

            // fetch(`/api/getSurvey/${surveyId}`)
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error("Failed to fetch survey data.");
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     console.log("Survey Data:", data);
            //     oSurveyModel.setData(data);
            //     oView.setModel(oSurveyModel, "surveyData");  // Bind data to model
            // })
            // .catch(error => {
            //     console.error("Error fetching survey data:", error);
            //     sap.m.MessageToast.show("Could not load survey data.");
            // });

            let oView = this.getView();
            let oSurveyModel = new JSONModel();

            oSurveyModel.loadData("../model/surveyData.json")
            .then(() => {
                console.log("Survey Data Loaded:", oSurveyModel.getData());
                oView.setModel(oSurveyModel, "surveyData");

                // Once loaded, dynamically generate wizard steps
                this.generateSurveyWizardSteps();
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

            oSurveyData.surveySections.forEach((section, index) => {
                let oStep = new WizardStep({
                    title: section.sectionName
                });

                let oVBox = new VBox();

                section.sectionQuestions.forEach(question => {
                    let oLabel = new Label({ text: question.questionText });
                    let oRadioButtonGroup = new RadioButtonGroup({ columns: 1 });

                    ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"].forEach(option => {
                        oRadioButtonGroup.addButton(new RadioButton({ text: option }));
                    });

                    oVBox.addItem(oLabel);
                    oVBox.addItem(oRadioButtonGroup);
                });

                oStep.addContent(oVBox);
                oWizard.addStep(oStep);
            });

            let oSubmitStep = new WizardStep({ title: "Submit Survey" });
            let oSubmitVBox = new VBox({
                items: [
                    new Label({ text: "Review your responses and click submit." }),
                    new Button({ text: "Submit", type: "Emphasized", press: this.onSubmit.bind(this) })
                ]
            });

            oSubmitStep.addContent(oSubmitVBox);
            oWizard.addStep(oSubmitStep);
        },

        onSubmit: function () {
            sap.m.MessageToast.show("Survey Submitted!");
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
