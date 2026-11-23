document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var role = document.getElementById("role").value;
    var message = document.getElementById("loginError");

    message.textContent = "";

    if (email == "" || password == "" || role == "") {
        message.textContent = "Please fill in all fields.";
        return;
    }

    var accounts = [
        { email: "admin@mtms.com", password: "admin123", role: "admin" },
        { email: "buyer@mtms.com", password: "buyer123", role: "buyer" },
        { email: "employee@mtms.com", password: "staff123", role: "employee" },
        { email: "renter@mtms.com", password: "renter123", role: "renter" }
    ];

    var found = false;

    for (var i = 0; i < accounts.length; i++) {
        if (email == accounts[i].email && password == accounts[i].password && role == accounts[i].role) {
            found = true;
            break;
        }
    }

    if (found) {
        window.location.href = role + ".html";
    } else {
        message.textContent = "Email, password or role is incorrect.";
    }
});
