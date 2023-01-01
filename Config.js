// WARNING: THIS FILE ONLY USE WHEN CONFIG SPREADSHEET IS ACTIVE
var configSS = SpreadsheetApp.getActiveSpreadsheet();
var metadataSheetName = 'Metadata';
var deskConfigSheetName = 'DeskConfig';
var deskStatusRange = 'K1';
var deskControlStatusRange = 'M2:O';
var deskControlCols = {
  'room': 13,
  'desk': 14,
  'department': 15,
  'status': 16,
}
var metadataValueRange = 'A2:C';
var dekConfigValueRange = 'A2:C';
var deskConfigCols = {
  'room': 1,
  'desk': 2,
  'department': 3
};
var metadataCols = {
  'id': 1,
  'name': 2,
  'url': 3
};
function onOpenConfig() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('JS Actions')
      .addItem('Generate bàn phỏng vấn', 'JSLib.generateAllFile')
      .addSeparator()
      .addItem('Test', 'JSLib.unitTest')
      .addToUi();
}

function addMetadata(meta) {
  var formula = '=COUNTA(' + metadataSheetName + '!' + metadataValueRange + ') / 3 + 2';
  var lineNo = evalFormula(configSS, formula);
  var metadataSheet = configSS.getSheetByName(metadataSheetName);
  metadataSheet.getRange(lineNo, metadataCols.id).setValue(meta.getId());
  metadataSheet.getRange(lineNo, metadataCols.name).setValue(meta.getName());
  metadataSheet.getRange(lineNo, metadataCols.url).setValue(meta.getUrl());
}

function generateAllFile() {
  var currentFolder = DriveApp.getFileById(configSS.getId()).getParents().next();

  // generate controlling spreadsheet file, then add its metadata to config spreadsheet
  var controllerSS = SpreadsheetApp.openById(controllingTemplateId).copy(controllingSheetName);
  DriveApp.getFileById(controllerSS.getId()).moveTo(currentFolder);
  addMetadata(controllerSS);

  // generate checkin spreadsheet file, then add its metadata to config spreadsheet
  var checkinSS = SpreadsheetApp.openById(checkinTemplateId).copy(checkinSheetName);
  DriveApp.getFileById(checkinSS.getId()).moveTo(currentFolder);
  addMetadata(checkinSS);

  // generate interview desks spreadsheet file, then add its metadata to config spreadsheet
  var deskConfigValues = configSS.getSheetByName(deskConfigSheetName).getRange(dekConfigValueRange).getValues();
  var controlSheet = controllerSS.getSheetByName(controllingSheetName);
  controlSheet.getRange(deskControlStatusRange).setValues(deskConfigValues);
  var deskFolder = currentFolder.createFolder(deskPrefix);
  for (var i = 0; i < deskConfigValues.length; i++) {
    var deskCode = deskConfigValues[i][deskConfigCols.desk - 1];
    if (deskCode === '') {
      break;
    }
    var deskName = deskPrefix + deskCode;
    var deskSS = SpreadsheetApp.openById(interviewDeskTemplateId).copy(deskName);
    deskSS.getSheetByName(deskPrefix).setName(deskName).copyTo(controllerSS).setName(deskName);
    DriveApp.getFileById(deskSS.getId()).moveTo(deskFolder);
    controlSheet.getRange(i + 2, deskControlCols.status).setFormula('=\'' + deskName + '\'!' + deskStatusRange);
    addMetadata(deskSS);
    //TODO: add Info sheet for desk
    //TODO: add authentication for desk
  }
}