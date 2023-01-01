// WARNING: THIS FILE ONLY USE WHEN CONFIG SPREADSHEET IS ACTIVE
var configSS = SpreadsheetApp.getActiveSpreadsheet();

var metadataCol = {
  'id': 'A',
  'name': 'B',
  'url': 'C'
}

function addMetadata(id) {
  file = DriveApp.getFileById(id);
  sheetBName = configSS.getSheetByName(logSheetName);
}
function generateDeskSS() {
  var deskSS = interviewDeskTemplateSS.copy(deskCode);
  DriveApp.getFileById(deskSS.getId()).moveTo()
}