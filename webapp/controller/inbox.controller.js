sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/PDFViewer"
  ], function (Controller, PDFViewer) {
    "use strict";
  
    return Controller.extend("myApp.controller.inbox", {
      onInit: function () {
        // OData model setup
        this.getView().byId("inboxPage").setModel(this.getOwnerComponent().getModel());
      },
  
      onViewPDF: function (oEvent) {
        // Get the selected row's data
        var oContext = oEvent.getSource().getParent().getBindingContext();
        var sPath = oContext.getPath();
        var oData = this.getView().getModel().getProperty(sPath);
  
        // Load binary PDF data using OData request
        var sPdfUrl = "/sap/opu/odata/sap/ZPDF_SERVICE/FileUpload('" + oData.fileName + "')/$value";
  
        // Display the PDF in PDFViewer
        var oPDFViewer = this.byId("pdfViewer");
        oPDFViewer.setSource(sPdfUrl);
        oPDFViewer.open();
      }
    });
  });
  