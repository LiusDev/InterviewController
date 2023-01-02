var checkinValueRange = 'A2:G';
var checkinCols = {
    'id': 2,
    'name': 3,
    'department': 4,
    'shift': 5,
    'status': 6
};

function moveToControlSheet(id) {
    //TODO: move id to controlling sheet
    var data = '{"action": "update", "id": "' + id + '"}';
    fetchPost(data);

}

function removeFromControlSheet(id) {
    var controllingSheet = getMetadataSS(controllingSheetName).getSheetByName(controllingSheetName);
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

function getCheckinData(id) {
    var checkinValues = getMetadataSS(checkinSheetName).getSheetByName(checkinSheetName).getRange(checkinValueRange).getValues();
    return checkinValues.find(function (row) {
        return row[checkinCols.id - 1] === id;
    });
}