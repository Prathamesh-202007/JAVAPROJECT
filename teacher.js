// ✅ Generate QR code
async function generateQRCode() {
  try {
    const res = await fetch("/api/attendance/qr/generate", { method: "POST" });

    if (!res.ok) throw new Error("Failed to generate QR");

    const data = await res.json();
    console.log("QR Data:", data);

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; // clear old QR

    new QRCode(qrContainer, {
      text: data.qrCode,
      width: 200,
      height: 200
    });
    
    document.getElementById("qr-info").innerText =
      "Session ID: " + data.qrCode;

    alert("✅ QR Code generated. Students can scan now!");
  } catch (err) {
    console.error(err);
    alert("❌ Error generating QR.");
  }
}

// Load students
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:8082/api/users/students"); // ✅ full backend path
    if (!res.ok) throw new Error("Failed to fetch students");

    const students = await res.json();
    console.log("Students:", students);

    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";

    students.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s.username; // use correct field
      studentList.appendChild(li);
    });

    document.getElementById("total-students").innerText = students.length;
  } catch (err) {
    console.error("Failed to load students:", err);
    const studentList = document.getElementById("student-list");
    if(studentList) studentList.innerHTML = "<li>No students found.</li>";
  }
}

// Load attendance
async function loadAttendance() {
  try {
    const res = await fetch("/api/attendance/all"); // ✅ correct endpoint
    if (!res.ok) throw new Error("Failed to fetch attendance");

    const records = await res.json();
    console.log("Attendance:", records);

    const table = document.getElementById("attendance-table");
    table.innerHTML = "";
    records.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.student?.name || r.studentId}</td>
        <td>${r.date}</td>
        <td>${r.status}</td>
      `;
      table.appendChild(row);
    });

    document.getElementById("present-today").innerText =
      records.filter(r => r.status === "PRESENT").length;
  } 	  catch (err) {
	    console.error("Failed to load attendance:", err);
	    document.getElementById("attendance-table").innerHTML =
	      "<tr><td colspan='5'>No attendance records available.</td></tr>";
	  }
}
	function logout() {
	    localStorage.removeItem("loggedInUser");
	    window.location.href = "login.html";
	}
// ✅ Load data on page load
window.onload = () => {
  loadStudents();
  loadAttendance();
};
