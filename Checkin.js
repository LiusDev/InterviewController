var checkinValueRange = 'A2:G';
var checkinCols = {
    'id': 2,
    'name': 3,
    'department': 4,
    'shift': 5,
    'status': 6
};

function moveToControlSheet(id) {
    var controllingSheet = SpreadsheetApp.openById(controllingTemplateId).getSheetByName(controllingSheetName);
    //TODO: move id to controlling sheet

}

function removeFromControlSheet(id) {
    var controllingSheet = SpreadsheetApp.openById(controllingTemplateId).getSheetByName(controllingSheetName);
    //TODO: remove id from controlling sheet
}

function onEditCheckin(event) {
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcCell.getColumn() === checkinCols.status) {
        var id = srcSheet.getRange(srcCell.getRow(), checkinCols.id).getValue();
        if (srcCell.getValue() === true) {
            // nếu có thay đổi giá trị sang true, đưa vào bên Điều Phối
            moveToControlSheet(id);
        } else {
            // nếu thay đổi về false, xóa đi khỏi bên Điều Phối
            removeFromControlSheet(id);
        }
    }
}