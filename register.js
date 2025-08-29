// 👁️ Toggle password visibility
function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// 📝 Register User
async function registerUser(event) {
  event.preventDefault();

  // ✅ match HTML ids
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const role = document.getElementById("role").value;

  if (password !== confirm) {
    alert("❌ Passwords do not match!");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8081/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, phone, email, password, role })
    });

    if (res.ok) {
      alert("✅ Registered successfully! Please login.");
      window.location.href = "login.html"; // redirect
    } else {
      const text = await res.text();
      alert("⚠️ Registration failed: " + text);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error connecting to server.");
  }
}
