
sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel",
     "zuipdf/util/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter) {
        "use strict";
 
        return Controller.extend("zuipdf.controller.JobInbox", {
        onInit: function () {

            var today = new Date();
            var pastDate = new Date();
            pastDate.setDate(today.getDate() - 10); // Subtract 30 days

            var oDateModel = new JSONModel({
                startDate: pastDate,
                endDate: today
            });

            this.getView().setModel(oDateModel, "dateModel");
       
            // Sample aggregated job data
            var oData = {
                jobs: [
                    { jobStatus: "In Progress", count: 16 },
                    { jobStatus: "Error", count: 7 },
                    { jobStatus: "Success", count: 29 }
                ]
            };

              // Set VizFrame Properties Programmatically
              var oVizFrame = this.getView().byId("idVizFrame");
              oVizFrame.setVizProperties({
                  plotArea: {
                      dataLabel: { visible: true },
                      colorPalette: ["#ff9800", "#f44336", "#4caf50"]
                  },
                  title: {
                      visible: true,
                      text: "Overall Job Status Overview"
                  },
                  interaction : {
                    selectability : {
                        mode : "single"
                    }
 }
                  
              }); 
            // Create JSON Model and set to the view
        //    var oModel = new JSONModel(oData);
          //  this.getView().byId("JobInbox").setModel(oModel,"chartModel");
        

            this.getView().byId("JobInbox").setModel(this.getOwnerComponent().getModel("backend"));
            this.getOwnerComponent().getModel().setSizeLimit(600);
            this.onGetJobTableData("")
            this.onGetJobChart()
          //  this.getView().byId("smartFilterBar").addEventDelegate({
           //     "onAfterRendering": function (oEvent) {
             //       var oButton = oEvent.srcControl._oSearchButton;
                  //  oButton.addStyleClass("zSFBButton");
                  //  oButton.setText("Search");
                   // oButton.addStyleClass("zSFBButton");
                  /*  var oFilterButton = oEvent.srcControl._oFiltersButton;           
                    oFilterButton.setType("Emphasized");
                    oFilterButton.addStyleClass("zSFBButton");
                    oButton = oEvent.srcControl._oRestoreButtonOnFB;
                    oButton.setText("Reset");
                    oButton.setType("Emphasized");
                    oButton.addStyleClass("zSFBButton"); */
              //  }
           // },this);
        },
        onJobSubmit: function(oEvent){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("JobCreate");
        },
        onFileUpload: function(oEvent){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("FileUpload");
        },
        onPoInbox: function(oEvent){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("PoInbox");
        },

        onPid:function(oEvent){

          var sUrl = "/get_pid";
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");             
          var appPath = appId.replaceAll(".", "/");              
          var appModulePath = jQuery.sap.getModulePath(appPath);
          var url = appModulePath + sUrl
          jQuery.ajax({
            url: url, // Matches the route in xs-app.json
            type: "GET",
            success: function (oData) {
              console.log("API Response:", oData);
            },
            error: function (oError) {
              console.error("Error:", oError);
            }
          });



        },
        onPrompt: function(oEvent){
          var oParams = {};
          const oRouter = this.getOwnerComponent().getRouter();
          oParams["Partner"] = "X";      
          oParams["Entity"] = 'PURCHASE_ORDER';    
          oRouter.navTo("Prompt",oParams);
        },
        onFileInbox: function(oEvent){
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Test");
        },

        onGuidClick: function(oEvent) {
            var oParams = {};
            var row = oEvent.getSource().getParent().getBindingContext("JobInboxModel").getObject();
            oParams["Guid"] = row.Docguid;             
            this.getOwnerComponent().getRouter().navTo("JobDetails", oParams);
        },
        onGetJobChart: function(){
            const oView = this.getView();
            const sEntity = oView.byId("entitySelect").getSelectedKey();
            var oFromDate = oView.byId("dateRangePicker").getDateValue();
            var oToDate = oView.byId("dateRangePicker").getSecondDateValue();
            var oFilter = []
            // Filter OData call
            if (sEntity !== "" && sEntity !== "ALL") {
              oFilter = [
                  new sap.ui.model.Filter("Entity", sap.ui.model.FilterOperator.EQ, sEntity )                                       
                ];
          }
            if ( oFromDate !== undefined && oFromDate !== null ) {
                oFromDate = oFromDate.toISOString().split("T")[0];
                oToDate = oToDate.toISOString().split("T")[0];
                oFilter.push( new sap.ui.model.Filter("FromDate", sap.ui.model.FilterOperator.GE, oFromDate));
                oFilter.push( new sap.ui.model.Filter("ToDate", sap.ui.model.FilterOperator.LT, oToDate));
            }
            oFilter.push( new sap.ui.model.Filter("JobType", sap.ui.model.FilterOperator.EQ, "IP"));
            this.getOwnerComponent().getModel("backend").read("/JobChartSet", {
                filters: oFilter,
                success: (oData) => {
                // Bind table with the result                 
                    const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
                    oView.setModel(oJSONModel, "chartModel");
                },
                error: (oError) => {
                sap.m.MessageToast.show("Error loading data.");
                }
            });
        },
        onGetJobTableData: function(oJobType){

            const oView = this.getView();
            var oFilter = [];
            var sEntity = oView.byId("entitySelect").getSelectedKey();
            if (sEntity !== "" && sEntity !== "ALL") {
                oFilter = [
                    new sap.ui.model.Filter("EntityType", sap.ui.model.FilterOperator.EQ, sEntity )                                       
                  ];
            }
            var oFromDate = oView.byId("dateRangePicker").getDateValue();
            var oToDate = oView.byId("dateRangePicker").getSecondDateValue();
            
              if ( oFromDate !== undefined && oFromDate !== null ) {
                oFromDate = oFromDate.toISOString().split("T")[0];
                oToDate = oToDate.toISOString().split("T")[0];
                oFilter.push( new sap.ui.model.Filter("FromDate", sap.ui.model.FilterOperator.GE, oFromDate));
                oFilter.push( new sap.ui.model.Filter("ToDate", sap.ui.model.FilterOperator.LT, oToDate));
              }
              if(oJobType !== null && oJobType !== ""){
                oFilter.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, oJobType));
              }
     
              this.getOwnerComponent().getModel("backend").read("/JobSet", {
                filters: oFilter,
                success: (oData) => {
                  // Bind table with the result
                  const oTable = oView.byId("jobTable");
                  const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
                  oTable.setModel(oJSONModel, "JobInboxModel");
                },
                error: (oError) => {
                  sap.m.MessageToast.show("Error loading data.");
                }
              });
        },
        onSelectData: function(oEvent){
            debugger;
            var oJobType = oEvent.getParameters().data[0].data["Job Status"];
            var type = "";
            switch (oJobType) {
                case "In Progress":
                 type = "INPROGRESS";
                 break;
                case "Error":
                    type = "ERROR";
                    break;
                case "Success":
                    type = "SUCCESS";
                    break;
            }
         //   oEvent.getSource().vizSelection([], { clearSelection: true });
           // oEvent.getSource().vizSelection(oEvent.getParameter("data"));
            this.onGetJobTableData(type);
            
        },
        onInputChange: function(oEvent){
            this.onGetJobChart()
            this.onGetJobTableData("")
        },
        onRefresh: function(oEvent){
          this.onGetJobTableData("")
        },
        onViewDetails: function(oEvent){
          var oParams = {};
          var selectedRow = oEvent.getSource().getParent().getBindingContext("JobInboxModel").getObject();
          oParams["Guid"] = selectedRow.Guid;             
          var header = { "Guid" : selectedRow.Guid, "JobName": selectedRow.JobName, "CreatedDate": selectedRow.CreatedDate, "Status": selectedRow.Status, "UserName": selectedRow.UserName }
          this.getView().getModel("App").setProperty("/header",header);
          this.getOwnerComponent().getRouter().navTo("JobDetails", oParams);
        }    
        

});
});