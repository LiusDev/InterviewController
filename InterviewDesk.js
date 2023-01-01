// TODO find candinate infomation by ID from check_in sheet (ID, Name, Department, Interview time), update to the same row of interview desk sheet
var checkinSheet = checkinSS.getSheetByName('Check_in');
var interviewDeskSS = desksMap['Bàn PV 1'];
var interviewDeskSheet = interviewDeskSS.getSheetByName('Bàn PV 1')
function checkCandinateIdUpdate() {
    var idCols = interviewDeskSheet.getRange('B2:B').getValues();
    idCols.forEach(function(id) {
        if(id[0] !== '') {
            updateInterviewDesk(id[0]);
        };
    });
}

function updateInterviewDesk(id) {
    var checkinList = checkinSheet.getRange('B2:E').getValues();
    checkinList.forEach(function(checkinCaninate) {
        if(checkinCaninate[0] === id) {
            var name = checkinCaninate[1];
            var department = checkinCaninate[2];
            var interviewTime = checkinCaninate[3];
            var interviewDeskRow = interviewDeskSheet.getRange('B2:B').getValues().indexOf(id) + 3;
            interviewDeskSheet.getRange('C' + interviewDeskRow).setValue(name);
            interviewDeskSheet.getRange('D' + interviewDeskRow).setValue(department);
            interviewDeskSheet.getRange('E' + interviewDeskRow).setValue(interviewTime);
            interviewDeskSheet.getRange('F' + interviewDeskRow).setValue('1_Đang duyệt hồ sơ');
        }
    })
}