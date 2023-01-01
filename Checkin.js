function onEdit(event) {
    var srcSheet = event.source.getActiveSheet();

    if(srcSheet.getName()==='Check_in') {
        //hide all checked row
        hideAllCheckedRow(srcSheet);
        var srcCell = srcSheet.getActiveCell();
        // nếu có thay đổi giá trị sang true, đưa vào bên Điều Phối
        if (srcCell.getColumn() === 6 && srcCell.getValue() === true) {
            var rowNumData = srcCell.getRow();
            var ID = srcSheet.getRange(rowNumData, 2).getValue();
            var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(controllingSheetName);
            var check = 0;
            var rowNumCol = sheet.getRange('L1');
            var limit = Number(rowNumCol.getValue()) + 2;
            for(var i=2; i<limit;i++){
                if(String(sheet.getRange(i,2).getValue())===ID){
                    sheet.getRange('A' + i + ':C' + i).setBackground('lime');
                    sheet.getRange('D' + i + ':I' + i).setBackground('white');
                    sheet.getRange('J'+i).setValue(0);
                    check = 1;
                    break;
                }
            }
            if(check === 0) {
                moveToSheet(rowNumData);
            }
        }

        //nếu thay đổi về false, ẩn hàng đo đi khỏi bên Điều Phối
        if (srcCell.getColumn() === 6 && srcCell.getValue() === false) {
            rowNumData = srcCell.getRow();
            ID = srcSheet.getRange(rowNumData, 2).getValue();
            reCheck(ID);
        }
    }
}