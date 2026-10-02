function doPost(e) {
  try {
    // เลือก Sheet ที่กำลังเปิดใช้งานอยู่
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // รับข้อมูลที่ส่งมาจาก Console (รับเป็น Text เพื่อเลี่ยงปัญหา CORS แล้วมาแปลงเป็น JSON)
    var data = JSON.parse(e.postData.contents);
    var ids = data.ids;
    
    // ถ้ารับข้อมูลมาได้ ให้เขียนลง Sheet รวดเดียว
    if (ids && ids.length > 0) {
      var rows = ids.map(function(id) { return [id]; });
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 1).setValues(rows);
    }
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
