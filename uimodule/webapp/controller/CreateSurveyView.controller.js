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


        onAddSection: function() {
            let oWizard = this.getView().byId("surveyDraftWizard");
            let sectionCount = oWizard.getSteps().length;
        
            if (!oWizard.getVisible()) {
                oWizard.setVisible(true);
            }

            let sectionId = "section_" + sectionCount;
            this.sectionQuestionCount[sectionId] = 1;  // Initialize question count for this section
        
            let oQuestionContainer = new VBox({ id: "questionContainer_" + sectionCount }).addStyleClass("questionContainer");
        
            let oAddQuestionButton = new Button({
                text: "Add Question",
                press: this.onAddQuestion.bind(this, sectionId, oQuestionContainer)// Pass questionCount to the handler
            }).addStyleClass("inputField");
        
            let oNewStep = new WizardStep({
                title: "Section " + (sectionCount + 1),
                content: new VBox({
                    items: [
                        new Label({ text: "Section Name:" }).addStyleClass("inputLabel"),
                        new Input({ id: sectionId + "_name", placeholder: "Enter section name" }).addStyleClass("inputField"),
        
                        new Label({ text: "Section Description:" }).addStyleClass("inputLabel"),
                        new Input({ id: sectionId + "_desc", placeholder: "Enter section description" }).addStyleClass("inputField"),

                        new Label({ text: "Section Likert Scale Type:" }).addStyleClass("inputLabel"),
                        new ComboBox({
                            id: sectionId + "_type",
                            items: [
                                new sap.ui.core.Item({ key: "satisfaction", text: "Satisfaction" }),
                                new sap.ui.core.Item({ key: "agreement", text: "Agreement" }),
                                new sap.ui.core.Item({ key: "frequency", text: "Frequency" }),
                                new sap.ui.core.Item({ key: "quality", text: "Quality" })
    
                            ]
                        }).addStyleClass("inputField sapUiMediumMarginBottom"),
        
                        oQuestionContainer, // Question container
                        oAddQuestionButton
                    ]
                })
            });
        
            oWizard.addStep(oNewStep);
        },
        

        onAddQuestion: function(sectionId, oQuestionContainer, oEvent) {
            let questionCount = this.sectionQuestionCount[sectionId] || 1;

            let aItems = oQuestionContainer.getItems();
            let bToolbarExists = aItems.some(item => item instanceof sap.m.Toolbar);

            // If toolbar does not exist, create and add it
            if (!bToolbarExists) {
                let oToolbar = new sap.m.Toolbar({
                    content: [
                        new sap.m.Title({
                            text: "Questions"
                        }).addStyleClass("sectionHeadingTitle")
                    ]
                });

                oQuestionContainer.addItem(oToolbar);
            }

            let questionLabel = new Label({ text: "Question " + questionCount }).addStyleClass("questionSubHeading, sapUiSmallMarginTop");

            let oNewQuestion = new VBox({
                items: [
                    questionLabel, // Question label
                    new Label({ text: "Question Text:" }).addStyleClass("inputLabel"),
                    new Input({ id: sectionId + "_q" + questionCount, placeholder: "Enter question" }).addStyleClass("inputField"),
                ]
            });

            oQuestionContainer.addItem(oNewQuestion);
            this.sectionQuestionCount[sectionId]++;
        },


        onReview: function () {
            let oView = this.getView();
            let oWizard = oView.byId("surveyDraftWizard");
            let oSurveyModel = oView.getModel("surveyData");
            let oSurveyData = {
                surveyHeader: {
                    surveyName: oView.byId("surveyNameInput").getValue(),
                    surveyDescription: oView.byId("surveyDescriptionInput").getValue(),
                    surveyStatus: "Draft"
                },
                surveySections: []
            };

            let aSteps = oWizard.getSteps();
            console.log("Wizard Steps Found:", aSteps.length);

            aSteps.forEach(step => {
                console.log("Processing Step:", step.getTitle());
                let oVBox = step.getContent()[0];
                console.log("Step Content:", oVBox);

                if (!oVBox || !(oVBox instanceof sap.m.VBox)) {
                    console.warn("Unexpected content structure. Skipping this step.");
                    return;
                }

                let aItems = oVBox.getItems();
                console.log("VBox Items:", aItems);
                
                let sectionName = "";
                let sectionDescription = "";
                let sectionLikertScaleType = "";
                let sectionQuestions = [];

                aItems.forEach(item => {
                    console.log("Checking Item:", item);

                    if (item instanceof Input && item.getId().includes("_name")) {
                        sectionName = item.getValue();
                        console.log("Section Name Found:", sectionName);
                    } else if (item instanceof Input && item.getId().includes("_desc")) {
                        sectionDescription = item.getValue();
                        console.log("Section Description Found:", sectionDescription);
                    } else if (item instanceof ComboBox) {
                        sectionLikertScaleType = item.getSelectedItem()?.getText() || "";
                    } else if (item instanceof VBox) {
                        console.log("Found Question Container:", item);
                        // Loop through questions
                        let aQuestionItems = item.getItems();
                        aQuestionItems.forEach(qItem => {
                            if (qItem instanceof VBox) {
                                let questionText = "";
                                qItem.getItems().forEach(qSubItem => {
                                    if (qSubItem instanceof Input) {
                                        questionText = qSubItem.getValue();
                                    }
                                });

                                if (questionText) {
                                    sectionQuestions.push({ questionText });
                                    console.log("Added Question:", { questionText });
                                }
                            }
                        });
                    }
                });

                if (sectionName && sectionDescription && sectionLikertScaleType) {
                    oSurveyData.surveySections.push({
                        sectionName,
                        sectionDescription,
                        sectionLikertScaleType,
                        sectionQuestions
                    });
                    console.log("Added Section:", { sectionName, sectionDescription, sectionQuestions });
                }
            });

            oSurveyModel.setData(oSurveyData);
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
