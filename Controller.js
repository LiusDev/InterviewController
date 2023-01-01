var controlRange = "A2:I";

function sort() {
    getMetadataSS(controllingSheetName)
        .getSheetByName(controllingSheetName)
        .getRange(controlRange)
        .sort( { column : candidateCols.status, ascending: true });
}

function moveToDeskSheet(id, deskCode) {
    var deskName = deskPrefix + deskCode;
    var deskSheet = getMetadataSS(deskName).getSheetByName(deskName);
    //TODO: move an id to desk sheet
}

function removeFromDesks(id) {
    //TODO: remove id from all desks
}

function onEditControl(event){
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcCell.getColumn() === candidateCols.id) {
        var id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        if (id !== "") {
            var checkinData = getCheckinData(id);
            srcSheet.getRange(srcCell.getRow(), candidateCols.name).setValue(checkinData[checkinCols.name - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.department).setValue(checkinData[checkinCols.department - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.shift).setValue(checkinData[checkinCols.shift - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.status).setValue(statusValues[0]);
        } else {
            srcSheet.getRange(srcCell.getRow(), candidateCols.name).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.department).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.shift).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.status).setValue("");
            removeFromDesks(id);
        }
    }
    if (srcCell.getColumn() === candidateCols.desk) {
        id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        var deskCode = srcSheet.getRange(srcCell.getRow(), candidateCols.desk).getValue();
        moveToDeskSheet(id, deskCode);
    }
}

