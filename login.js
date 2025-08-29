function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:8081/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            // If backend returns 401 or any error
            const errorText = await res.text();
            alert(errorText || "Login failed!");
            return;
        }

        const user = await res.json();

        // Store user info in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Redirect based on role
        if (user.role === "TEACHER") {
            window.location.href = "teacher.html";
        } else {
            window.location.href = "std.html";
        }

    } catch (err) {
        console.error("Error connecting to server:", err);
        alert("⚠️ Could not connect to server. Is backend running?");
    }
}
