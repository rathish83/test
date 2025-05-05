sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ], function (Controller, MessageToast, JSONModel) {
    "use strict";
  
    return Controller.extend("zuipdf.controller.submitJob", {
      onInit: function () {
      
        this.getView().setModel(this.getOwnerComponent().getModel("backend"),"backend");
        
         
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			   oRouter.getRoute("JobCreate").attachPatternMatched(this._onObjectMatched, this);
        
      },
      _onObjectMatched: function (oEvent) {
      
        var oDropDown = {
          readOptions: [
            { key: "MAILBOX", text: "Read from MailBox" },
            { key: "SHAREPOINT", text: "Read from SharePoint" },
          
          ]

        };
        var oModel = new JSONModel(oDropDown);
        this.getView().setModel(oModel,"DropDown");
        // Initialize the model to hold form data
        const oData = {
          entityType: "",
          actionType: "",
          inputFolder: "",
          outputFolder: "",
        };
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "formData");
         // Create a JSONModel and set it to the view

        this.getView().getModel("backend").read("/CategorySet", {
          
          success: (oData) => {
            // Bind table with the result
           
            const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
            this.getView().setModel(oJSONModel, "CategoryModel");
          },
          error: (oError) => {
            sap.m.MessageToast.show("Error loading data.");
          }
        });
      this.getView().getModel("backend").read("/JobSet", {
          
        success: (oData) => {
          // Bind table with the result
          const oTable = this.getView().byId("jobTable");
          const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
          oTable.setModel(oJSONModel, "JobModel");
        },
        error: (oError) => {
          sap.m.MessageToast.show("Error loading data.");
        }
      });
    },
    onBack: function(oEvent){
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("JobInbox");
    },
    onRefresh: function(){
      var that = this;
      this.getView().getModel("backend").read("/JobSet", {
          
        success: (oData) => {
          that.getView().setBusy(false); 
          // Bind table with the result
          const oTable = that.getView().byId("jobTable");
          const oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
          oTable.setModel(oJSONModel, "JobModel");
        },
        error: (oError) => {
          that.getView().setBusy(false);
          sap.m.MessageToast.show("Error loading data.");
        }
      });
    },
      onActionChange: function(){
        if(this.getView().byId("action").getSelectedKey() === "SHAREPOINT"){
          this.getView().byId("inputFolder").setVisible(true)
          this.getView().byId("outputFolder").setVisible(true)
        }
        else{
          this.getView().byId("inputFolder").setVisible(false)
          this.getView().byId("outputFolder").setVisible(false)
        }
      },
      onSubmit: function () {
        // Get form data from the model
        const oModel = this.getView().getModel("formData");
        const oData = oModel.getData();
  


        var sUrl = "", json_data = {};
        var chkBox = this.getView().byId("chkBoxDwnld").getSelected();
        var chkBoxRebate = this.getView().byId("chkBoxRebate").getSelected();
        var formData = new FormData();
        if(this.getView().byId("action").getSelectedKey() === "SHAREPOINT"){
                  // Validate input
          if (!oData.entityType || !oData.inputFolder || !oData.outputFolder || !oData.actionType) {
            MessageToast.show("Please fill all fields!");
            return;
          }
          sUrl = "/parse_file_sharepoint";
          
                // Create FormData to send file and additional input data          
          json_data = {"Entity": oData.entityType,"Model": "gpt-4o-2024-08-06","UICall": false, "SharePointFolderPath": oData.inputFolder, "OutputFolderName": oData.outputFolder,"excel": chkBox, "rebate": chkBoxRebate };
        }
        else if(this.getView().byId("action").getSelectedKey() === "MAILBOX"){
          sUrl = "/parse_file_mailbox";
          json_data = {"Entity": oData.entityType,"Model": "gpt-4o-2024-08-06","UICall": false, "csv": true, "mailFilter": { "senderName": "Rathish Karunakaran", "senderEmail":"rathishk@nvidia.com"},"excel": chkBox  };
        }
        var jobName =  "Job_" + oData.entityType + oData.actionType
        // Prepare the POST request
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");             
        var appPath = appId.replaceAll(".", "/");              
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var url = appModulePath + sUrl
        
        console.log("App Path"+ url)
        formData.append("input", JSON.stringify(json_data));
        // Start time measurement
        var that = this;
        this.getView().setBusy(true);  
          // Use performance.now() for precise measurement
         $.ajax({
             url: url,  // Replace with your REST API endpoint
             type: "POST",
             data: formData,
             processData: false,
             contentType: false,
             timeout: 1200000,
             success: function(response) {
              let guidAsString = response.toString();
              MessageToast.show("Action submitted successfully!");
              const oPayload = {
                EntityType: oData.entityType,
                ActionType: oData.actionType,
                Guid: guidAsString,
                JobName: jobName
                
              };
              that.getView().getModel("backend").create("/JobSet", oPayload , { 
                  success: () => {
                    that.onRefresh();
                    that.getView().setBusy(false); 
                  MessageToast.show("Action submitted successfully!");
                
              },
              error: (err) => {
                MessageToast.show("Failed to submit action. Check the backend.");
                console.error(err);
              }
              });
             },
             error: function(e) {
              that.getView().setBusy(false);          
              sap.m.MessageToast.show("Error while submitting Action."+ e.responseJSON["detail"]);
            }
          });
      }
    });
  });
  