var controlRange = "A2:I";

function sort() {
    getMetadataSS(controllingSheetName)
        .getSheetByName(controllingSheetName)
        .getRange(controlRange)
        .sort( { column : candidateCols.status, ascending: true });
}

function moveToDeskSheet(id, deskCode) {
    var deskName = deskPrefix + deskCode;
    var deskSS = getMetadataSS(deskName);
    var deskSheet = deskSS.getSheetByName(deskName);
    var controllerSheet = getMetadataSS(controllingSheetName).getSheetByName(controllingSheetName);
    // move an id to desk sheet
    var formula = '=COUNTA(\'' + deskName + '\'!B:B) + 1';
    var lineNo = evalFormula(deskSS, formula);
    log("lineNo: " + lineNo);
    deskSheet.getRange(lineNo, candidateCols.id).setValue(id);
    var checkinData = getCheckinData(id);
    fillData(deskSheet, lineNo, id, checkinData);
    if (id !== '') {
        deskSheet.getRange(lineNo, candidateCols.status).setValue(statusValues[1]);
    }
    controllerSheet.getRange(controlRange).getValues().find(function (row, index) {
        if (row[candidateCols.id - 1] === id) {
            controllerSheet.getRange(index + 2, candidateCols.department).setFormula('=\'' + deskName + '\'!C' + lineNo);
            controllerSheet.getRange(index + 2, candidateCols.shift).setFormula('=\'' + deskName + '\'!D' + lineNo);
            controllerSheet.getRange(index + 2, candidateCols.status).setFormula('=\'' + deskName + '\'!E' + lineNo);
            controllerSheet.getRange(index + 2, candidateCols.decision).setFormula('=\'' + deskName + '\'!H' + lineNo);
        }
    });
}

function removeFromDesks(id, exceptDesk) {
    //TODO: remove id from all desks
}

function onEditController(event){
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcSheet.getName() !== controllingSheetName) {
        return;
    }
    if (srcCell.getColumn() === candidateCols.id) {
        var id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        log("id: " + id);
        if (id !== '') {
            updateControllerData(id);
        } else {
            fillData(srcSheet, srcCell.getRow(), '', []);
        }
    }
    if (srcCell.getColumn() === candidateCols.desk) {
        id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        var deskCode = srcSheet.getRange(srcCell.getRow(), candidateCols.desk).getValue();
        moveToDeskSheet(id, deskCode);
    }
}

function updateControllerData(id) {
    var controllerSheet = getMetadataSS(controllingSheetName).getSheetByName(controllingSheetName);
    var checkinData = getCheckinData(id);
    var formula = '=COUNTA(\'' + controllerSheet.getName() + '\'!B:B) + 1';
    var lineNo = evalFormula(controllerSheet.getParent(), formula);
    controllerSheet.getRange(lineNo, candidateCols.id).setValue(id);
    fillData(controllerSheet, lineNo, id, checkinData);
    if (id !== '') {
        controllerSheet.getRange(lineNo, candidateCols.status).setValue(statusValues[0]);
    }
}

function removeControllerData(id) {
    var controllerSheet = getMetadataSS(controllingSheetName).getSheetByName(controllingSheetName);
    var controllerData = controllerSheet.getRange(controlRange).getValues();
    controllerData.find(function (row, index) {
        if (row[candidateCols.id - 1] === id) {
            fillData(controllerSheet, index + 2, '', []);
        }
    });
}

function doPostController(e) {
    var data = JSON.parse(e.postData.contents);
    if (data.action === "sort") {
        sort();
    }
    if (data.action === "update") {
        updateControllerData(data.id);
    }
    if (data.action === "remove") {
        removeControllerData(data.id);
    }
}

