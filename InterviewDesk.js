// TODO find candinate infomation by ID from check_in sheet (ID, Name, Department, Interview time), update to the same row of interview desk sheet
function checkCandinateIdUpdate() {
    var interviewDeskSheet = SpreadsheetApp.openById(interviewDeskTemplateId).getSheetByName('Bàn PV 1');
    var idCols = interviewDeskSheet.getRange('B2:B').getValues();
    idCols.forEach(function(id) {
        if(id[0] !== '') {
            updateInterviewDesk(id[0]);
        };
    });
}