var logSheetName = 'LOG';
var checkinSheetName = 'Check_in';
var controllingSheetName = 'Điều Phối';
var deskPrefix = 'Bàn PV ';

var configTemplateId = '1cVdamGyoX4tm6d2iuJDLmQSFmVqkSTHhR8CJs4LQZbk';
var checkinTemplateId = '13cxT8FMWXwsC6VpjlECZwrRvr1NMKpXTm2HR-mxXdzM';
var controllingTemplateId = '1gpXbVMlSQBAODvia6JCI_y0o-TlgjKJCDDdHHMRkvl0';
var interviewDeskTemplateId = '1Cx8smNTm7Jh8V3rCZfyZKeNRtHQOA3Gi3TFE897RRHo';

var controlCols = {
    'id': 2,
    'name': 3,
    'department': 4,
    'shift': 5,
    'status': 6,
    'desk': 7,
    'decision': 8,
    'note': 9
};

function evalFormula(spreadsheet, formula) {
    var tempRange = spreadsheet.getSheetByName(logSheetName).getRange('A2');
    tempRange.setFormula(formula);
    var value = tempRange.getValue();
    tempRange.setValue('');
    return value;
}

function fillData(id) {
    var interviewDeskSheet = SpreadsheetApp.openById(interviewDeskTemplateId).getSheetByName('Bàn PV 1');
    var checkinSheet = SpreadsheetApp.openById(checkinTemplateId).getSheetByName('Check_in');
    var checkinList = checkinSheet.getRange('B2:E').getValues();
    checkinList.forEach(function(checkinCaninate) {
        if(checkinCaninate[0] === id) {
            var name = checkinCaninate[1];
            var department = checkinCaninate[2];
            var interviewTime = checkinCaninate[3];
            var interviewDeskRow = interviewDeskSheet.getRange('B2:B').getValues().indexOf(id) + 3;
            interviewDeskSheet.getRange('C' + interviewDeskRow).setValue(name);
            interviewDeskSheet.getRange('D' + interviewDeskRow).setValue(department);
            interviewDeskSheet.getRange('E' + interviewDeskRow).setValue(interviewTime);
            interviewDeskSheet.getRange('F' + interviewDeskRow).setValue('1_Đang duyệt hồ sơ');
        }
    })
}