document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var role = document.getElementById("role").value;
    var message = document.getElementById("loginError");

    message.className = "error";
    message.textContent = "";

    if (email == "" || password == "" || role == "") {
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (!isValidEmail(email)) {
        message.textContent = "Please enter a valid email address.";
        return;
    }

    var users = loadData("users", defaultUsers);
    var user = null;

    for (var i = 0; i < users.length; i++) {
        if (email == users[i].email && password == users[i].password && role == users[i].role) {
            user = users[i];
            break;
        }
    }

    if (user == null) {
        message.textContent = "Email, password or role is incorrect.";
        return;
    }

    if (user.status == "Pending") {
        message.textContent = "Your account is waiting for admin approval.";
        return;
    }

    if (user.status == "Suspended") {
        message.textContent = "Your account is suspended. Please contact the administrator.";
        return;
    }

    sessionStorage.setItem("mtms_user", user.email);
    addActivity(user.name + " logged in as " + user.role);
    message.className = "success";
    message.textContent = "Login successful. Redirecting...";

    setTimeout(function() {
        window.location.href = role + ".html";
    }, 600);
});

var demoRows = document.querySelectorAll(".demo-row");

for (var d = 0; d < demoRows.length; d++) {
    demoRows[d].addEventListener("click", function() {
        document.getElementById("email").value = this.getAttribute("data-email");
        document.getElementById("password").value = this.getAttribute("data-password");
        document.getElementById("role").value = this.getAttribute("data-role");
        document.getElementById("loginError").textContent = "";
    });
}
