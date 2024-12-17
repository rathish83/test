sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/PDFViewer","sap/m/MessageToast"
],
function (Controller,PDFViewer,MessageToast,) {
    "use strict";

    return Controller.extend("zuipdf.controller.View1", {
        onInit: function () {
          var oData = {
            entityOptions: [
              { key: "PURCHASE_ORDER", text: "PURCHASE ORDER" },
              { key: "INVOICE", text: "INVOICE" }
            ],
            modelOptions: [
              { key: "gpt-4o-2024-08-06", text: "GPT-4o" },
              { key: "nemo.mistral-nemo-12b-instruct", text: "NEMO - NVIDIA & MISTRAL" },
              { key: "nemo.mistralai/mistral-7b-instruct-v0.3", text: "NEMO - MISTRAL-V0.3" },     
              { key: "nemo.meta/llama-3.1-70b-instruct", text: "NGC - NEMO - META-LLAMA" },     
              { key: "nemo.nvdev/nvidia/llama-3.1-nemotron-70b-instruct", text: "NEMO - NVIDIA & LLAMA" }
            ]
          };
           this.getView().byId("page").setModel(this.getOwnerComponent().getModel());
           
            // Create a JSONModel and set it to the view
            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
            var oPDFViewer = this.getView().byId("pdfViewer");
            var label_po = this.getView().byId("po_number");
            var that = this;
            // If you have a PDF URL or file to load, set the source after rendering
            this.getView().addEventDelegate({
              onAfterRendering: function() {
                // oPDFViewer.setSource("");  // Set the PDF file path
                oPDFViewer.setTitle("PDF Preview");
              }
            });

 
             // JSON data representing an array of Purchase Orders or a single Purchase Order
    const purchaseOrderData = [
        {'Page_Number': 1, 'Entity': {'invoice_number': '145874', 'invoice_date': '5/13/2024', 'issuer': {'name': 'Microway', 'address': '12 RICHARDS ROAD\nPLYMOUTH MA 02360', 'phone_number': 'None', 'email': 'None', 'vat_number': 'None'}, 'ship_to': {'name': 'Amazon.com Services LLC', 'address': '12521 128th Lane NE\nAttn: AKME Receiving Team - PUR-47288\nKirkland WA 98034', 'phone_number': 'None', 'email': 'https://payeecentral.amazon.com/Invoices'}, 'bill_to': {'name': 'Amazon.com Services LLC', 'address': '12521 128th Lane NE\nAttn: AKME Receiving Team - PUR-47288\nKirkland WA 98034', 'phone_number': 'None', 'email': 'https://payeecentral.amazon.com/Invoices'}, 'items': [{'part_number': '01001', 'description': 'SYSTEM SERIAL NUMBER', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '010011', 'description': 'LIMITED 3 YEAR WARRANTY', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22164', 'description': 'MICROWAY TOWER WHISPERSTATION CHASSIS', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22328', 'description': '1600W HIGH-EFFICIENCY QUIET POWER SUPPLY', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22257', 'description': 'NAVION DUAL AMD EPYC MB', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '18903', 'description': '8-PIN POWER ADAPTER FOR TESLA K80 GPU', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '21959', 'description': "AMD EPYC 9254 'GENOA' 2.90 GHz 24-CORE\nCP", 'quantity': 2, 'unit_price': 0, 'total_price': 0}, {'part_number': '21998', 'description': '64GB DDR5 4800 MHz ECC/REGISTERED MEMORY', 'quantity': 24, 'unit_price': 0, 'total_price': 0}, {'part_number': '22281', 'description': 'AMD GENOA SP5 4U/WS HEAT SINK', 'quantity': 2, 'unit_price': 0, 'total_price': 0}, {'part_number': '22109', 'description': 'SEAGATE FIRECUDA 530 SERIES 2TB M.2\nCLIEN', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22516', 'description': '8TB SEAGATE ENT 3.5" EXOS 7E10 SATA HD', 'quantity': 2, 'unit_price': 0, 'total_price': 0}, {'part_number': '19022', 'description': 'MEGARAID 8-PORT 12Gbps SAS/SATA RAID\nCONT', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '18680', 'description': 'MINISAS HD TO 4 SATA 90/90/75/75CM W/ SB', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22072', 'description': 'NVIDIA "LOVELACE" RTX 6000 ADA GEN 48GB', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '0012NVB', 'description': 'Boost Rebate RTX 6000 Ada Gen', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22041', 'description': 'NVIDIA T400 PCI-E 3.0 4GB GDDR6 PROFESSIO', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '21286', 'description': 'STARTECH 7.1 CHANNEL SOUND CARD', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '21882', 'description': 'LG DUAL LAYER 24X DVD/CD BURNER (BLACK)', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '22280', 'description': '140MM EK-LOOP FAN, 600-2200 RPM', 'quantity': 6, 'unit_price': 0, 'total_price': 0}, {'part_number': '18048', 'description': '24 PIN MOTHERBOARD EXTENSION CABLE\n50 CM', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '82006-0A', 'description': 'USB/FIREWIRE EXTENSION CABLE ASSY', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '21674', 'description': 'MS WINDOWS 11 64-BIT (PROFESSIONAL\nEDITIO', 'quantity': 1, 'unit_price': 0, 'total_price': 0}, {'part_number': '21913', 'description': 'TPM 2.0 MODULE FOR GIGABYTE MB', 'quantity': 1, 'unit_price': 0, 'total_price': 0}], 'total_amount': 24994, 'notes': 'UPS TRACKING# 1ZG6439V122992337', 'confidence': '0.95'}}
        // Add additional objects as needed
    ];
    this.renderSimpleFormElements(purchaseOrderData,this);
           
      },
  
      
  onUpload: function() {
      var oView = this.getView();
      var oModel = new sap.ui.model.json.JSONModel();
              //oModel.setData(Object.entries(response));
      oModel.setData([]);
      this.getView().setModel(oModel,"purchaseOrderModel");
      var selectedEntity = this.getView().byId("entitySelect").getSelectedKey();
      var selectedModel = this.getView().byId("modelSelect").getSelectedKey();
      var fileUploader = this.byId("fileUploader");
      var file = fileUploader.oFileUpload.files[0];

      if (!file) {
        MessageToast.show("Please select a file.");
        return;
      }

      // Create FormData to send file and additional input data
      var formData = new FormData();
      formData.append("file", file);
      var json_data = {"Entity": selectedEntity,"Model": selectedModel,"UICall": true, "filter_product": this.getView().byId("chkBoxProdFilter").getSelected()};
      formData.append("input", JSON.stringify(json_data));

      var reader = new FileReader();
      var that = this;
      
      reader.onload = function(e) {
        // Once the file is loaded, we can set the source of the PDFViewer
        var pdfContent = e.target.result;
        var base64EncodedPDF = pdfContent.replace("data:application/pdf;base64,","");
        var decodedPdfContent = atob(base64EncodedPDF);
        var byteArray = new Uint8Array(decodedPdfContent.length)
        for(var i=0; i<decodedPdfContent.length; i++){
            byteArray[i] = decodedPdfContent.charCodeAt(i);
        }
        // Create a blob from the ArrayBuffer content
        var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
            
      var url = URL.createObjectURL(blob);
    
      var pdfViewer = that.getView().byId("pdfViewer").setVisible(false);
      that.getView().byId("pdfBox").removeAllItems();
      that.getView().byId("po_number").removeStyleClass();
      that.getView().byId("po_date").removeStyleClass();
        //this._sValidPath = sap.ui.require.toUrl("zuipdf/files/" + that.getView().byId("fileUploader").oFileUpload.files[0].name);
        this._sValidPath = sap.ui.require.toUrl(url); 
        //this._sInvalidPath = sap.ui.require.toUrl("sap/m/sample/PDFViewerEmbedded/sample_nonexisting.pdf");
        that._oModel = new sap.ui.model.json.JSONModel({
          Source: this._sValidPath,
          Title: "My Custom Title",
          Height: "600px"
        });
        that.getView().setModel(that._oModel,"PDFModel");
        jQuery.sap.addUrlWhitelist("blob");

        that.getView().setBusy(true);
        var oController = that;
        that.onPostPDF(oController,formData,that);
        
        sap.m.MessageToast.show("File loaded into PDF Viewer successfully!");
        if(!this._PDFViewer){
          this._PDFViewer = new sap.m.PDFViewer({
              width:"auto",
              isTrustedSource:true,
              source:url // my blob url
          });
          jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
     }
     else{
      this._PDFViewer.setSource(url);
     }
    /* this._PDFViewer.downloadPDF = function(){
     File.save(
         byteArray.buffer,
         "Hello_UI5",
         "pdf",
         "application/pdf"
         );
     }; */
     this._PDFViewer.setTitle(file.name);  // Set the title of the PDF viewer to the file name
     that.getView().byId("pdfBox").addItem(this._PDFViewer);
    };

      
     reader.onerror = function(e) {
        MessageToast.show("Error reading the file." +e);
        oView.setBusy(false);
      };

      reader.readAsDataURL(file);  // Read the file as a data URL to display in PDF viewer
    

      // Make AJAX call to REST API
    
  },
  onNavigate(oEvent){
    this.getOwnerComponent().getRouter().navTo("inbox");
  },

  onPostPDF(oController,formData,that){
     var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");             
     var appPath = appId.replaceAll(".", "/");              
     var appModulePath = jQuery.sap.getModulePath(appPath);
     var url = appModulePath + "/upload_pdf"
     
     console.log("App Path"+ url)
     // Start time measurement
     var startTime = performance.now();  // Use performance.now() for precise measurement
      $.ajax({
          url: url,  // Replace with your REST API endpoint
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          timeout: 1200000,
          success: function(response) {
          // End time measurement
          var endTime = performance.now();
          var timeTaken = endTime - startTime;  
          var oModel = new sap.ui.model.json.JSONModel({"timeTaken": (timeTaken / 1000).toFixed(2)});
          that.getView().setModel(oModel,"MeasureModel");
          that.renderSimpleFormElements(response[0],that);
          that.getView().setBusy(false);
            try{
            if (response.error) {
              MessageToast.show("Error: " + response.error);
            } else {
              // Bind Header Data
              var oModel = new sap.ui.model.json.JSONModel();
              that.currentIndex = 1;
              that.data = response;
              
              that.totalIndex = that.data.length - 1;
              oModel.setData(response[0]);
              that.getView().setModel(oModel,"OrderModel");
              var index = that.currentIndex;
              var header = "Pages" + " : " + index + " / " + ( that.totalIndex + 1 );
              that.getView().byId("headerInfo").setText(header);
              /* var jsonArray = Object.entries(response);
              that.getView().setModel(oModel,"itemModel");
              if(jsonArray){
                var poItems= [];
                for(var i=0;i<jsonArray.length;i++){
                  var items = jsonArray[i][1].Entity.items;
                  for(var j=0;j<items.length;j++){
                   if(items[j].part_number === undefined || items[j].part_number === null ){
                    items[j].part_number = items[j].item_number;
                   }
                  }
                }
                oModel.setData(poItems);
                that.getView().setModel(oModel,"itemModel");
              } 
              */
             /* var oModel = new sap.ui.model.json.JSONModel();
              oModel.setData(response);
              that.getView().setModel(oModel,"OrderModel"); */

              // Bind Items Data
   
              sap.m.MessageToast.show("File parsed successfully!");
            }
          }catch(e){
            sap.m.MessageToast.show("Please retry again!!!");
          }
          },
          error: function(e) {
         
            that.getView().setBusy(false);          
            sap.m.MessageToast.show("Error uploading file."+ e.responseJSON["detail"]);
          }
        });
  },
  onPreviousOrder(){
    if(this.currentIndex > 1){
     var oModel = new sap.ui.model.json.JSONModel();
     oModel.setData({"previosBtn":true,"currentIndex": this.currentIndex - 1});
     this.getView().setModel(oModel,"viewModel");
     let index = this.currentIndex - 1;
     this.renderSimpleFormElements(this.data[index]);
      this.currentIndex = this.currentIndex - 1; 
     var header = "Pages" + " : " + index + " / " + ( this.totalIndex + 1 );
     this.getView().byId("headerInfo").setText(header);     
     var oModel = new sap.ui.model.json.JSONModel();     
     oModel.setData(this.data[this.currentIndex - 1]);
     this.getView().setModel(oModel,"OrderModel");   
     
    }
    else{
      this.getView().getModel("viewModel").setProperty("previosBtn",false);
      sap.m.MessageToast.show("Reached Beginning of Page");
    }
  },

  onNextOrder(){
    if(this.currentIndex <= this.totalIndex){
    var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData({"nextBtn":true, "currentIndex": this.currentIndex + 1, "totalIndex": this.totalIndex});
    this.getView().setModel(oModel,"viewModel");
    let index = this.currentIndex + 1;
    var header = "Pages" + " : " + index + " / " + ( this.totalIndex + 1 );
    this.renderSimpleFormElements(this.data[this.currentIndex]);
    this.currentIndex = this.currentIndex + 1;
    this.getView().byId("headerInfo").setText(header);    
    var oModel = new sap.ui.model.json.JSONModel();     
    oModel.setData(this.data[this.currentIndex - 1]);
    
    
    this.getView().setModel(oModel,"OrderModel");     
    }
    else{
      this.getView().getModel("viewModel").setProperty("nextBtn",false);   
      sap.m.MessageToast.show("Reached End of Page");      
    }
  },
  onGetConfidenceClass(confidence) {
    if (confidence >= 0.75) {
      return "confidence-high";    // High confidence
    } else if (confidence >= 0.5) {
      return "confidence-medium";  // Medium confidence
    } else {
      return "confidence-low";     // Low confidence
    }
  },

  renderSimpleFormElements: function(data) {
    const simpleForm = this.getView().byId("simpleForm");
    simpleForm.removeAllContent(); // Clear any previous content

    const isArray = Array.isArray(data);
    const purchaseOrders = isArray ? data : [data]; // Ensure data is processed as an array
    let lineCounter = 0; // Counter to track the number of lines added

    purchaseOrders.forEach((poData, index) => {

        lineCounter += 2; // Page No label + text counts as two lines

        // Access Entity data and loop through it
        const entityData = poData.Entity;
        for (const key in entityData ) {
            
            if (entityData.hasOwnProperty(key) && !key.includes("confidence")) {
                const value = entityData[key];

                // Insert a title every 9 lines
                if (lineCounter >= 9) {
                    simpleForm.addContent(new sap.ui.core.Title());
                    lineCounter = 0; // Reset counter after adding the title
                }

                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    // For nested objects, add a header label
                    simpleForm.addContent(new sap.m.Label({ 
                      text: this.toPascalCase(key),
                      design: sap.m.LabelDesign.Bold // Make label text bol
                    }));
                    simpleForm.addContent(new sap.m.Text({ text: "" }));
                    lineCounter += 1; // Increment lineCounter for header label

                    // Iterate over nested properties
                    for (const subKey in value) {
                        if (value.hasOwnProperty(subKey)) {
                            this.createSimpleFormField(simpleForm, subKey, value[subKey]);
                            lineCounter += 2; // Each field (label + text) counts as two lines
                        }
                    }
                } else if (Array.isArray(value)) {
                    // Handle array fields, e.g., `items`
                    simpleForm.addContent(new sap.m.Label({ 
                      text: `${key.toUpperCase()}: (Items not expanded)` }));
                    lineCounter += 1; // Array label counts as one line
                } else {
                    // For primitive values, add a regular form element
                    this.createSimpleFormField(simpleForm, key, value);
                    lineCounter += 2; // Each field (label + text) counts as two lines
                }
            }
        }
    });
},

createSimpleFormField: function(form, labelText, value) {
    const label = new sap.m.Label({ 
      text: this.toPascalCase(labelText),
      design: sap.m.LabelDesign.Bold // Make label text bol
    });
    const text = new sap.m.Input({ value: value !== null ? value.toString() : "" });

    form.addContent(label);
    form.addContent(text);
},
// Helper function to convert text to Pascal case
toPascalCase: function(str) {
  return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+\w)/g, match => match.toUpperCase())
      .replace(/\s+/g, '');
}
      });
});


