// Toggle password for multiple fields
function togglePassword(id) {
  const pass = document.getElementById(id);
  pass.type = pass.type === "password" ? "text" : "password";
}

// Register function
function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const role = document.getElementById("role").value;

  if (password !== confirm) {
    alert("❌ Passwords do not match!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.email === email)) {
    alert("⚠️ User already registered. Please login.");
    window.location.href = "login.html";
    return;
  }

  users.push({ name, phone, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Registered successfully! Please login.");
  window.location.href = "login.html";
}
