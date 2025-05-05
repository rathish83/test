sap.ui.define([], function () {
    "use strict";

    return {
        formatDate: function (sDate) {
            debugger;
            if (!sDate) return "";
            
            // ✅ Ensure date is a string and has correct length
            if (typeof sDate !== "string" || sDate.length !== 8) return sDate;

            var year = sDate.substring(0, 4);
            var month = sDate.substring(4, 6) - 1; // Months are 0-based
            var day = sDate.substring(6, 8);

            var oDate = new Date(year, month, day);

            // ✅ Format date as "MMM dd, yyyy" (e.g., "Jan 01, 2024")
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MMM dd, yyyy" });
            return oDateFormat.format(oDate); 
        },
        formatIcon: function(sValue) {
            debugger;
            switch(sValue){
              case "INPROGRESS":
                return "sap://inprogress"   

              case "ERROR":
                return "sap://inprogress"   
              case "SUCCESS":
                return "success"
            
            }
        }
       
    };
});
