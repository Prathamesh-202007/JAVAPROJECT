let html5QrCode = null;
let currentStudent = null;

// Load student profile
async function loadProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
    return;
  }

  currentStudent = user; // ✅ store globally

  // Fill profile safely
  document.getElementById("studentRoll").textContent = user.id;
  document.getElementById("studentName").textContent = user.username;
  document.getElementById("studentEmail").textContent = user.email;
  document.getElementById("studentRole").textContent = user.role;

  await loadAttendance(user.id);
}

// Fetch attendance records
async function loadAttendance(studentId) {
  try {
    const res = await fetch(`/api/attendance/student/${studentId}`);
    const attendance = await res.json();

    const attendedList = document.getElementById("attendedList");
    const missedList = document.getElementById("missedList");
    attendedList.innerHTML = "";
    missedList.innerHTML = "";

    let total = attendance.length;
    let present = 0;

    attendance.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.date} | ${a.status}`;
      if (a.status.toUpperCase() === "PRESENT") {
        attendedList.appendChild(li);
        present++;
      } else {
        missedList.appendChild(li);
      }
    });

    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById("totalClasses").textContent = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("attendancePercent").textContent = percent + "%";

    drawChart(percent);
  } catch (err) {
    console.error("⚠️ Error loading attendance:", err);
  }
}

// Start QR scanner
function startScanner() {
  if (typeof Html5Qrcode === "undefined") {
    alert("⚠️ QR library not loaded. Check script order.");
    return;
  }

  if (html5QrCode) {
    // stop first if already running
    html5QrCode.stop().catch(() => {}).finally(() => {
      html5QrCode = null;
      initScanner();
    });
  } else {
    initScanner();
  }
}

function initScanner() {
  console.log("▶️ Starting scanner...");
  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" }, // rear camera
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      console.log("✅ QR Code:", decodedText);
      alert("Scanned: " + decodedText);

      stopScanner();               // auto stop after scan
      markAttendance(decodedText); // send to backend
    },
    (err) => {
      console.log("Scan error:", err);
    }
  ).catch(err => {
    console.error("❌ Camera start failed:", err);
    alert("⚠️ Could not start scanner. Check camera permissions.");
  });
}

// Stop QR scanner
function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      console.log("⏹️ Scanner stopped");
      html5QrCode = null; // reset
    }).catch(err => console.error("❌ Failed to stop scanner", err));
  }
}

// Mark Attendance API Call
function markAttendance(sessionId) {
  if (!currentStudent) {
    alert("⚠️ Student info not loaded!");
    return;
  }

  fetch("/api/attendance/mark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId: currentStudent.id, // ✅ from profile
      lectureId: 1,                 // temporary, replace later
      sessionId: sessionId
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to mark attendance");
      return res.json();
    })
    .then(data => {
      console.log("✅ Attendance marked:", data);
      alert("✅ Attendance marked successfully!");
      loadAttendance(currentStudent.id); // refresh summary
    })
    .catch(err => {
      console.error("❌ Error:", err);
      alert("❌ Failed to mark attendance");
    });
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser"); // ✅ clear storage
  window.location.href = "login.html";
}

// Draw simple chart
function drawChart(percent) {
  const ctx = document.getElementById("attendanceChart").getContext("2d");
  ctx.clearRect(0, 0, 200, 200);
  ctx.beginPath();
  ctx.arc(100, 100, 90, 0, (percent / 100) * 2 * Math.PI);
  ctx.lineWidth = 15;
  ctx.strokeStyle = "green";
  ctx.stroke();
}

// Load profile when page opens
window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});
