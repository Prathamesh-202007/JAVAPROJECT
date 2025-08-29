async function loadProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("studentRoll").textContent = user.roll;
  document.getElementById("studentName").textContent = user.name;
  document.getElementById("studentEmail").textContent = user.email;
  document.getElementById("studentRole").textContent = user.role;

  await loadAttendance();
}

async function loadStudentAttendance() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  try {
    const res = await fetch(`http://localhost:8080/api/attendance/student/${user.id}`);
    const attendance = await res.json();

    const attendedList = document.getElementById("attendedList");
    const missedList = document.getElementById("missedList");
    attendedList.innerHTML = "";
    missedList.innerHTML = "";

    let total = attendance.length;
    let present = 0;

    attendance.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `PRN: ${a.roll} | ${a.studentName} | ${a.date} | ${a.status}`;
      if (a.status === "Present") {
        attendedList.appendChild(li);
        present++;
      } else missedList.appendChild(li);
    });

    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById("totalClasses").textContent = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("attendancePercent").textContent = percent + "%";
    drawChart(percent);

  } catch (err) {
    console.error(err);
  }
}

async function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));

      try {
        const res = await fetch("http://localhost:8080/api/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: user.id, qrCode: decodedText })
        });

        if (res.ok) {
          alert("✅ Attendance marked successfully!");
          await loadAttendance();
        } else {
          const data = await res.json();
          alert("❌ " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error marking attendance.");
      }

      html5QrCode.stop();
    },
    () => {}
  );
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

loadProfile();
