sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
], function (Controller, Text, JSONModel, History) {
    "use strict";

    return Controller.extend("mta.MTA1.controller.SurveyView", {
        onInit: function () {

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
