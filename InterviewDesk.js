// TODO find candinate infomation by ID from check_in sheet (ID, Name, Department, Interview time), update to the same row of interview desk sheet
const checkinSS = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/13cxT8FMWXwsC6VpjlECZwrRvr1NMKpXTm2HR-mxXdzM');
const checkinSheet = checkinSS.getSheetByName('Check_in');
const interviewDeskSS = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1Cx8smNTm7Jh8V3rCZfyZKeNRtHQOA3Gi3TFE897RRHo');
function getSheetById(id) {
    return SpreadsheetApp.getActive().getSheets().filter(
        function(s) {return s.getSheetId() === id;}
    )[0];
}

var interviewDeskSheet = getSheetById(0);

function checkCandinateIdUpdate() {
    var idCols = interviewDeskSheet.getRange('B2:B').getValues();
    idCols.forEach(function(id) {
        if(id[0] !== '') {
            updateInterviewDesk(id[0], interviewDeskSheet);
        };
    });
}

function updateInterviewDesk(id, interviewDeskSheet) {
    var checkinList = checkinSheet.getRange('B2:E').getValues();
    checkinList.forEach(function(checkinCaninate) {
        if(checkinCaninate[0] === id) {
            var name = checkinCaninate[1];
            var department = checkinCaninate[2];
            var interviewTime = checkinCaninate[3];
            var interviewDeskRow = interviewDeskSheet.getRange('B2:B').getValues().indexOf(id) + 2;
            interviewDeskSheet.getRange('C' + interviewDeskRow).setValue(name);
            interviewDeskSheet.getRange('D' + interviewDeskRow).setValue(department);
            interviewDeskSheet.getRange('E' + interviewDeskRow).setValue(interviewTime);
            interviewDeskSheet.getRange('F' + interviewDeskRow).setValue('1_Đang duyệt hồ sơ');
        }
    })
}