// 👁️ Toggle password visibility
function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// 📝 Register User
async function registerUser(event) {
  event.preventDefault();

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

  const payload = { username, phone, email, password, role };

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("✅ Registered successfully! Please login.");
      window.location.href = "login.html";
    } else {
      const text = await res.text();
      alert("⚠️ Registration failed: " + text);
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ Error connecting to server.");
  }
}
