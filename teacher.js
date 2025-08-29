// QR Code generation
async function generateQRCode() {
  try {
    const res = await fetch("http://localhost:8080/api/attendance/generate-qr", { method: "POST" });
    const data = await res.json();

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, { text: data.qrCode, width: 200, height: 200 });

    alert("✅ QR Code generated. Students can scan now!");
  } catch (err) {
    console.error(err);
    alert("❌ Error generating QR.");
  }
}

// Load all students
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:8080/api/teacher/students");
    const students = await res.json();

    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    students.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s.name + " (" + s.email + ")";
      studentList.appendChild(li);
    });

    // Update total students
    document.getElementById("total-students").textContent = students.length;
  } catch (err) {
    console.error(err);
    alert("❌ Error loading students.");
  }
}

// Load attendance records
async function loadTeacherAttendance() {
  try {
    const res = await fetch("http://localhost:8080/api/teacher/attendance");
    const attendance = await res.json();

    const tableBody = document.getElementById("attendance-table");
    tableBody.innerHTML = "";

    let presentCount = 0;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    attendance.forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${a.studentName}</td><td>${a.date}</td><td>${a.status}</td>`;
      tableBody.appendChild(tr);

      // Count present today
      if (a.status.toLowerCase() === "present" && a.date === today) {
        presentCount++;
      }
    });

    // Update present today count
    document.getElementById("present-today").textContent = presentCount;
  } catch (err) {
    console.error(err);
    alert("❌ Error loading attendance.");
  }
}

// Load data on page load
window.onload = () => {
  loadStudents();
  loadAttendance();
};
