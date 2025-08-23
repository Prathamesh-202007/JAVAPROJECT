function loadProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
    return;
  }
  document.getElementById("studentRoll").textContent = user.roll || user.prn || "N/A";
  document.getElementById("studentName").textContent = user.name;
  document.getElementById("studentEmail").textContent = user.email;
  document.getElementById("studentRole").textContent = user.role;
  loadAttendance();
}

function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      const currentQR = localStorage.getItem("currentQR");
      if (decodedText === currentQR) {
        alert("✅ Attendance marked successfully!");

        let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        attendance.push({
          roll: user.roll || user.prn,
          student: user.name,
          status: "Present",
          time: new Date().toLocaleString()
        });
        localStorage.setItem("attendance", JSON.stringify(attendance));

        loadAttendance();
        html5QrCode.stop();
      } else {
        alert("❌ Invalid QR code!");
      }
    },
    () => {}
  );
}

function loadAttendance() {
  const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  const attendedList = document.getElementById("attendedList");
  const missedList = document.getElementById("missedList");

  attendedList.innerHTML = "";
  missedList.innerHTML = "";

  attendance.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `PRN: ${a.roll} | ${a.student} | ${a.time} | ${a.status}`;
    if (a.status === "Present") attendedList.appendChild(li);
    else missedList.appendChild(li);
  });

  // Summary
  const total = attendance.length;
  const present = attendance.filter(a => a.status === "Present").length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0; // number, not string

  document.getElementById("totalClasses").textContent = total;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("attendancePercent").textContent = percent + "%";

  drawChart(percent); // update chart every time
}

function drawChart(percent) {
  const canvas = document.getElementById("attendanceChart");
  if (!canvas) return; // canvas not on page

  const ctx = canvas.getContext("2d");

  // Handle high-DPI so the chart isn’t blurry / clipped
  const dpr = window.devicePixelRatio || 1;
  const logicalSize = 200; // CSS pixels
  canvas.style.width = logicalSize + "px";
  canvas.style.height = logicalSize + "px";
  canvas.width = logicalSize * dpr;
  canvas.height = logicalSize * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing space

  const centerX = logicalSize / 2;
  const centerY = logicalSize / 2;
  const radius = 80;
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const endAngle = -Math.PI / 2 + (Math.PI * 2) * (pct / 100);

  // Clear
  ctx.clearRect(0, 0, logicalSize, logicalSize);

  // Track
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 12;
  ctx.stroke();

  // Progress
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px 'Segoe UI', Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pct + "%", centerX, centerY);
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

loadProfile();
