var webAppUrl = 'https://script.google.com/macros/s/AKfycby_20Wg82Lk6KJKOCwMYS_YRePQ3WwHZ4wAowXOb2EbcJcNUDITLnTYWsVmTnbxsMzI/exec';
var logSheetName = 'LOG';
var checkinSheetName = 'Check_in';
var controllingSheetName = 'Điều phối';
var deskPrefix = 'Bàn PV ';

var configTemplateId = '1cVdamGyoX4tm6d2iuJDLmQSFmVqkSTHhR8CJs4LQZbk';
var checkinTemplateId = '13cxT8FMWXwsC6VpjlECZwrRvr1NMKpXTm2HR-mxXdzM';
var controllingTemplateId = '1gpXbVMlSQBAODvia6JCI_y0o-TlgjKJCDDdHHMRkvl0';
var interviewDeskTemplateId = '1Cx8smNTm7Jh8V3rCZfyZKeNRtHQOA3Gi3TFE897RRHo';

var statusValues = [
    '0_Đã check-in',
    '1_Đang duyệt hồ sơ',
    '2_Đã duyệt hồ sơ',
    '3_Đang phỏng vấn',
    '4_Đã phỏng vấn'
]
var candidateCols = {
    id: 2,
    name: 3,
    department: 4,
    shift: 5,
    status: 6,
    desk: 7,
    decision: 8,
    note: 9
};

function evalFormula(spreadsheet, formula) {
    var tempRange = spreadsheet.getSheetByName(logSheetName).getRange('A2');
    tempRange.setFormula(formula);
    var value = tempRange.getValue();
    tempRange.setValue('');
    return value;
}

function fetchPost(data) {
    var options = {
        'method': 'post',
        'payload': data
    };
    return UrlFetchApp.fetch(webAppUrl, options);
}

function fillData(sheet, row, id, checkinData) {
    if (id !== '') {
        sheet.getRange(row, candidateCols.name).setValue(checkinData[checkinCols.name - 1]);
        sheet.getRange(row, candidateCols.department).setValue(checkinData[checkinCols.department - 1]);
        sheet.getRange(row, candidateCols.shift).setValue(checkinData[checkinCols.shift - 1]);
    } else {
        sheet.getRange('B' + row + ":I" + row).setValue('');
    }
}

function log(str) {
    // get cell A1 of configSS then concat its value by str
    var logSheet = SpreadsheetApp.openById(configTemplateId).getSheetByName(logSheetName);
    var logRange = logSheet.getRange('A1');
    logRange.setValue(logRange.getValue() + '\n' + str);
}