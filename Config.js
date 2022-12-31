const desksMap = {
  // "deskCode": "deskSS"
  'Bàn PV 1': SpreadsheetApp.openById('1Cx8smNTm7Jh8V3rCZfyZKeNRtHQOA3Gi3TFE897RRHo')
};
const checkinSheetName = 'Check_in';
const controllingSheetName = 'Điều Phối';
const checkinSS = SpreadsheetApp.openById('1_EktyzRhUtTURaUPeZpmBO8-qrkWBLNFZtHyF6Nd2ec');
const controllingSS = SpreadsheetApp.openById('1gpXbVMlSQBAODvia6JCI_y0o-TlgjKJCDDdHHMRkvl0');

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