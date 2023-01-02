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
            controllerSheet.getRange(index + 2, candidateCols.department).setFormula('=QUERY(\'' + deskName + '\'!$B:$F; "select D,E,F where B = \'' + id + '\'")');
            controllerSheet.getRange(index + 2, candidateCols.shift).setValue('');
            controllerSheet.getRange(index + 2, candidateCols.status).setValue('');
            controllerSheet.getRange(index + 2, candidateCols.decision).setFormula('=QUERY(\'' + deskName + '\'!$B:$H; "select H where B = \'' + id + '\'")');
        }
    });
    removeFromDesks(id, deskCode);
}

function removeFromDesks(id, exceptDesk) {
    //remove id from all desks except exceptDesk
    var desks = getDesks();
    desks.forEach(function (desk) {
        if (desk[deskConfigCols.room] !== exceptDesk) {
            var deskName = deskPrefix + desk[deskConfigCols.room];
            var deskSS = getMetadataSS(deskName);
            var deskSheet = deskSS.getSheetByName(deskName);
            var deskData = deskSheet.getRange(controlRange).getValues();
            deskData.find(function (row, index) {
                if (row[candidateCols.id - 1] === id) {
                    fillData(deskSheet, index + 2, '', []);
                    sortDesk(desk[deskConfigCols.room]);
                }
            });
        }
    });

}

function onEditController(event){
    var srcSheet = event.source.getActiveSheet();
    var srcCell = srcSheet.getActiveCell();
    if (srcSheet.getName() !== controllingSheetName) {
        return;
    }
    if (srcCell.getColumn() === candidateCols.id) {
        var id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        if (id !== '') {
            updateControllerData(id);
        } else {
            fillData(srcSheet, srcCell.getRow(), '', []);
        }
    }
    if (srcCell.getColumn() === candidateCols.desk) {
        id = srcSheet.getRange(srcCell.getRow(), candidateCols.id).getValue();
        var deskCode = srcSheet.getRange(srcCell.getRow(), candidateCols.desk).getValue();
        if (deskCode === '') {
            var checkinData = getCheckinData(id);
            fillData(srcSheet, srcCell.getRow(), id, checkinData);
            if (id !== '') {
                srcSheet.getRange(srcCell.getRow(), candidateCols.status).setValue(statusValues[0]);
                srcSheet.getRange(srcCell.getRow(), candidateCols.decision).setValue('');
            }
            removeFromDesks(id, -1)
        } else {
            moveToDeskSheet(id, deskCode);
        }
    }
    sort();
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
    sort();
}

function removeControllerData(id) {
    var controllerSheet = getMetadataSS(controllingSheetName).getSheetByName(controllingSheetName);
    var controllerData = controllerSheet.getRange(controlRange).getValues();
    controllerData.find(function (row, index) {
        if (row[candidateCols.id - 1] === id) {
            if (row[candidateCols.desk - 1] !== '') {
                controllerSheet.getRange(index + 2, candidateCols.department).setValue('');
            } else {
                fillData(controllerSheet, index + 2, '', []);
            }
        }
    });
    sort();
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


