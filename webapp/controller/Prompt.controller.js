
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function (Controller,Formatter) {
        "use strict";
       var results =  {
            "data": [
              {
                "Entity": "PURCHASE_ORDER",
                "IssuerName": "Ingram Micro",
                "LabelName": "PO_INTRODUCTION",
                "Editable": false,
                "Prompt": "Your ability to extract and summarize information from this multilingual Purchase Order (PO) document accurately is crucial for effective PO analysis. \n" +
                          "Pay close attention to the language, structure, and any references within the document to ensure a thorough and precise extraction of information, regardless of language.",
                "Version": 1,
                "Active": true
            },
            {
                "Entity": "PURCHASE_ORDER",
                "IssuerName": "Ingram Micro",
                "LabelName": "PO_FOCUS_DETAILS",
                "Editable": true,
                "Prompt": "Focus on key details such as the Order number, issuer, item descriptions, quantity, shipping details, and pricing. \n" +
                "The Purchase Order Issuer is the entity (an individual, organization, or department) that creates and sends a Purchase Order (PO) to a supplier or vendor.",
                "Version": 1,
                "Active": true
            },

            {
              "Entity": "PURCHASE_ORDER",
              "IssuerName": "Ingram Micro",
              "LabelName": "PO_NUMBER_HANDLING",
              "Editable": true,
              "Prompt": "Be especially mindful of the numbers in context, particularly those associated with terms like 'quantity', 'units', or 'amount'. \n" +
    "Capture quantity values exactly as they appear, whether in decimals or whole numbers (e.g., 58.00 or 58), without defaulting to a value of 1 unless explicitly mentioned. \n" +
    "Ignore any values that are 'none' or irrelevant.",
              "Version": 1,
              "Active": true
          },
          {
            "Entity": "PURCHASE_ORDER",
            "IssuerName": "Ingram Micro",
            "LabelName": "PO_PROMPT_CUSTOM",
            "Editable": true,
            "Prompt": "",
            "Version": 1,
            "Active": true
          },
          {
            "Entity": "PURCHASE_ORDER",
            "IssuerName": "Ingram Micro",
            "LabelName": "PO_INSTRUCTIONS",
            "Editable": false,
            "Prompt": "Do not use prior knowledge or information from outside the document to answer the questions. \n" +
    "Only use the information provided within this Purchase Order to ensure accuracy and comprehensiveness in your response.",
            "Version": 1,
            "Active": true
        },
        {
          "Entity": "PURCHASE_ORDER",
          "IssuerName": "Ingram Micro",
          "LabelName": "PO_MULTILINGUAL_SUPPORT",
          "Editable": false,
          "Prompt": "Support multilingual text and symbols, and account for the possibility of non-English terminology or formatting.",
          "Version": 1,
          "Active": true
      },
      {
        "Entity": "PURCHASE_ORDER",
        "IssuerName": "Ingram Micro",
        "LabelName": "PO_POSTAMBLE",
        "Editable": false,
        "Prompt":  "Do not include any explanation in the reply. \n" +
        "Only include the extracted information in the reply. \n" +
        "Strictly output in JSON format.",
        "Version": 1,
        "Active": true
    },      
    {
      "Entity": "PURCHASE_ORDER",
      "IssuerName": "Felxtronics",
      "LabelName": "PO_INTRODUCTION",
      "Editable": false,
      "Prompt": "Your ability to extract and summarize information from this multilingual Purchase Order (PO) document accurately is crucial for effective PO analysis. \n" +
                "Pay close attention to the language, structure, and any references within the document to ensure a thorough and precise extraction of information, regardless of language.",
      "Version": 1,
      "Active": true
  },
  {
      "Entity": "PURCHASE_ORDER",
      "IssuerName": "Felxtronics",
      "LabelName": "PO_FOCUS_DETAILS",
      "Editable": true,
      "Prompt": "Focus on key details such as the Order number, issuer, item descriptions, quantity, shipping details, and pricing. \n" +
      "The Purchase Order Issuer is the entity (an individual, organization, or department) that creates and sends a Purchase Order (PO) to a supplier or vendor.",
      "Version": 1,
      "Active": true
  },

  {
    "Entity": "PURCHASE_ORDER",
    "IssuerName": "Felxtronics",
    "LabelName": "PO_NUMBER_HANDLING",
    "Editable": true,
    "Prompt": "Be especially mindful of the numbers in context, particularly those associated with terms like 'quantity', 'units', or 'amount'. \n" +
"Capture quantity values exactly as they appear, whether in decimals or whole numbers (e.g., 58.00 or 58), without defaulting to a value of 1 unless explicitly mentioned. \n" +
"Ignore any values that are 'none' or irrelevant.",
    "Version": 1,
    "Active": true
},
{
  "Entity": "PURCHASE_ORDER",
  "IssuerName": "Felxtronics",
  "LabelName": "PO_PROMPT_CUSTOM",
  "Editable": true,
  "Prompt": "",
  "Version": 1,
  "Active": true
},
{
  "Entity": "PURCHASE_ORDER",
  "IssuerName": "Felxtronics",
  "LabelName": "PO_INSTRUCTIONS",
  "Editable": false,
  "Prompt": "Do not use prior knowledge or information from outside the document to answer the questions. \n" +
"Only use the information provided within this Purchase Order to ensure accuracy and comprehensiveness in your response.",
  "Version": 1,
  "Active": true
},

{
"Entity": "PURCHASE_ORDER",
"IssuerName": "Felxtronics",
"LabelName": "PO_MULTILINGUAL_SUPPORT",
"Editable": false,
"Prompt": "Support multilingual text and symbols, and account for the possibility of non-English terminology or formatting.",
"Version": 1,
"Active": true
},
{
"Entity": "PURCHASE_ORDER",
"IssuerName": "Felxtronics",
"LabelName": "PO_POSTAMBLE",
"Editable": false,
"Prompt":  "Do not include any explanation in the reply. \n" +
"Only include the extracted information in the reply. \n" +
"Strictly output in JSON format.",
"Version": 1,
"Active": true
},      
            ]
          }
          
        return Controller.extend("zuipdf.controller.Prompt", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Prompt").attachPatternMatched(this._onObjectMatched, this);
        },
     onSelectEntity(oEvent){
      this._onObjectMatched(oEvent);
     },
    _onObjectMatched(oEvent){
        var oModel = new sap.ui.model.json.JSONModel();
        var oFilter = [];
        var partner = (oEvent.getParameter("arguments").Partner === "X") ? "" : oEvent.getParameter("arguments").Partner;
        if (partner){
          var entity = (oEvent.getParameter("arguments").Entity) ? oEvent.getParameter("arguments").Entity : "";
          oFilter.push(new sap.ui.model.Filter("IssuerName", sap.ui.model.FilterOperator.EQ, partner) );
          oFilter.push(new sap.ui.model.Filter("Entity", sap.ui.model.FilterOperator.EQ, entity) );
        }
        else{
        var key = this.getView().byId("entitySelect").getSelectedKey();
        if (key === ""){
          key = "PURCHASE_ORDER";
        }
        oFilter.push(
          new sap.ui.model.Filter("Entity", sap.ui.model.FilterOperator.EQ, key));
      }
        this.getView().getModel("backend").read("/LLMPromptSet", {
          filters: oFilter,   
          success: (oData) => {
            if (oData && oData.results) {
              this.results = oData.results;
              const partner = oData.results.reduce((map, entry) => {
                if (!map.has(entry.IssuerName)) {
                  map.set(entry.IssuerName, entry);
                }
                return map;
              }, new Map());
            
              // Convert Map back to an array and sort alphabetically by ISSUER_NAME
              const sortedIssuers = Array.from(partner.values()).sort((a, b) => {
                return a.IssuerName.localeCompare(b.IssuerName);
              });
              oModel.setData(sortedIssuers);
              this.getView().setModel(oModel,"PartnerModel");             
            }
          },
          error: (oError) => {
            //this.getOwnerComponent()._oBusyDialog.close();
          }
        });
    },
onIssuerSelect: function (oEvent) {
    const selectedIssuer = oEvent.getSource().getBindingContext("PartnerModel").getObject();
    const detailView = this.getView().byId("detailContainer");
    this.selectedIssuer = selectedIssuer;
    // Clear previous entries
    detailView.removeAllItems();
   

    var issuer = this.results.filter(data => data.IssuerName === this.selectedIssuer.IssuerName);
    // Dynamically add labels and text areas
    issuer.forEach((label) => {
      // Create a label
      const oLabel = new sap.m.Label({
        text: label.LabelName,
        class: "sapUiSmallMarginBeginEnd"
      });
      oLabel.addStyleClass("sapUiSmallMarginBeginEnd");
      oLabel.addStyleClass("sapUiTinyMarginTop");

      // Create a text area
      const oTextArea = new sap.m.TextArea({
        value: label.Prompt,
        editable: label.Editable,
        rows: 3,
        width: "100%",
      });
      oTextArea.addStyleClass("sapUiSmallMarginBeginEnd");
      // Add them to the container
      detailView.addItem(oLabel);
      detailView.addItem(oTextArea);
    });
  },

  onSearchIssuer: function (oEvent) {
    var sQuery = oEvent.getParameter("newValue").toLowerCase(); // Get search input
    var oList = this.getView().byId("issuerList");
    var oBinding = oList.getBinding("items");

    if (oBinding) {
        var oFilter = new sap.ui.model.Filter("IssuerName", sap.ui.model.FilterOperator.Contains, sQuery);
        oBinding.filter([oFilter]); // Apply filter
    }
},
  onSave: function () {
    debugger;
   
    var oModel = this.getView().getModel("backend");
    // Get updated prompt values from UI
    var aUpdatedPrompts = this.getUpdatedPrompts(); // Get modified prompts from UI
    var sEntitySet = "/LLMPromptSet"; // OData EntitySet

    oModel.setDeferredGroups(["batchUpdate"]);

    aUpdatedPrompts.forEach(oPrompt => {
      var sPath = sEntitySet + "(IssuerName='" + encodeURIComponent(oPrompt.IssuerName) + "',Entity='" + encodeURIComponent(oPrompt.Entity) + "')";
      oModel.update(sPath, oPrompt, {
          groupId: "batchUpdate"
      });
    });
    oModel.submitChanges({
      groupId: "batchUpdate",
      success: function (oData) {
          sap.m.MessageToast.show("Prompts updated successfully!");
      },
      error: function (oError) {
          sap.m.MessageToast.show("Error updating prompts. Check logs.");
          console.error(oError);
      }
  });
    // Call OData service to update prompts (replace this with actual OData call)
    console.log("Updated Prompts:", aUpdatedPrompts);
    MessageToast.show("Changes saved successfully!");
},
getUpdatedPrompts: function () {
  var oPromptContainer = this.getView().byId("detailContainer");
  var aControls = oPromptContainer.getItems();
  var aPrompts = [];
  var labelName = "";
  aControls.forEach(oControl => {
      
      if (oControl instanceof sap.m.Label){
        labelName = oControl.getText();
      }
      if (oControl instanceof sap.m.TextArea) {
          var sValue = oControl.getValue();
          var oPromptData = this.results.find(data => data.LabelName === labelName && data.IssuerName === this.selectedIssuer.IssuerName) // Store metadata
          if (oPromptData && sValue !== oPromptData.Prompt) {
              aPrompts.push({
                  IssuerName: oPromptData.IssuerName,
                  Entity: oPromptData.Entity,
                  LabelName: oPromptData.LabelName,
                  Prompt: sValue,
                  Version: oPromptData.Version,
                  Active: oPromptData.Active
              });
          }
      }
  });
  return aPrompts;
}
});
});

  