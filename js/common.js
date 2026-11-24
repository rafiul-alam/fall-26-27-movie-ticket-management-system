function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    var digits = phone.replace(/\D/g, "");
    return /^\+?[0-9\s()-]{7,20}$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}

function escapeHtml(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getLoggedInUser() {
    var email = sessionStorage.getItem("mtms_user");
    if (!email) {
        return null;
    }
    var users = loadData("users", defaultUsers);
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email && users[i].status == "Active") {
            return users[i];
        }
    }
    return null;
}

function requireRole(role) {
    var user = getLoggedInUser();
    if (user == null || user.role != role) {
        window.location.href = "login.html";
        return { name: "", email: "", role: role };
    }
    var link = document.getElementById("logoutLink");
    if (link) {
        link.addEventListener("click", function() {
            sessionStorage.removeItem("mtms_user");
        });
    }
    return user;
}

function addActivity(text) {
    var list = loadData("activity", []);
    list.push({ text: text, time: new Date().toLocaleString() });
    saveData("activity", list);
}
