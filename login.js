// 👁️ Toggle password visibility
function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// 🔑 Login user
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert(errorText || "Login failed!");
      return;
    }

    const user = await res.json();
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role.toLowerCase() === "teacher") {
      window.location.href = "teacher.html";
    } else {
      window.location.href = "std.html";
    }
  } catch (err) {
    console.error("Error connecting to server:", err);
    alert("⚠️ Could not connect to server. Is backend running?");
  }
}
