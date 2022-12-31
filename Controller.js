function log(str) {
  const sheet = controllingSS.getSheetByName('Log');
  sheet.getRange('A1').setValue(sheet.getRange('A1').getValue() + '\n' +str)
}

function unitTest() {
  log(checkinSheetName)
}

function sort() {
  const statusCol = 6;
  const sheet = controllingSS.getSheetByName(controllingSheetName);
  const range = sheet.getRange('A2:I');
  range.sort( { column : statusCol, ascending: true });
  
}

function setAuthentication(email, deskSheet, accessNotations) {
}

function addToTable(deskCode, row) {
  const checkinSheet = checkinSS.getSheetByName(checkinSheetName);
  const sheet = desksMap.get(deskCode);

  const addedRow = sheet.getRange('N1').getValue() + 2;
  sheet.getRange('B' + addedRow).setValues(checkinSheet.getRange('B' + row).getValues());

  for (let [code, deskSS] of Object.entries(desksMap)) {
    removeRow(allSheet[i], sheet.getRange('B' + addedRow).getValue());
  }
}


function sortID() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Check_in');
  var range = sheet.getRange("A2:G");
  range.sort({column: 1, ascending: true});
}


function sortByTime() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(controllingSheetName);
  var range = sheet.getRange("A2:J");
  range.sort({column: 5, ascending: true});
  range.sort({column: 10, ascending: true});
}

function onEdit(event){
  var srcSheet = event.source.getActiveSheet();

  if(srcSheet.getName()=='Check_in') {
    //hide all checked row
    hideAllCheckedRow(srcSheet);
   var srcCell = srcSheet.getActiveCell();
   // nếu có thay đổi giá trị sang true, đưa vào bên Điều Phối
   if (srcCell.getColumn() == 6 && srcCell.getValue() == true) {
     var rowNumData = srcCell.getRow();
     var ID = srcSheet.getRange(rowNumData, 2).getValue();
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(controllingSheetName);
     var check = 0;
     var rowNumCol = sheet.getRange('L1');
     var limit = Number(rowNumCol.getValue()) + 2;
     for(var i=2; i<limit;i++){
       if(String(sheet.getRange(i,2).getValue())==ID){
         sheet.getRange('A' + i + ':C' + i).setBackground('lime');
         sheet.getRange('D' + i + ':I' + i).setBackground('white');
         sheet.getRange('J'+i).setValue(0);
         check = 1;
         break;
       }
     }
     if(check == 0) {
       moveToSheet(rowNumData);
     }
   }

   //nếu thay đổi về false, ẩn hàng đo đi khỏi bên Điều Phối
   if (srcCell.getColumn() == 6 && srcCell.getValue() == false) {
     var rowNumData = srcCell.getRow();
     var ID = srcSheet.getRange(rowNumData, 2).getValue();
     reCheck(ID);
   }
  }
  var sheet = event.source.getActiveSheet();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusCol = 6;
  var decideCol = 8;
  var tableCol = 7;
  if (sheet.getName() == controllingSheetName) {
    var editedCell = sheet.getActiveCell();
    if(editedCell.getColumn() == statusCol){
      sort();
    }
    if(editedCell.getColumn() == tableCol){
      var tableNumber = editedCell.getValue();
      addToTable(tableNumber, editedCell.getRow());
    }
  }

  if (sheet.getName() != 'Check_in' && sheet.getName() != controllingSheetName && sheet.getName() != 'Thông tin ứng viên') {
    var editedCell = sheet.getActiveCell();
    var valueCell = editedCell.getValue();
    var check_inSheet = ss.getSheetByName(controllingSheetName);
    var id = id = sheet.getRange('B' + editedCell.getRow()).getValue();
    if(editedCell.getColumn() == statusCol){
      for (var i = 2; i < 200; i++) {
        if (check_inSheet.getRange(i, 2).getValue() == id) {
          check_inSheet.getRange(i, 6).setValue(valueCell);
          sort();
        }
      }
    }

    if(editedCell.getColumn() == decideCol){
      id = sheet.getRange('B' + editedCell.getRow()).getValue();
      for (var i = 2; i < 200; i++) {
        if (check_inSheet.getRange(i, 2).getValue() == id) {
          check_inSheet.getRange(i, 8).setValue(valueCell);
        }
      }
    }

    var typeCol = 4;
    if(editedCell.getColumn() == typeCol){
      id = sheet.getRange('B' + editedCell.getRow()).getValue();
      for (var i = 2; i < 200; i++) {
        if (check_inSheet.getRange(i, 2).getValue() == id) {
          check_inSheet.getRange(i, 4).setValue(valueCell);
        }
      }
    }
  }
}

