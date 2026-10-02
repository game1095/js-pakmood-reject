async function processOrdersFromSheet() {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxo1zpO4MSdNveXW-WbWRphz__JVZ-KXZWufTl5c6sZOLp38v92g7WTr0UASHUb9i2HKA/exec';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const simulateClick = (element) => {
    if (!element) return;
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      element.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
    });
  };

  console.log("⏳ กำลังดึงข้อมูลจาก Google Sheet...");

  try {
    const response = await fetch(WEB_APP_URL);
    const data = await response.json();
    const ids = data.ids;

    if (!ids || ids.length === 0) {
      console.log("❌ ไม่พบข้อมูลใน Google Sheet");
      return;
    }

    console.log(`✅ ดึงข้อมูลสำเร็จ จำนวน ${ids.length} รายการ`);

    for (let i = 0; i < ids.length; i++) {
      let orderId = ids[i];
      console.log(`\n--- กำลังประมวลผลคิวที่ ${i + 1}/${ids.length} : ใบงาน ${orderId} ---`);

      // 1. ค้นหาและกรอกรหัสใบงาน
      let inputEl = document.querySelector('input[name="orderId"]');
      if (inputEl) {
        inputEl.value = orderId;
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`📝 พิมพ์ค้นหาใบงาน: ${orderId}`);
      } else {
        console.log(`❌ หาช่องพิมพ์ค้นหาไม่พบ`);
      }

      await sleep(2000); // รอระบบค้นหา

      // 2. คลิกที่รายการใบงาน
      let clickTarget = document.querySelector('td[data-label="รหัสใบงาน"]');
      if (clickTarget) {
        simulateClick(clickTarget);
        console.log(`👆 คลิกที่รายการใบงานเรียบร้อย`);
      } else {
        console.log(`❌ หารายการใบงานไม่พบ`);
      }

      console.log("รอหน้าต่างรายละเอียดโหลด 3 วินาที...");
      await sleep(3000);

      // 3. กดปุ่ม "ไม่อนุมัติปิดงาน"
      console.log("🔍 กำลังหาปุ่ม 'ไม่อนุมัติปิดงาน'...");
      let spans = Array.from(document.querySelectorAll('span.px-2'));
      let rejectBtnSpan = spans.find(el => el.innerText.trim() === 'ไม่อนุมัติปิดงาน');
      
      if (rejectBtnSpan) {
        let clickableReject = rejectBtnSpan.closest('button') || rejectBtnSpan;
        simulateClick(clickableReject);
        console.log("👆 คลิกปุ่ม 'ไม่อนุมัติปิดงาน' เรียบร้อย");
      } else {
        console.log("❌ ไม่พบปุ่ม 'ไม่อนุมัติปิดงาน'");
      }

      await sleep(1500); 

      // 4. กด Dropdown และเลือก "จำเป็นต้องดำเนินการ"
      console.log("🔍 กำลังจัดการ Dropdown...");
      let dropdownCombos = document.querySelectorAll('[role="combobox"]');
      if (dropdownCombos.length > 0) {
        simulateClick(dropdownCombos[0]);
        await sleep(1500); // รอ Dropdown กาง
        
        let options = Array.from(document.querySelectorAll('li[role="option"]'));
        let targetOption = options.find(el => el.textContent.includes('จำเป็นต้องดำเนินการ'));
        
        if (targetOption) {
          simulateClick(targetOption);
          console.log("👆 เลือก 'จำเป็นต้องดำเนินการ' เรียบร้อย");
        } else {
          console.log("❌ ไม่พบตัวเลือก 'จำเป็นต้องดำเนินการ'");
        }
      } else {
        console.log("❌ ไม่พบช่อง Dropdown");
      }

      await sleep(1000); 

      // 5. ใส่ "-" ใน textarea
      console.log("🔍 กำลังหาช่องกรอก description...");
      let textarea = document.querySelector('textarea[name="description"]');
      if (textarea) {
        textarea.value = "-";
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("📝 กรอก '-' ลงในช่องรายละเอียดเรียบร้อย");
      } else {
        console.log("❌ ไม่พบช่อง textarea[name='description']");
      }

      await sleep(1000);

      // 6. กดปุ่ม "มอบหมายงานใหม่"
      console.log("🔍 กำลังหาปุ่ม 'มอบหมายงานใหม่'...");
      let assignSpans = Array.from(document.querySelectorAll('span.px-2'));
      let assignBtnSpan = assignSpans.find(el => el.innerText.trim() === 'มอบหมายงานใหม่');
      
      if (assignBtnSpan) {
        let clickableAssign = assignBtnSpan.closest('button') || assignBtnSpan;
        simulateClick(clickableAssign);
        console.log("👆 คลิกปุ่ม 'มอบหมายงานใหม่' เรียบร้อย");
      } else {
        console.log("❌ ไม่พบปุ่ม 'มอบหมายงานใหม่'");
      }

      await sleep(2000); 

      // 7. กดปุ่มลูกศรย้อนกลับ (อ้างอิงจากรหัสรูปภาพ path d="...")
      console.log("🔍 กำลังหาปุ่ม 'ย้อนกลับ'...");
      let backPath = document.querySelector('path[d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"]');
      
      if (backPath) {
        // หาตัวคลุมที่เป็น button หรือ svg เพื่อให้คลิกได้ผลชัวร์สุด
        let backBtn = backPath.closest('button') || backPath.closest('svg') || backPath;
        simulateClick(backBtn);
        console.log("👆 คลิกปุ่ม 'ย้อนกลับ' เรียบร้อย");
      } else {
        console.log("❌ ไม่พบปุ่ม 'ย้อนกลับ'");
      }

      console.log("รอระบบกลับสู่หน้าหลัก 3 วินาที...");
      await sleep(3000);
      
    }

    console.log("🎉 จบการทำงานครบทุกรายการใน Sheet แล้ว!");

  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
  }
}

processOrdersFromSheet();
