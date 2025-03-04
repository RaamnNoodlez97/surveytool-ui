sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Text",
    "sap/ui/core/routing/History",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/json/JSONModel"
], function (Controller, Text, History, Table, Column, ColumnListItem, JSONModel) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.ContentView", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("contentView").attachPatternMatched(this._onRouteMatched, this);
        },

        _loadSFPrincipalTable: function (oVBox) {
            var oTable = new Table({
                columns: [
                    new Column({ header: new Text({ text: "First Name" }) }),
                    new Column({ header: new Text({ text: "Last Name" }) }),
                    new Column({ header: new Text({ text: "Employee ID" }) })
                ]
            });
        
            var oItemTemplate = new ColumnListItem({
                cells: [
                    new Text({ text: "{sfData>firstName}" }),
                    new Text({ text: "{sfData>lastName}" }),
                    new Text({ text: "{sfData>personIdExternal}" })
                ]
            });
        
            oTable.bindItems({
                path: "sfData>/d/results",
                template: oItemTemplate
            });
        
            // Add the table to the container
            oVBox.addItem(oTable);
        },

        _loadSFAPITable: function (oVBox) {
            var oTable = new Table({
                columns: [
                    new Column({ header: new Text({ text: "First Name" }) }),
                    new Column({ header: new Text({ text: "Last Name" }) }),
                    new Column({ header: new Text({ text: "Employee ID" })
                    })
                ]
            });

            var oItemTemplate = new ColumnListItem({
                cells: [
                    new Text({ text: "{sfApi>firstName}" }),
                    new Text({ text: "{sfApi>lastName}" }),
                    new Text({ text: "{sfApi>personIdExternal}" })
                ]
            });

            oTable.bindItems({
                path: "sfApi>/d/results",
                template: oItemTemplate
            });

            // Add table to VBox
            oVBox.addItem(oTable);
        },

        _onRouteMatched: function (oEvent) {
            var sContentType = oEvent.getParameter("arguments").contentType;
            var oVBox = this.getView().byId("dynamicContent");

            // Clear previous content
            oVBox.removeAllItems();
            oVBox.destroyItems();

            // Load new content based on the parameter
            switch (sContentType) {
                case "HelloWorld":
                    var oHelloWorldModel = new JSONModel("/api/test/helloworld");
                    this.getView().setModel(oHelloWorldModel, "helloworld");
                    oVBox.addItem(new Text({ text: "Hello, World!" }));
                    break;

                case "SFPrincipal":
                    var oSfDataModel = new JSONModel("/api/test/sf");
                    this.getView().setModel(oSfDataModel, "sfData");
                    this._loadSFPrincipalTable(oVBox);
                    break;

                case "SFAPI":
                    var oSfApiModel = new JSONModel("/api/test/sfapi");
                    this.getView().setModel(oSfApiModel, "sfApi");
                    this._loadSFAPITable(oVBox);
                    break;
            }
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
