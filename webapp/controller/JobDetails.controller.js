
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
 
        return Controller.extend("zuipdf.controller.JobDetails", {
        onInit: function () {

          sap.ui.core.UIComponent.getRouterFor(this).
					getRoute("JobDetails").attachPatternMatched(this._onInboxRouteMatched, this);	
        },
        _onInboxRouteMatched: function(oEvent){
          this.getView().byId("JobDetails").setBusy(true);
          this.Guid = (oEvent.getParameter("arguments").Guid) ? oEvent.getParameter("arguments").Guid : "";
            // Sample aggregated job data
            var oData = {
                jobs: [
                    { jobStatus: "In Progress", count: 16 },
                    { jobStatus: "Error", count: 7 },
                    { jobStatus: "Success", count: 29 }
                ]
            };

              // Set VizFrame Properties Programmatically
         /*     var oVizFrame = this.getView().byId("idVizFrame");
              oVizFrame.setVizProperties({
                  plotArea: {
                      dataLabel: { visible: true },
                      colorPalette: ["#ff9800", "#f44336", "#4caf50"]
                  },
                  title: {
                      visible: true,
                      text: "Overall File Status Overview"
                  },
                  interaction : {
                    selectability : {
                        mode : "single"
                    }
 }
                  
              });  */

            this.getView().byId("JobDetails").setModel(this.getOwnerComponent().getModel("backend"));
            this.getOwnerComponent().getModel().setSizeLimit(600);
            
            this.onGetFileTableData("")
           // this.onGetJobChart()
        
        },
        onGuidClick: function(oEvent) {
            var oParams = {};
            var row = oEvent.getSource().getBindingContext().getObject();
            oParams["Guid"] = row.Docguid;             
            this.getOwnerComponent().getRouter().navTo("JobDetails", oParams);
        },
        onGetJobChart: function(){
            const oView = this.getView();
            const sEntity = oView.byId("entitySelect").getSelectedKey();
            
            var oFilter = []
            // Filter OData call
            if (sEntity !== "" && sEntity !== "ALL") {
              oFilter = [
                  new sap.ui.model.Filter("Entity", sap.ui.model.FilterOperator.EQ, sEntity )                                       
                ];
          }
  
       
            oFilter.push( new sap.ui.model.Filter("JobType", sap.ui.model.FilterOperator.EQ, "IP"));
            this.getOwnerComponent().getModel("backend").read("/FileChartSet", {
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
        onGetFileTableData: function(oJobType){
           
       
            const oView = this.getView();
            var header = oView.getModel("App").getProperty("/header");
            oView.byId("JobDetails").setModel(new JSONModel(header),"JobInboxModel");
            var oFilter = [];
            if (this.Guid) {
                oFilter = [
                    new sap.ui.model.Filter("Guid", sap.ui.model.FilterOperator.EQ, this.Guid )                                       
                  ];
            }
        
              if(oJobType !== null && oJobType !== ""){
                oFilter.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, oJobType));
              }
              var that = this;
              this.getOwnerComponent().getModel("backend").read("/JobFileSet", {
                filters: oFilter,
                success: (oData) => {
                  // Bind table with the result
                  const oTable = oView.byId("fileTable");
                  const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
                  header["InProgress"] = oData.results[0]["InProgress"];
                  header["Error"] = oData.results[0]["Error"];
                  header["Success"] = oData.results[0]["Success"];
                  header["Step1Name"] = oData.results[0]["Step1Name"];
                  header["Step2Name"] = oData.results[0]["Step2Name"];
                  header["Step3Name"] = oData.results[0]["Step3Name"];
                  header["Step4Name"] = oData.results[0]["Step4Name"];
                  that.getView().byId("JobDetails").setModel(new JSONModel(header),"JobInboxModel");
                  that.getView().byId("JobDetails").setBusy(false);
                  oTable.setModel(oJSONModel, "FileInboxModel");
                },
                error: (oError) => {
                  this.getView().byId("JobDetails").setBusy(false);
                  sap.m.MessageToast.show("Error loading data.");
                }
              });
        },

        onInputChange: function(oEvent){
            this.onGetJobChart()
            this.onGetJobTableData("")
        },
        onViewDetails: function(oEvent){

        } ,   
        onRefresh: function(oEvent){
          this.onGetFileTableData("");
        },
        onHandleClose: function () {
                
          this.getOwnerComponent().getRouter().navTo("JobInbox"); 
      },

});
});