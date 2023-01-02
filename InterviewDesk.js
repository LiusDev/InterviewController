function onEditDesk(event) {
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcCell.getColumn() === candidateCols.id) {
        var id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        if (id === '') {
            fillData(srcSheet, srcCell.getRow(), '', []);
        }
    }
    if (srcCell.getColumn() === candidateCols.status
        || srcCell.getColumn() === candidateCols.decision
        || srcCell.getColumn() === candidateCols.department
        || srcCell.getColumn() === candidateCols.shift) {
        var data = '{"action": "sort"}';
        fetchPost(data);
    }
}

function sortDesk(deskCode) {
    var deskName = deskPrefix + deskCode;
    getMetadataSS(deskName).getSheetByName(deskName).getRange(controlRange).sort({column : candidateCols.status, ascending: false})
}