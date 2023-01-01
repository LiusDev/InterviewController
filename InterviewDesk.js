function onEditDesk(event) {
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcCell.getColumn() === candidateCols.id) {
        var id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        if (id !== "") {
            var checkinData = getCheckinData(id);
            srcSheet.getRange(srcCell.getRow(), candidateCols.name).setValue(checkinData[checkinCols.name - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.department).setValue(checkinData[checkinCols.department - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.shift).setValue(checkinData[checkinCols.shift - 1]);
            srcSheet.getRange(srcCell.getRow(), candidateCols.status).setValue(statusValues[1]);
        } else {
            srcSheet.getRange(srcCell.getRow(), candidateCols.name).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.department).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.shift).setValue("");
            srcSheet.getRange(srcCell.getRow(), candidateCols.status).setValue("");
        }
    }
    if (srcCell.getColumn() === candidateCols.status
        || srcCell.getColumn() === candidateCols.decision
        || srcCell.getColumn() === candidateCols.department) {
        id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        //TODO: update these data in the controlling sheet
    }
}

