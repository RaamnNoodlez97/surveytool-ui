sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("mta.MTA1.controller.MainView", {
            onInit: function () {}
            // ,
            // onNavToSF: function() {
            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("sf");
            // },
            // onNavToCurrUser: function() {
            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("currUser");
            // },
            // onShowEmployees: function() {
            //     var oTable = this.byId("employeeTable");
            //     var oModel = this.getView().getModel("perPersonal");
                
            //     // Debug: Print the correct path data
            //     console.log("Results array:", oModel.getProperty("/data/d/results"));
                
            //     // Make the table visible
            //     oTable.setVisible(true);
                
            //     // Debug: Check table binding
            //     console.log("Table binding path:", oTable.getBindingPath("items"));
            //     console.log("Number of bound items:", oTable.getItems().length);
            //  }

        });
    }
);
