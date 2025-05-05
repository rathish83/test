
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,FilterOperator,JSONModel,Filter) {
        "use strict";
 
        return Controller.extend("zuipdf.controller.PoHeader", {
        onInit: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("PoInbox").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched(oEvent){
            
            this.getView().byId("PoInbox").setModel(this.getOwnerComponent().getModel(),true);
            this.getOwnerComponent().getModel().setSizeLimit(600);
            this.getView().byId("PoInbox").setBusy(true);
            var that = this;
            var oJModel = new JSONModel();                      
                this.getView().setModel(oJModel, "oJModel");  
                this.getView().byId("idSegment").setSelectedKey("4");
                this.getView().byId("idSegmentSt").setSelectedKey("All");
                this.onSelSearch('');
        },
        changeDateToUTC: function (oDate) { //for sending dates to backend
            if (oDate) {
                var oTempDate = new Date(oDate.setHours("00", "00", "00", "00"));
                oDate = new Date(oTempDate.getTime() + oTempDate.getTimezoneOffset() * (-60000));
                return oDate;

            } else return null;
        },    
        onformatMillisecondsToTime: function (sMilliseconds) {
            if(sMilliseconds){
            if (!sMilliseconds.ms || isNaN(sMilliseconds.ms)) {
                return ""; // Handle invalid or empty input
            }
  
            // Convert milliseconds to time
            var totalSeconds = Math.floor(sMilliseconds.ms / 1000);
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds % 3600) / 60);
            var seconds = totalSeconds % 60;
  
            // Ensure two-digit format
            hours = String(hours).padStart(2, "0");
            minutes = String(minutes).padStart(2, "0");
            seconds = String(seconds).padStart(2, "0");
  
            return hours + ":" + minutes + ":" + seconds;
        }
        },
        onSoNumber: function(oEvent){
            debugger;
            var sSalesOrderID = oEvent.getSource().getText();
            var sUrl = "https://nvidia-appsd.cpp.cfapps.us20.hana.ondemand.com/site?siteId=09e1634d-9d2d-4129-8189-416a1da98579#zva03-display?sap-ui-app-id-hint=028dbbd6-0dd3-44c9-ae87-35a954d4b2d2&VBAK-VBELN="+encodeURIComponent(sSalesOrderID);
            window.open(sUrl, "_blank");
        },
        getDateFilter: function (type) {        

            if (type === '2') {
                var to = new Date();
                var utcTo = this.changeDateToUTC(to);
                return new Filter("CreatedDate", FilterOperator.EQ, utcTo);
            } else if (type === '3') {
                var curr = new Date(); // get current date
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var firstday = new Date(curr.setDate(first));

                utcTo = this.changeDateToUTC(new Date());
                var utcFrom = this.changeDateToUTC(firstday);
                return new Filter("CreatedDate", FilterOperator.BT, utcFrom, utcTo);
            } else if (type === '4') {
                to = new Date();
                var from = new Date(to.getFullYear(), to.getMonth(), 1);
                utcTo = this.changeDateToUTC(to);
                utcFrom = this.changeDateToUTC(from);
                return new Filter("CreatedDate", FilterOperator.BT, utcFrom, utcTo);

            } else if (type === '5') {
                to = new Date();
                from = new Date(1970, 1, 1);
                utcTo = this.changeDateToUTC(to);
                utcFrom = this.changeDateToUTC(from);
                return new Filter("CreatedDate", FilterOperator.BT, utcFrom, utcTo);

            } else if (type === '1') {
                from = this.getView().byId("from").getDateValue();
                to = this.getView().byId("to").getDateValue();
                utcTo = this.changeDateToUTC(to);
                utcFrom = this.changeDateToUTC(from);
                if (!from) {
                    MessageToast.show("Please choose From Date", {
                        duration: 200
                    });
                    return null;
                } else if (from && !to) {
                    return new Filter("SOCreationDate", FilterOperator.EQ, utcFrom);
                } else if (!to && from.getTime() > to.getTime()) {
                    MessageToast.show("From Date is greater than To Date", {
                        duration: 200
                    });
                    return null;
                } else {
                    return new Filter("CreatedDate", FilterOperator.BT, utcFrom, utcTo);
                }

            } else return null;
        },

        onSelSearch:function(oEvent){
            this.getView().byId("PoInbox").setBusy(true);
            var dateType = this.getView().byId('idSegment').getSelectedKey();
            var surDeci = this.getView().byId('idSegmentSt').getSelectedKey();
            var sFilters = [];
            debugger;
            if(dateType){
                var dateFilter = this.getDateFilter(dateType);
                if(dateFilter == null){
                    return;
                }else{
                    sFilters.push(dateFilter);                        
                }
            }

            if(surDeci != 'All'){
                sFilters.push(new Filter("Status", FilterOperator.EQ, surDeci));
            }
            this.getView().getModel().read("/PoHeaderSet",{
                filters: sFilters,
                success: function (oData) {
                   this.getView().byId("PoInbox").setBusy(false);
                    //var oModelHeader = new JSONModel();
                    //oModelHeader.setData(oData.results);
                    // this.getModel("oModelHeader").setData(oData.results);
                    //this.setModel(oModelHeader, "oModelHeader");
                    var oJModel = this.getView().getModel("oJModel");

                    oJModel.setProperty("/PoHeaderSet",oData.results);
                    this.getView().setModel(oJModel,"oJModel");
                    this.getView().byId("searchTable").getModel("oJModel").refresh(true);
                    this.getView().byId("searchTable").rebindTable();
                    
                }.bind(this),
                error: function (oResponse) {
                    this.getView().byId("PoInbox").setBusy(false);
                    sap.m.MessageToast.show("oData fetching failed");
                }.bind(this)
            });

        },
       
        onProdTableInit: function (oEvent) {
            let oTab = oEvent.getSource().getTable();
            
            let columns = oTab.getColumns();
            let that = this;
            for (let acol of columns) {

                let sPath = "oJModel>" + acol.data("p13nData").columnKey;
                if( acol.data("p13nData").columnKey != 'PoNumber' && acol.data("p13nData").columnKey != 'CreatedDate' 
                        && acol.data("p13nData").columnKey != 'Status'
                        && acol.data("p13nData").columnKey != 'CreatedTime'
                        && acol.data("p13nData").columnKey != 'Vbeln'){
                    acol.getTemplate().getDisplay().bindText(sPath);                        
                    acol.setWidth("10rem");
                }
            }
            this.onColorUpdate();
             // Get inner table
             oTab.attachEvent("updateFinished", this.onTableUpdated, this);
        
        },
        onTableUpdated: function () {
            debugger;
        },
        onFuzzySearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
               
                var filter = [
                    new Filter("PoNumber", FilterOperator.Contains, sQuery),
                    new Filter("PoDate", FilterOperator.Contains, sQuery),
                    new Filter("BuyerName", FilterOperator.Contains, sQuery),
                    new Filter("BuyerStreetName", FilterOperator.Contains, sQuery),
                    new Filter("BuyerCity", FilterOperator.Contains, sQuery),
                    new Filter("BuyerState", FilterOperator.Contains, sQuery),
                    new Filter("BuyerCountry", FilterOperator.Contains, sQuery),
                    new Filter("Status", FilterOperator.Contains, sQuery),
                   
                ];
                aFilters.push(new Filter({
                    filters: filter,
                    bAnd: false }));
            }

            // update list binding
            var table = oEvent.getSource().getParent().getParent().getTable();
            var oBinding = table.getBinding("rows");
            oBinding.filter(aFilters, "Application");
        },
        onDataReceived: function(oEvent){
            debugger;
        },
        onPoNumber: function(oEvent) {
            var oParams = {};
            var row = oEvent.getSource().getBindingContext("oJModel").getObject();
            //if (row["Vbeln"] === "" || row["Vbeln"] === undefined || row["Vbeln"] === null){
            oParams["Guid"] = row.Docguid;      
            oParams["fileName"] = row.FileName;    
            this.getView().getModel("App").setProperty("/row",row);    
            this.getOwnerComponent().getRouter().navTo("PoDetails", oParams); 
      /*  }
            else{
                sap.m.MessageBox.show("Sales Order already created", {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: "System Message",
                    actions: [sap.m.MessageBox.Action.OK]
                });

            } */
        },
        onChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameters().selectedItem;
            debugger;
        },
        onBack: function(oEvent){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("JobInbox");
            debugger;
          },
          onDateButtonSel: function(oEvent){
            this.getView().byId("from").setDateValue();
                this.getView().byId("to").setDateValue();
          },

          oDateRangeChg: function (oEvent) {
            this.getView().byId("idSegment").setSelectedKey("1");
        },
        onSearchByRange: function(oEvent){
            debugger;
        },
        
        
          onColorUpdate: function () {
            var oSmartTable = this.getView().byId("searchTable");
        
            // Get the inner UI table
            var oTable = oSmartTable.getTable();
        
            if (oTable instanceof sap.ui.table.Table) {
                // Enable row coloring
                oTable.setRowSettingsTemplate(new sap.ui.table.RowSettings({
                    highlight: {
                      parts: ["oJModel>Status"],
                      formatter: function (sStatus) {
                        switch (sStatus) {
                          case "SUCCESS":
                            return "Success"; // Green
                          case "DRAFT":
                            return "Warning"; // Yellow
                          case "REJECTED":
                            return "Error"; // Red
                          default:
                            return "None"; // Default (Light Silver)
                        }
                      }
                    },
                    class: {
                      parts: ["oJModel>Status"],
                      formatter: function (sStatus) {
                        return sStatus === "None" ? "customLightSilver" : "";
                      }
                    }
                  }));
                  this.onUpdateStatusColor(oTable);
            }
        },
        onformatStatusClass: function (sStatus) {
            switch (sStatus) {
                case "Success":
                    return "statusSuccess"; // Green
                case "DRAFT":
                    return "statusDraft"; // Orange
                case "INITIAL":
                    return "statusInitial"; // Dark Gray
                default:
                    return ""; // Default styling
            }
        },
        onUpdateStatusColor: function (oTable) {
                var oTable = oTable;
                var sStatus = "";
                oTable.getRows().forEach(function (oRow,iIndex) {
                    var oContext = oRow.getBindingContext("oJModel");
                    if(oContext === null){
                        oContext = oTable.getBinding("rows").getModel().getData()["PoHeaderSet"][iIndex]
                        sStatus = oContext.Status;
                    }
                    else{
                         sStatus = oContext.getProperty("Status");
                    }

                    if (oContext) {                       
                        var oText = oRow.getCells()[2]; // Assuming Status is in column index 2
                        if (oText) {
                            oText.removeStyleClass("statusSuccess");
                            oText.removeStyleClass("statusDraft");
                            oText.removeStyleClass("statusInitial");
        
                            switch (sStatus.toUpperCase()) {
                                case "SUCCESS":
                                    oText.addStyleClass("statusSuccess");
                                    break;
                                case "DRAFT":
                                    oText.addStyleClass("statusDraft");
                                    break;
                                case "INITIAL":
                                    oText.addStyleClass("statusInitial");
                                    break;
                            }
                        }
                    }
                });
            
        }
        
        
});
});