// Toggle password visibility
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

// Login function
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    alert("✅ Login successful!");
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    if (user.role.toLowerCase() === "teacher") {
      window.location.href = "teacher.html";
    } else {
      window.location.href = "std.html";
    }
  } else {
    alert("❌ Invalid email or password!");
  }
}
