async function scrapeJobIdsAndSendToSheet() {
  // ⚠️ นำ Web App URL ที่ได้จาก Apps Script มาวางตรงนี้ในเครื่องหมายคำพูด
  const WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycby_uvXV0E--uSxTbrDbd7r8uLCaUyFNs5b3CGXMaj-VaIKd-AufaAeHwXqFj74_FCo/exec';

  let allJobIds = new Set();
  let page = 1;
  let oldFirstId = null;

  console.log("🚀 เริ่มการดึงข้อมูลและส่งเข้า Google Sheets แบบ Real-time...");

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const getFirstJobIdValue = () => {
    const firstRowCol = document.querySelector(
      "table.table-auto tbody tr td:nth-child(2)",
    );
    return firstRowCol ? firstRowCol.innerText.trim() : null;
  };

  while (true) {
    console.log(`🔄 กำลังกวาดข้อมูลหน้า ${page}...`);

    let waitTime = 0;
    const maxWaitTime = 20000;
    const checkInterval = 500;

    while (true) {
      let currentFirstId = getFirstJobIdValue();

      if (currentFirstId && currentFirstId !== oldFirstId) {
        await sleep(2000);
        oldFirstId = currentFirstId;
        break;
      }

      if (waitTime >= maxWaitTime) {
        console.error("⏱️ หมดเวลารอข้อมูลหน้าใหม่");
        break;
      }

      await sleep(checkInterval);
      waitTime += checkInterval;
    }

    if (!oldFirstId) {
      console.log("❌ ไม่สามารถดึงข้อมูลบรรทัดแรกได้");
      break;
    }

    // กวาดข้อมูลในหน้านี้
    const rows = document.querySelectorAll("table.table-auto tbody tr");
    let batchIds = []; // เก็บข้อมูลเฉพาะของหน้านี้เพื่อส่งไป Sheet

    rows.forEach((row) => {
      const cols = row.querySelectorAll("td");
      if (cols.length > 1) {
        const jobId = cols[1].innerText.trim();
        // เช็คว่ารหัสใบงานไม่ซ้ำกับที่เคยดึงมาแล้ว
        if (jobId && !allJobIds.has(jobId)) {
          allJobIds.add(jobId);
          batchIds.push(jobId);
        }
      }
    });

    // 🟢 ยิงข้อมูลของหน้านี้เข้า Google Sheets
    if (batchIds.length > 0) {
      console.log(
        `📤 กำลังส่งข้อมูลหน้า ${page} จำนวน ${batchIds.length} รายการเข้า Sheet...`,
      );
      fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // เลี่ยงปัญหา CORS จากหน้าเว็บต้นทาง
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ ids: batchIds }),
      }).catch((err) => console.error("Error sending to sheet:", err));
    }

    // หาปุ่ม "หน้าถัดไป"
    const paths = document.querySelectorAll("path");
    let nextBtn = null;
    for (let path of paths) {
      if (
        path.getAttribute("d") ===
        "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
      ) {
        nextBtn = path.closest("button");
        break;
      }
    }

    // เช็คหน้าสุดท้าย
    if (!nextBtn || nextBtn.hasAttribute("disabled") || nextBtn.disabled) {
      console.log("✅ ดึงข้อมูลครบทุกหน้าแล้ว!");
      break;
    }

    nextBtn.click();
    page++;
  }

  console.log(
    `🎉 เรียบร้อย! ดึงรหัสใบงานทั้งหมด ${allJobIds.size} รายการ และส่งเข้า Google Sheets เรียบร้อยแล้ว`,
  );
}

// สั่งรันสคริปต์
scrapeJobIdsAndSendToSheet();
