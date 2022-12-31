const desksMap = {
  // "deskCode": "deskSS"
};
const checkinSheetName = 'Check_in';
const controllingSheetName = 'Điều Phối';
const checkinSS = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1_EktyzRhUtTURaUPeZpmBO8-qrkWBLNFZtHyF6Nd2ec');
const controllingSS = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1gpXbVMlSQBAODvia6JCI_y0o-TlgjKJCDDdHHMRkvl0');

function put(deskCode, deskSS) {
  desksMap.set(deskCode, deskSS);
}

function remove(deskCode) {
  desksMap.set(deskCode, null);
}

function generateDeskSS(deskCode) {
  const deskSS = SpreadsheetApp.create(deskCode);
  put(deskCode, deskSS);
}