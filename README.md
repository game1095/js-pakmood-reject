# 🚀 ขั้นตอนการใช้งาน

(คุณน่าจะคุ้นกับ flow ที่ออกแบบไว้แล้ว คล้ายๆ กับเวอร์ชันก่อนหน้า ขออธิบายขั้นตอนคร่าว ๆ ดังนี้ครับ)

## 📊 ส่วนที่ 1: การเตรียม Google Sheet & App Script

1. **สร้าง Google Sheet** ขึ้นมาใหม่
2. **ตั้งค่าการแชร์** เปิด Public ให้สิทธิเป็น **Editor**
3. เอาโค้ดจากไฟล์ `1.prep_google_sheet.js` ไปวางใน App Script แล้วตั้งค่าตามนี้

   ![image](https://github.com/user-attachments/assets/98c137a7-6775-4267-bd35-3580e5267ecf)

4. **คัดลอกลิงก์ App Script** ทิ้งไว้ 

   ![image](https://github.com/user-attachments/assets/0105ec62-93bd-4f5f-ac12-7f5306a910bc)


## 🕷️ ส่วนที่ 2: การดึงข้อมูล (Data Scraping)

5. เปิดไฟล์ `2.data-scraping.js` แล้วเอาลิงก์ที่คัดลอกไว้จาก **ข้อ 4** มาวางตรงนี้

   ![image](https://github.com/user-attachments/assets/ab6c8a01-8a6f-446f-adfc-640018ca9af5)

6. เอาโค้ดจาก **ข้อ 5** ไปวางใน Console หน้านี้ แล้วกด `Enter`

   ![image](https://github.com/user-attachments/assets/2428f8c5-15f1-48be-ae9d-ce422b3623bc)

7. ⏳ **รอระบบทำงาน** จนกว่าจะดึงเลขใบงานทั้งหมดลง Sheet เรียบร้อย


## ❌ ส่วนที่ 3: การจัดการใบงาน (Reject Pakmood)

8. เปิดไฟล์ `3.reject-pakmood.js` แล้วเอาลิงก์จาก App Script (จาก **ข้อ 4**) มาวางตรงนี้

   ![image](https://github.com/user-attachments/assets/09d4f72d-4cd9-4bea-a1f6-572041e28633)

9. กลับมาที่หน้าระบบเดิม แล้วเปิด Console นำโค้ดที่เตรียมเสร็จแล้วจาก **ข้อ 8** มาวาง แล้วกด `Enter`

