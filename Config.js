// WARNING: THIS FILE ONLY USE WHEN CONFIG SPREADSHEET IS ACTIVE
var currentSS = SpreadsheetApp.getActiveSpreadsheet();
var metadataSheetName = 'Metadata';
var deskConfigSheetName = 'DeskConfig';
var deskStatusRange = 'K1';
var deskControlStatusRange = 'M2:O';
var deskControlCols = {
  room: 13,
  desk: 14,
  department: 15,
  status: 16,
}
var metadataValueRange = 'A2:C';
var deskConfigValueRange = 'A2:E';
var deskConfigCols = {
  room: 1,
  desk: 2,
  department: 3,
  email1: 4,
  email2: 5
};
var metadataCols = {
  id: 1,
  name: 2,
  url: 3
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
  var lineNo = evalFormula(currentSS, formula);
  var metadataSheet = currentSS.getSheetByName(metadataSheetName);
  metadataSheet.getRange(lineNo, metadataCols.id).setValue(meta.getId());
  metadataSheet.getRange(lineNo, metadataCols.name).setValue(meta.getName());
  metadataSheet.getRange(lineNo, metadataCols.url).setValue(meta.getUrl());
}

function generateAllFile() {
  addMetadata(currentSS);
  //remove all triggers
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  var currentFolder = DriveApp.getFileById(currentSS.getId()).getParents().next();

  // generate controlling spreadsheet file, then add its metadata to config spreadsheet
  var controllerSS = SpreadsheetApp.openById(controllingTemplateId).copy(controllingSheetName);
  ScriptApp.newTrigger('JSLib.onEditController').forSpreadsheet(controllerSS).onEdit().create();
  DriveApp.getFileById(controllerSS.getId()).moveTo(currentFolder);
  addMetadata(controllerSS);
  // TODO: set data validation of desk
  // var rule = SpreadsheetApp.newDataValidation().requireNumberBetween(1,10).build();
  // controllerSS.getRange('G2:G').setDataValidation(rule);

  // generate checkin spreadsheet file, then add its metadata to config spreadsheet
  var checkinSS = SpreadsheetApp.openById(checkinTemplateId).copy(checkinSheetName);
  ScriptApp.newTrigger('JSLib.onEditCheckin').forSpreadsheet(checkinSS).onEdit().create();
  DriveApp.getFileById(checkinSS.getId()).moveTo(currentFolder);
  addMetadata(checkinSS);


  // generate interview desks spreadsheet file, then add its metadata to config spreadsheet
  var deskConfigSheet = currentSS.getSheetByName(deskConfigSheetName);
  var deskConfigValues = deskConfigSheet.getRange(deskConfigValueRange).getValues();
  var controlSheet = controllerSS.getSheetByName(controllingSheetName);

  // controlSheet.getRange(deskControlStatusRange).setValues(deskConfigValues);
  controlSheet.getRange(deskControlStatusRange).setValues(deskConfigSheet.getRange(metadataValueRange).getValues());
  var deskFolder = currentFolder.createFolder(deskPrefix);
  for (var i = 0; i < deskConfigValues.length; i++) {
    var deskCode = deskConfigValues[i][deskConfigCols.desk - 1];
    if (deskCode === '') {
      break;
    }
    var deskName = deskPrefix + deskCode;
    var deskSS = SpreadsheetApp.openById(interviewDeskTemplateId).copy(deskName);
    var deskControlSheet = deskSS.getSheetByName(deskPrefix).setName(deskName)
        .copyTo(controllerSS).setName(deskName);
    deskControlSheet.getRange('A:R').setValue('');
    deskControlSheet.getRange('A1').setFormula('=IMPORTRANGE("' + deskSS.getUrl() + '", "'+ deskName +'!A1:R")');
    ScriptApp.newTrigger('JSLib.onEditDesk').forSpreadsheet(deskSS).onEdit().create();
    DriveApp.getFileById(deskSS.getId()).moveTo(deskFolder);
    controlSheet.getRange(i + 2, deskControlCols.status).setFormula('=\'' + deskName + '\'!' + deskStatusRange);
    addMetadata(deskSS);

    // add Info sheet for each desk
    currentSS.getSheetByName(infoSheetName).copyTo(deskSS).setName(infoSheetName);
    // add authentication for desk
    deskSS.addEditors([deskConfigValues[i][deskConfigCols.email1-1], deskConfigValues[i][deskConfigCols.email2-1]]);

  }
}

function getMetadataSS(name) {
  var metadataSheet = SpreadsheetApp.openById(configTemplateId).getSheetByName(metadataSheetName);
  var metadataValues = metadataSheet.getRange(metadataValueRange).getValues();
  for (var i = 0; i < metadataValues.length; i++) {
    if (metadataValues[i][metadataCols.name - 1] === name) {
      return SpreadsheetApp.openById(metadataValues[i][metadataCols.id - 1]);
    }
  }
  return null;
}

function getDesks() {
    var deskConfigValues = SpreadsheetApp.openById(configTemplateId).getSheetByName(deskConfigSheetName).getRange(deskConfigValueRange).getValues();
    var desks = [];
    for (var i = 0; i < deskConfigValues.length; i++) {
        if (deskConfigValues[i][deskConfigCols.desk - 1] === '') {
        break;
        }
        desks.push(deskConfigValues[i]);
    }
    return desks;
}