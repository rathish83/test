sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessagePopover",
    "sap/ui/core/ValueState",
    "sap/ui/core/MessageType",
    "sap/m/MessageItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter,NumberFormat,FilterOperator,JSONModel,MessagePopover,ValueState,MessageType,MessageItem) {
        "use strict";
 
        return Controller.extend("zuipdf.controller.PoHeader", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("PoDetails").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched(oEvent){
            var Guid = (oEvent.getParameter("arguments").Guid) ? oEvent.getParameter("arguments").Guid : "";
			      var FileName = (oEvent.getParameter("arguments").fileName) ? oEvent.getParameter("arguments").fileName : "";
            this.onViewPDF(Guid,FileName);
            this.onViewPDFData(Guid,FileName);
            this.oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(new JSONModel({ messages: [] }), "messageModel");
            this.getView().setModel(new JSONModel({ }), "headerState");
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              globalFilter: "",
              availabilityFilterOn: false,
              cellFilterOn: false
            }), "ui");
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              Name: "",
              Country: "",
              State: "",
              Vkorg:"",
              Street:"",
            }), "DialogHeader");
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              Material: "",
              Description: "",
              Vkorg:"",
            }), "MaterialDialogHeader");
            
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData([]);
            this.getView().setModel(oModel, "DropDownModel");
        },
        onBack: function(oEvent){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("PoInbox");
          },
        
		filterGlobally: function(oEvent) {
      debugger;
			const sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("PartnerName", FilterOperator.Contains, sQuery),
					new Filter("State", FilterOperator.Contains, sQuery),
          new Filter("Country", FilterOperator.Contains, sQuery),
          new Filter("Street", FilterOperator.Contains, sQuery)
				], false);
			}

      sap.ui.getCore().byId("soldToTable").getBinding().filter(this._oGlobalFilter, "Application");
		},
        onViewPDFData: function(Guid,FileName){
          var messages = []
            this.getView().setModel(this.getOwnerComponent().getModel("backend"),"backend");
           
            var oFilter = [
                new sap.ui.model.Filter("guid", sap.ui.model.FilterOperator.EQ, Guid),
                new sap.ui.model.Filter("fileName", sap.ui.model.FilterOperator.EQ, FileName)
                
              ];
            var selectedPO = this.getView().getModel("App").getProperty("/row");
            var oModel = new sap.ui.model.json.JSONModel(selectedPO);
            if(selectedPO.Status === 'INITIAL'){
            selectedPO["OrderType"] = "ZCO";
            selectedPO["PoType"] = "ZXLS";
            selectedPO["SalesArea"] = "IL00";
            selectedPO["Priority"] = "Standard";
            selectedPO["Plant"] = "5020";
            selectedPO["OrderReason"] = "";
            }
            var that = this;
            this.getView().setModel(oModel,"HeaderModel");
            var header = {};
            this.getView().getModel("backend").read("/DocumentStoreSet", {
                      filters: oFilter,                
                      success: (oData) => {
                        if (oData && oData.results) {
                          var oModel = new sap.ui.model.json.JSONModel();
                          oModel.setData(oData.results);
                          var items = [];
                          if(oData.results[0].UpdatedJson){
                            var entity = JSON.parse(oData.results[0].UpdatedJson);
                            var headerPartner = entity["HeaderPartnerData"];

                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(headerPartner);
                            that.getView().setModel(oModel, "HeaderPartnerModel");

                            header = entity["HeaderData"];

                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(header);
                            that.getView().setModel(oModel, "HeaderModel");

                            var item = entity["ItemData"];

                            oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(item);
                            that.getView().setModel(oModel, "ItemModel");
                            
                            var partner = entity["Partner"];
                            oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(partner);
                            that.getView().setModel(oModel, "PartnerFunctionModel");
                            var filter = [
                              new sap.ui.model.Filter("PartnerNumber", sap.ui.model.FilterOperator.EQ, headerPartner.SoldTo),
                              new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, header["SalesArea"])
                            ];
                            this.onDropDownPartner(filter) ;                              
                          } 
                          else{
                            var entity = JSON.parse(oData.results[0].jsonString);
                            for(var i = 0; i<entity.length; i++){
                              for(var j = 0;j<entity[i]["Entity"]["items"].length;j++){                               
                                  items.push(entity[i]["Entity"]["items"][j]);
                              }
                            }
                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(items);
                            that.getView().setModel(oModel, "ItemModel");
                            if(selectedPO.Kunnr != ""){
                             this.onLoadPartnerDetails({"PartnerNumer": selectedPO.Kunnr},"TABLE");      
                            }                     
                          }                       
                        }
                        if (Object.keys(header).length === 0){
                         header = this.getView().getModel("HeaderModel").getData();
                        }
                        messages = this.onValidateHeader(header);
                        this.onValidateItems(items,messages);
                        if(selectedPO.Kunnr != ""){                        
                          this.getView().byId("lblBuyer").setVisible(false);
                          this.getView().byId("btnDerive").setVisible(false);
                        }
                        else{
                          this.getView().byId("lblBuyer").setVisible(true);
                          this.getView().byId("btnDerive").setVisible(true);
                        }
                      error: (oError) => {
                        //this.getOwnerComponent()._oBusyDialog.close();
                      }
                    }
                  });
                  
        },
        isValidDate : function (dateString) {
          if (!dateString || typeof dateString !== 'string') {
            return false;
          }
          
          const regex = /^\d{2}-\d{2}-\d{4}$/;
          
          if (!regex.test(dateString)) {
            return false;
          }
          
          const date = new Date(dateString);
          return date
        },

        onValidateHeader: function(header){

          var headerState = {};
          
          var aMessages = [];
          if (!header.PoDate) {
            headerState["poDateValueState"] = "Warning"
            headerState["poDateValueStateText"] = "Missing PO Date in Header Section"
            this.getView().setModel(new JSONModel(headerState), "headerState");
            this.getView
            aMessages.push({
              type: sap.ui.core.MessageType.Warning,
              title: `Missing PO Date in Header Section`,
              description: `PO Date is missing`,
              section: "headerPanel"
            });
          }
          if (!this.isValidDate(header.PoDate)){
            headerState["poDateValueState"] = "Warning"
            headerState["poDateValueStateText"] = "Should be in dd-mm-yyyy format"
            this.getView().setModel(new JSONModel(headerState), "headerState");
            aMessages.push({
              type: sap.ui.core.MessageType.Warning,
              title: `Invalid PO Date Format`,
              description: `PO Date "${header.PoDate}" should be in dd-mm-yyyy format.`,
              section: "headerPanel"
            });
          }
          if(aMessages.length > 0){
            this._createMessagePopover(aMessages); }
            return aMessages;
        },

        onValidateItems: function(items,aMessages){
          var oFilter = [];
          items.forEach(function(oItem) {
            if (oItem.part_number !== null) {
              oFilter.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, oItem.part_number));             
            }
          }); 
          var uri = "/MaterialReadSet";
          var that = this;
         
          this.getView().getModel("salesOrder").read(uri, { filters : oFilter,
                success: function(oData){
                 
                  const materialMap = new Map(oData.results.map(mat => [mat.Material, mat.Valid]));

                  const updatedDetails = items.map((detail,index) => {
                    const isValid = materialMap.get(detail.part_number);
                    if (!isValid) {
                      aMessages.push({
                        type: sap.ui.core.MessageType.Error,
                        title: `Invalid Material in Item ${index + 1}`,
                        description: `Material Number ${detail.part_number} is invalid.`,
                        section: "itemSection"
                      });
                    }
                  
                    return {
                      ...detail,
                      ValueState: isValid ? 'None' : 'Error',
                      ValueStateText: isValid ? '' : 'Invalid Material'
                    };
                   
                  });
                  var oModel = new sap.ui.model.json.JSONModel();
                  if(updatedDetails.length){
                   oModel.setData(updatedDetails);
                   that.getView().setModel(oModel, "ItemModel");
                  }
                   that._createMessagePopover(aMessages);
                },
               
          });
          
        },
        _createMessagePopover: function(messages) {
          this.oMessagePopover = new MessagePopover({
            items: {
              path: "messageModel>/messages",
              template: new MessageItem({
                type: "{messageModel>type}",
                title: "{messageModel>title}",
                description: "{messageModel>description}",
                subtitle: "{messageModel>section}"               
              })
            },
            itemSelect: this.handleMessageSelect.bind(this)
   
          });
          this.getView().byId("popOverBtn").addDependent(this.oMessagePopover);
          const hasErrors = messages.some(message => message.type === sap.ui.core.MessageType.Error);
          const hasWarnings = messages.some(message => message.type === sap.ui.core.MessageType.Warning);
          const oMessageModel = new sap.ui.model.json.JSONModel({ messages: messages , hasErrors: hasErrors, hasWarnings: hasWarnings });
          this.getView().setModel(oMessageModel, "messageModel");

        },
        handleMessagePopoverPress: function (oEvent) {
            // Open the MessagePopover
           this.oMessagePopover.openBy(oEvent.getSource());
        },
        handleMessageSelect: function(oEvent) {
          const oMessage = oEvent.getParameter("item").getBindingContext("messageModel").getObject();
          
        const sSectionId = oMessage.section;

        if (sSectionId) {
          const oSection = this.getView().byId(sSectionId);
          if (oSection) {
            oSection.getDomRef().scrollIntoView({ behavior: "smooth" });
          }
        }
        },
        onTrain: function(oEvent){
          /* var oParams = {};
          const oRouter = this.getOwnerComponent().getRouter();
          var selectedPo = this.getView().getModel("HeaderModel").getData();
          oParams["Partner"] = selectedPo.BuyerName;      
          oParams["Entity"] = 'PURCHASE_ORDER';    
          oRouter.navTo("Prompt",oParams); */
          var selectedPo = this.getView().getModel("HeaderModel").getData();
          this.sematictNavigation("Prompt", "Display", {"Partner": selectedPo.BuyerName, "Entity": "PURCHASE_ORDER" });
        },
        
        sematictNavigation: function (pSemantic, pAction, navParams) {
          // get a handle on the global XAppNav service
          try {
              var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
              oCrossAppNavigator.isIntentSupported([pSemantic - pAction])
                  .done(function (aResponses) {
    
                  })
                  .fail(function () {
                      new sap.m.MessageToast("Provide corresponding intent to navigate");
                  });
          } catch (error) {
    
          }
          // generate the Hash to display a employee Id
          var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
              target: { 
                  semanticObject: pSemantic,
                  action: pAction
              },
              params: navParams
          })) || "";
          //Generate a  URL for the second application
          var url = window.location.href.split('#')[0] + hash;
          //Navigate to second app
          sap.m.URLHelper.redirect(url);
      },
        onMaterialChange: function(oEvent){
          var oInput = oEvent.getSource();
          var sValue = oInput.getValue();
          var oBindingContext = oInput.getBindingContext();

          this.onValidateMaterial(sValue,oInput);
          // Material number validation (example: numeric and length check)
        

        
        },
        onValidateMaterial: function(sValue,oInput){

          var uri = "/MaterialReadSet('"+sValue+"')";
          this.getView().getModel("salesOrder").read(uri,{ 
            success: function(oDATA){
              if (oDATA["Valid"]) {
                oInput.setProperty("valueState", ValueState.None);
                oInput.setProperty("valueStateText", "");
            } else {
              oInput.setProperty("valueState", ValueState.Error);
              oInput.setProperty("valueStateText", "Invalid Material Number.");            
            }
            }
          });
        },
        onViewPDF: function(Guid,FileName){
            debugger;
            
            // Fetch PDF binary data
            var source = this.getView().getModel("backend").sServiceUrl
            var pdfKey = Guid + ',' + FileName
            var sServiceUrl = source + `/FileUploadSet('${pdfKey}')/$value`; // Endpoint to fetch binary data
            this.getView().byId("pdfViewer").setVisible(false);
            this.getView().byId("pdfBox").removeAllItems();
            if(!this._PDFViewer){
              this._PDFViewer = new sap.m.PDFViewer({
                  width:"auto",
                  isTrustedSource:true,
                  source:sServiceUrl // my blob url
              });
              jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
         }
         else{
          this._PDFViewer.setSource(sServiceUrl);
         }
           this.getView().byId("pdfBox").addItem(this._PDFViewer);
        // Bind Header Data
          
          },
          onGetF4HelpData: function(name){
            var headerModel = this.getView().getModel("HeaderModel").getData();
            var oFilter = [
              new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, name)];
            var header = this.getView().getModel("DialogHeader").getData();
            
            if(headerModel.SalesArea){
              var lv_sorg = headerModel.SalesArea;
              oFilter.push(new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, lv_sorg));
            }
            if(header.Name){
             var lv_name = header.Name;
             oFilter.push( new sap.ui.model.Filter("PartnerName", sap.ui.model.FilterOperator.Contains, lv_name));   
            }
            if(header.State){
              var lv_state = header.State;
              oFilter.push(new sap.ui.model.Filter("State", sap.ui.model.FilterOperator.Contains, lv_state));
            }
            if(header.Country){
              var lv_country = header.Country;
              oFilter.push(new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.Contains, lv_country));
            }
            if(header.Street){
              var lv_street = header.Street;
              oFilter.push(new sap.ui.model.Filter("Street", sap.ui.model.FilterOperator.Contains, lv_street));
            }
            var that = this;
            this.getView().getModel("backend").read("/SoldToSet", {
              filters: oFilter,                
              success: (oData) => {
                if (oData && oData.results) {

                  that.onNavigateSoldTo(oData.results)
                }
              error: (oError) => {
                //this.getOwnerComponent()._oBusyDialog.close();
              }
            }
          })
          },

          onValueHelpRequest: function(oEvent){
            this.id = oEvent.getSource().getId().split("--")[2];
            var results = this.onGetF4HelpData(this.id);
            this.onNavigateSoldTo(results);           
          },
          onSearchMaterialF4: function(oEvent){
            var results = this.onValueHelpMaterial();
            this.onNavigateMatnrF4(results);
          },
          onSearchF4: function(oEvent){
           
            var results = this.onGetF4HelpData(this.id) ;
            this.onNavigateSoldTo(results);       
          },
          onPartnerF4Data: function(selectedPo,id){
            this.id = id;
            var oFilter = [
              new sap.ui.model.Filter("Guid", sap.ui.model.FilterOperator.EQ, selectedPo.Docguid),
              new sap.ui.model.Filter("FileName", sap.ui.model.FilterOperator.EQ, selectedPo.FileName)
              
            ];
            if (this.derive){
              
              if(selectedPo.BuyerStreetName){
                let street = selectedPo.BuyerStreetName.split(" ");
                street[0] = street[0].replace(",","");
                this.getView().getModel("DialogHeader").setProperty("/Street",street[0]);
                oFilter.push(new sap.ui.model.Filter("Street", sap.ui.model.FilterOperator.Contains, street[0]));
              }
                          
            }
            
                var that = this;
                this.getView().getModel("backend").read("/SoldToSet", {
                  filters: oFilter,                
                  success: (oData) => {
                    if (oData && oData.results) {
                     
                      that.onNavigateSoldTo(oData.results)
                    }
                  error: (oError) => {
                    //this.getOwnerComponent()._oBusyDialog.close();
                  }
                }
              })
               
          },
          onDerivePartner: function(oEvent){
            this.id = "SP";
            var selectedPo = this.getView().getModel("HeaderModel").getData();
            this.derive = true;
            this.onPartnerF4Data(selectedPo,"SP");
            this.derive = false;
          },
          onPartnerF4Help: function(oEvent){
            debugger;
            var oContext = oEvent.getSource().getBindingContext("PartnerFunctionModel");
            var data = oContext.getObject();
            this.partnerF4sPath = oContext.getPath();
            var selectedPo = this.getView().getModel("HeaderModel").getData();
            this.onPartnerF4Data(selectedPo,data.PartnerFunction);
          },
          onChangePoDate: function (oEvent) {
           var header =  this.getView().getModel("HeaderModel").getData();
            if(this.isValidDate(header.PoDate)){
              this.getView().getModel("HeaderModel").setProperty("/poDateValueState", "None");
              this.getView().getModel("HeaderModel").setProperty("/poDateValueStateText", "");
            }
          },
          onSalesAreaChange: function (oEvent) {
            debugger;
            var selectedKey = oEvent.getSource().getSelectedKey();
            this.getView().getModel("HeaderModel").setProperty("/SalesArea", selectedKey);
            console.log("Selected SalesArea:", selectedKey);
          },

          onSoldToDialogConfirm: function(oEvent){
            debugger;
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              Name: "",
              Country: "",
              State: "",
              Vkorg:"",
            }), "DialogHeader");
            var idx = sap.ui.getCore().byId("soldToTable").getSelectedIndex();
            var row = sap.ui.getCore().byId("soldToTable").getContextByIndex(idx).getObject();
            if(this.id === 'SP'){
              this.onLoadPartnerDetails(row,"DIALOG");
            }
            else{
              this.onUpdatePartner(row);
            }
          },

          onUpdatePartner(row){
            
          },
          onLoadPartnerDetails(row,lv_action){
            var lv_guid = "", lv_fName = "",lv_partnerNumber = ""
            if(lv_action === 'TABLE'){
              lv_partnerNumber = row.PartnerNumber;
            }
            else{
              lv_partnerNumber = row.PartnerNumber;
            }
            var header = this.getView().getModel("HeaderModel").getData();
            var lv_vkorg = header.SalesArea;
            var url = "/PartnerDetailsSet(SoldTo='" + lv_partnerNumber + "',Vkorg='" + lv_vkorg + "',Guid='" + lv_guid + "',FileName='" + lv_fName + "')";
            var that = this;
            this.getView().getModel("backend").read(url, {              
              success: (oData) => {
                if (oData) {
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(oData);
                  that.getView().setModel(oModel, "HeaderPartnerModel");
                  this.SoldToDialog.close();
                  that.getView().byId("lblBuyer").setVisible(false);
                  that.getView().byId("btnDerive").setVisible(false);
                }
              error: (oError) => {
                debugger;
                //this.getOwnerComponent()._oBusyDialog.close();
              }
            }
          })
          var filter = [
            new sap.ui.model.Filter("PartnerNumber", sap.ui.model.FilterOperator.EQ, row.PartnerNumber),
            new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, lv_vkorg)
          ];
          this.onDropDownPartner(filter) ;     
         
          this.getView().getModel("backend").read("/PFSet", {
            filters: filter,              
            success: (oData) => {
              if (oData && oData.results) {
                var oModel = new sap.ui.model.json.JSONModel();
                var items = {"items": oData.results }
                oModel.setData(items);
                this.getView().setModel(oModel, "PartnerFunctionModel");
              }
            error: (oError) => {
              debugger;
              //this.getOwnerComponent()._oBusyDialog.close();
            }
          }
        }) 

          },
          onDropDownPartner: function(oFilter){
            this.getView().getModel("backend").read("/PFDropDownSet", {
              filters: oFilter,                
              success: (oData) => {
                if (oData && oData.results) {
                  var oModel = new sap.ui.model.json.JSONModel();
                  oModel.setData(oData.results);
                  this.getView().setModel(oModel, "DropDownModel");
                }
              error: (oError) => {
                //this.getOwnerComponent()._oBusyDialog.close();
              }
            }
          })
          },
          onValueHelpMaterial: function(oEvent){
            
            var header = this.getView().getModel("MaterialDialogHeader").getData();
            var oFilter = [];
            if(header.Material){
              oFilter.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, header.Material));
            }

            oFilter.push(new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, 'IL00'));

            if(header.Description){
             oFilter.push( new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, header.Description));   
            }

            var that = this;
            this.getView().getModel("backend").read("/MatnrF4Set", {
              filters: oFilter,                
              success: (oData) => {
                if (oData && oData.results) {
                  that.onNavigateMatnrF4(oData.results)
                }
              error: (oError) => {
                //this.getOwnerComponent()._oBusyDialog.close();
              }
            }    
          })            
          },
          onNavigateMatnrF4: function(results){
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(results);
          
            if (!this.MatnrDialog) {
              this.MatnrDialog = sap.ui.xmlfragment("zuipdf.dialog.MatnrF4Dialog", this);
              this.getView().byId("poDetails").addDependent(this.MatnrDialog);
           }
           sap.ui.getCore().byId("MatnrF4Dialog").setModel(oModel, "MaterialModel");
           this.MatnrDialog.open();
          },
          onNavigateSoldTo: function(results){
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(results);
              
                if (!this.SoldToDialog) {
                  this.SoldToDialog = sap.ui.xmlfragment("zuipdf.dialog.SoldToDialog", this);
                  this.getView().byId("poDetails").addDependent(this.SoldToDialog);
               }
               sap.ui.getCore().byId("SoldtoDialog").setModel(oModel, "SoldToModel");

               this.SoldToDialog.open();
          },

          onSoldToDialogClose: function(oEvent){
            this.SoldToDialog.close();
          },
          onMaterialDialogConfirm: function(oEvent){

          },
          onSimulateDialogConfirm: function(oEvent){
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData([]);
            sap.ui.getCore().byId("SimulateDialog").setModel(oModel, "SimulateModel");
            this.SimualteDialog.close();
          },

          onMaterialDialogClose: function(oEvent){
            this.MatnrDialog.close();
          },
          onAddPartner: function () {
            var oModel = this.getView().getModel("PartnerFunctionModel");
            var aPartners = oModel.getData("/items")

            aPartners.items.push({
                "PartnerFunction": "",
                "PartnerNumber": "",
                "PartnerName": "",
                "Address": "",
                "Country": ""
            });

            oModel.setProperty("/items", aPartners.items);
            sap.m.MessageToast.show("Partner added successfully.");
        },

        onAddItem: function(oEvent){
          var oModel = this.getView().getModel("ItemModel");
          var aItems = oModel.getData()

          aItems.push({
              "part_number": "",
              "description": "",
              "quantity": "",
              "unit_price": "",
              "total_price": ""
          });

          oModel.setData(aItems, "ItemModel");
          sap.m.MessageToast.show("Item added successfully.");
        },

        onBack: function(oEvent){
          this.getView().getModel("HeaderModel").setData({});
          var headerPartnerModel = this.getView().getModel("HeaderPartnerModel");
          if(headerPartnerModel.getData()){
            headerPartnerModel.setData({});
          }
          this.getView().getModel("ItemModel").setData([]);
          if(this.getView().getModel("PartnerFunctionModel").getData()){
           this.getView().getModel("PartnerFunctionModel").setData([]);
          }
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("PoInbox");
        },

        onPartnerValueHelpRequest: function(oEvent){
          debugger;
        },
        
        onApprove: function(oEvent){
          var header = this.getView().getModel("HeaderModel").getData();
          var items = this.getView().getModel("ItemModel").getData();
          var partners = this.getView().getModel("PartnerFunctionModel").getProperty("/items");
          var headerPartners = this.getView().getModel("HeaderPartnerModel").getData();
          
          
          var oModel = this.getView().getModel("salesOrder");
          var action = oEvent.getSource().getText() === 'Simulate' ? true: false;
          var sODataDate  = "";
          // Convert "DD-MM-YYYY" to JavaScript Date Object
          if(header.PoDate){
            var aParts = header.PoDate.split("-");
            var oDate = new Date(aParts[2], aParts[1] - 1, aParts[0]); // YYYY, MM (0-based), DD
          }

    // Convert Date to OData Format (ISO 8601)
        
          oModel.setDeferredGroups(["batchCreate"]);
          var headerData = { "OrderType": header.OrderType, "PoNumber": header.PoNumber, "PoDate": oDate, "Guid": header.Docguid, "FileName": header.FileName,
                            "Plant": header.Plant, "Vkorg": header.SalesArea, "SoldTo": headerPartners.SoldTo, "ShipTo": headerPartners.ShipTo, "Action": action };
          oModel.create("/SalesHeaderSet", headerData, { groupId: "batchCreate" });
           // Create Partner Entities
           partners.forEach(function(oPartner) {
            var data = {"PartnerFunction": oPartner.PartnerFunction, "PartnerNumber": oPartner.PartnerNumber};
            oModel.create("/PartnerDetailsSet", data, { groupId: "batchCreate" });
          });
           // Create Items Entities
          items.forEach(function(oItem) {
            if (oItem.part_number !== null) {
            var data = { "Material": oItem.part_number, "Description": oItem.description, "Quantity": String(oItem.quantity), "Price": String(oItem.unit_price) }
            oModel.create("/SalesItemsSet", data, { groupId: "batchCreate" });
            }
        }); 
        this.getView().byId("poDetails").setBusy(true);
        var that = this;
          oModel.submitChanges({
            groupId: "batchCreate",
            success: function (oData,response) {
              that.getView().byId("poDetails").setBusy(false);
              var batchResponses = response.data["__batchResponses"];
              if (batchResponses && batchResponses.length > 0) {
                  var changeResponses = batchResponses[0]["__changeResponses"];
                  if (changeResponses && changeResponses.length > 0) {
                      var headers = changeResponses[0]["headers"];
                      if (headers && headers["sap-message"]) {
                          // Parse the sap-message JSON
                          var sapMessage = JSON.parse(headers["sap-message"]);
                          if (action){
                            that.onSimulateDialog(changeResponses);
                            that.getView().getModel("HeaderModel").setProperty("/TotalPrice",sapMessage.message);
                            return;
                          }
                          
                          // Show the message in UI
                          sap.m.MessageBox.show(sapMessage.message, {
                              icon: sap.m.MessageBox.Icon.INFORMATION,
                              title: "System Message",
                              actions: [sap.m.MessageBox.Action.OK]
                          });
      
                          console.log("SAP Message:", sapMessage);
                      }
                    }
                  else{
                    var sErrorMessage = "Unknown Error";
                    try {
                    var response = JSON.parse(batchResponses[0].response.body);
                    var aErrorDetails = response["error"]["innererror"]["errordetails"];
        
                    if (aErrorDetails && aErrorDetails.length > 0) {
                        // Extract meaningful error messages
                        sErrorMessage = aErrorDetails.map(err => err.message).join("\n");
                    } else {
                        sErrorMessage = response["error"]["message"]["value"];
                    }
                } catch (e) {
                    console.error("Error parsing OData response", e);
                }
            
                // Show error message in UI
                    sap.m.MessageBox.error(sErrorMessage);
                  }
                  }
              
            },
            error: function (oError,response) {
              that.getView().byId("poDetails").setBusy(false);
              try {
                var batchResponses = oError.responseText ? JSON.parse(oError.responseText) : {};
                var errorMessage = "";
    
                // Navigate through the response structure
                if (batchResponses.error && batchResponses.error.message && batchResponses.error.message.value) {
                    errorMessage = batchResponses.error.message.value;
                } else if (batchResponses["__batchResponses"] && batchResponses["__batchResponses"].length > 0) {
                    var errorResponse = batchResponses["__batchResponses"][0];
                    if (errorResponse.response && errorResponse.response.body) {
                        var errorBody = JSON.parse(errorResponse.response.body);
                        if (errorBody.error && errorBody.error.message) {
                            errorMessage = errorBody.error.message.value;
                        }
                    }
                }
    
                if (errorMessage) {
                    sap.m.MessageBox.error(errorMessage, {
                        title: "Error",
                        actions: [sap.m.MessageBox.Action.CLOSE]
                    });
                } else {
                    console.error("Unhandled error response:", oError);
                    sap.m.MessageBox.error("An unknown error occurred.");
                }
    
            } catch (e) {
                console.error("Error parsing response:", e);
                sap.m.MessageBox.error("Error while processing response.");
            }
                console.error(oError);
            }
        });
        },
        onSimulateDialog: function(changeResponse){
          var simulateItem = [];
          var totalPrice = 0.00;
          var oNumberFormat = NumberFormat.getFloatInstance({
            groupingEnabled: true,  // Enable thousand separators
            groupingSeparator: ",",
            decimalSeparator: ".",
            minFractionDigits: 2,  // Display 2 decimal places
            maxFractionDigits: 2
          });
          for(var i=0;i<changeResponse.length;i++){
            if(changeResponse[i].data["Material"]){
              changeResponse[i].data["UnitPrice"] = oNumberFormat.format(parseFloat(changeResponse[i].data["UnitPrice"]));
              
              simulateItem.push(changeResponse[i].data);
              var price = parseFloat(changeResponse[i].data["TotalPrice"]);      
              changeResponse[i].data["TotalPrice"] = oNumberFormat.format(parseFloat(changeResponse[i].data["TotalPrice"]));      
              totalPrice = parseFloat(totalPrice) + price;
            }
          }
           // Format with Thousand Separator
          

          var formattedResult = oNumberFormat.format(totalPrice);
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(simulateItem);
          oModel.setProperty("/TotalPrice",formattedResult);
          if (!this.SimualteDialog) {
            this.SimualteDialog = sap.ui.xmlfragment("zuipdf.dialog.SimulateDialog", this);
            this.getView().byId("poDetails").addDependent(this.SimualteDialog);
         }

         sap.ui.getCore().byId("SimulateDialog").setModel(oModel, "SimulateModel");
         this.SimualteDialog.open();
        },
        onSave: function(oEvent){
          debugger;
          this.getView().byId("poDetails").setBusy(true);
          var headerPartnerData = this.getView().getModel("HeaderPartnerModel").getData();
          delete headerPartnerData.__metadata;
          
          var headerData = this.getView().getModel("HeaderModel").getData();
          delete headerData.__metadata;
          var itemData = this.getView().getModel("ItemModel").getData();
          var partnerData = this.getView().getModel("PartnerFunctionModel").getData();
          if(partnerData && partnerData.items){
            for(var i = 0; i<partnerData.items.length;i++){
              delete partnerData.items[i].__metadata;
            }
          }
          // Convert JSON to Strings with Labels
          var sFinalData = JSON.stringify({ "HeaderPartnerData": headerPartnerData, "HeaderData": headerData, "ItemData": itemData, "Partner":  partnerData});
          
          console.log("Final Concatenated Data: ", sFinalData);
          var selectedPo = this.getView().getModel("HeaderModel").getData();
          var encodedFileName = encodeURIComponent(selectedPo.FileName);
          var url = "/DocumentStoreSet(fileName='" + encodedFileName + "')";
          var that = this;
          // Define Payload
          var oPayload = {
            fileName: selectedPo.FileName,           
            guid: selectedPo.Docguid,
            Message: headerPartnerData.SoldTo,
            UpdatedJson: sFinalData  // OData entity should have a 'ConcatenatedData' field
          };
          this.getView().getModel("backend").update(url, oPayload, {    
            method: "PUT",          
            success: (oData) => { 
              this.getView().byId("poDetails").setBusy(false);
              debugger;
              sap.m.MessageBox.show("Successfully saved", {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: "System Message",
                actions: [sap.m.MessageBox.Action.OK]
            });

            },
            error: (oData) => {
              this.getView().byId("poDetails").setBusy(false);
              debugger;
            }
        } );
      },
      onDeleteItem: function(oEvent){
        var oTable = this.getView().byId("itemsTable");
        var oModel = this.getView().getModel("ItemModel");
        var aSelectedItems = oTable.getSelectedIndices();
        var aItems = oModel.getData()

        if (aSelectedItems.length === 0) {
            sap.m.MessageToast.show("Please select a partner to delete.");
            return;
        }

        aSelectedItems.forEach(function (iIndex) {
            var oContext = oTable.getContextByIndex(iIndex);
            var sPath = oContext.getPath();
            var index = parseInt(sPath.split("/").pop(), 10);
            aItems.splice(index, 1);
        });

        oModel.setData(aItems, "ItemModel");
        oTable.clearSelection();
        sap.m.MessageToast.show("Selected item(s) deleted.");

      },
        onDeletePartner: function (oEvent) {
            var oTable = this.getView().byId("partnerTable");
            var oModel = this.getView().getModel("PartnerFunctionModel");
            var aSelectedItems = oTable.getSelectedIndices();
            var aPartners = oModel.getProperty("/items");

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select a partner to delete.");
                return;
            }

            aSelectedItems.forEach(function (iIndex) {
                var oContext = oTable.getContextByIndex(iIndex);
                var sPath = oContext.getPath();
                var index = parseInt(sPath.split("/").pop(), 10);
                aPartners.splice(index, 1);
            });

            oModel.setProperty("/items", aPartners);
            oTable.clearSelection();
            sap.m.MessageToast.show("Selected partner(s) deleted.");
        }

});
});