document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPassword").value;
    var role = document.getElementById("regRole").value;
    var error = document.getElementById("registerError");
    var success = document.getElementById("registerSuccess");

    error.textContent = "";
    success.textContent = "";

    if (name == "" || email == "" || password == "" || role == "") {
        error.textContent = "Please fill in all fields.";
        return;
    }

    if (password.length < 6) {
        error.textContent = "Password must have at least 6 characters.";
        return;
    }
  

    success.textContent = "Registration form validated. This demo does not save accounts.";
    document.getElementById("registerForm").reset();
});
