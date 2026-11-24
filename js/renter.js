var currentUser = requireRole("renter");
var renterMovies = loadData("renterMovies", defaultRenterMovies);
var rentals = loadData("rentals", defaultRentals);
var theaters = loadData("theaters", defaultTheaters);

function matches(searchText, text) {
    return searchText == "" || text.toLowerCase().indexOf(searchText) != -1;
}

function findMyMovie(title) {
    for (var i = 0; i < renterMovies.length; i++) {
        if (renterMovies[i].owner == currentUser.email && renterMovies[i].title.toLowerCase() == title.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function findTheater(name) {
    for (var i = 0; i < theaters.length; i++) {
        if (theaters[i].name.toLowerCase() == name.toLowerCase()) {
            return theaters[i].name;
        }
    }
    return "";
}

function slotTaken(theater, date, time, ignoreIndex) {
    for (var i = 0; i < rentals.length; i++) {
        if (i != ignoreIndex && rentals[i].status != "Rejected" && rentals[i].theater == theater && rentals[i].date == date && rentals[i].time == time) {
            return true;
        }
    }
    return false;
}

function showRenterMovies() {
    var searchText = document.getElementById("renterMovieSearch").value.toLowerCase();
    var html = "";
    for (var i = 0; i < renterMovies.length; i++) {
        var m = renterMovies[i];
        if (m.owner != currentUser.email || !matches(searchText, m.title + " " + m.genre + " " + m.status)) {
            continue;
        }
        html += "<tr><td>" + escapeHtml(m.title) + "</td><td>" + escapeHtml(m.genre) + "</td><td>" + m.duration + " min</td><td>" + m.status + "</td><td><button class='small-button' onclick='editRenterMovie(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteRenterMovie(" + i + ")'>Delete</button></td></tr>";
    }
    if (html == "") {
        html = "<tr><td colspan='5'>No movies found.</td></tr>";
    }
    document.getElementById("renterMovieTable").innerHTML = html;
}

function showRentals() {
    var searchText = document.getElementById("rentalSearch").value.toLowerCase();
    var html = "";
    for (var i = 0; i < rentals.length; i++) {
        var r = rentals[i];
        if (r.owner != currentUser.email || !matches(searchText, r.movie + " " + r.theater + " " + r.date + " " + r.status)) {
            continue;
        }
        html += "<tr><td>" + escapeHtml(r.movie) + "</td><td>" + escapeHtml(r.theater) + "</td><td>" + r.date + "</td><td>" + r.time + "</td><td>" + r.status + "</td><td><button class='small-button' onclick='editRental(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteRental(" + i + ")'>Cancel</button></td></tr>";
    }
    if (html == "") {
        html = "<tr><td colspan='6'>No applications found.</td></tr>";
    }
    document.getElementById("rentalTable").innerHTML = html;
}

function showSchedule() {
    var searchText = document.getElementById("scheduleSearch").value.toLowerCase();
    var approved = [];
    for (var i = 0; i < rentals.length; i++) {
        if (rentals[i].owner == currentUser.email && rentals[i].status == "Approved") {
            approved.push(rentals[i]);
        }
    }
    approved.sort(function(a, b) {
        return (a.date + a.time).localeCompare(b.date + b.time);
    });
    var html = "";
    for (var j = 0; j < approved.length; j++) {
        var r = approved[j];
        if (matches(searchText, r.movie + " " + r.theater + " " + r.date)) {
            html += "<tr><td>" + escapeHtml(r.movie) + "</td><td>" + escapeHtml(r.theater) + "</td><td>" + r.date + "</td><td>" + r.time + "</td></tr>";
        }
    }
    if (html == "") {
        html = "<tr><td colspan='4'>No approved screenings yet.</td></tr>";
    }
    document.getElementById("scheduleTable").innerHTML = html;
}

function showPerformance() {
    var bookings = loadData("bookings", defaultBookings);
    var html = "";
    var approved = 0;
    var totalScreenings = 0;
    var totalSold = 0;
    var totalAudience = 0;
    var totalRevenue = 0;

    for (var i = 0; i < renterMovies.length; i++) {
        var m = renterMovies[i];
        if (m.owner != currentUser.email || m.status != "Approved") {
            continue;
        }
        approved++;
        var sold = 0;
        var audience = 0;
        var revenue = 0;
        var slots = {};

        for (var j = 0; j < bookings.length; j++) {
            var b = bookings[j];
            if (b.movie == m.title && b.status == "Confirmed") {
                sold += b.seats.length;
                revenue += b.totalPrice;
                slots[b.showDate + b.showTime] = true;
                if (b.checkedIn) {
                    audience += b.seats.length;
                }
            }
        }

        var screenings = Object.keys(slots).length;
        var occupancy = 0;
        if (screenings > 0) {
            occupancy = Math.round(sold / (screenings * seatCapacity) * 100);
        }
        totalScreenings += screenings;
        totalSold += sold;
        totalAudience += audience;
        totalRevenue += revenue;
        html += "<tr><td>" + escapeHtml(m.title) + "</td><td>" + screenings + "</td><td>" + sold + "</td><td>" + audience + "</td><td>৳" + revenue + "</td><td>" + occupancy + "%</td></tr>";
    }

    var totalOccupancy = 0;
    if (totalScreenings > 0) {
        totalOccupancy = Math.round(totalSold / (totalScreenings * seatCapacity) * 100);
    }
    if (html == "") {
        html = "<tr><td colspan='6'>No approved movies yet.</td></tr>";
    }

    document.getElementById("performanceTable").innerHTML = html;
    document.getElementById("renterApproved").textContent = approved;
    document.getElementById("renterScreenings").textContent = totalScreenings;
    document.getElementById("renterTickets").textContent = totalSold;
    document.getElementById("renterAudience").textContent = totalAudience;
    document.getElementById("renterRevenue").textContent = "৳" + totalRevenue;
    document.getElementById("renterOccupancy").textContent = totalOccupancy + "%";
}

function refreshAll() {
    showRenterMovies();
    showRentals();
    showSchedule();
    showPerformance();
}

function checkMovie(title, genre, duration, ignoreIndex) {
    if (title.length < 2) {
        return "Movie title must have at least 2 characters.";
    }
    if (genre == "") {
        return "Genre is required.";
    }
    if (isNaN(duration) || Number(duration) < 1 || Number(duration) > 500 || Number(duration) != Math.floor(Number(duration))) {
        return "Duration must be a whole number between 1 and 500 minutes.";
    }
    var existing = findMyMovie(title);
    if (existing != -1 && existing != ignoreIndex) {
        return "You already submitted this movie.";
    }
    return "";
}

function checkRental(movie, theater, date, time, ignoreIndex) {
    if (movie == "" || theater == "" || date == "" || time == "") {
        return "Please complete the rental application.";
    }
    var movieIndex = findMyMovie(movie);
    if (movieIndex == -1) {
        return "Submit this movie first, then apply for a theater.";
    }
    if (renterMovies[movieIndex].status != "Approved") {
        return "This movie must be approved by the admin before you can rent a theater.";
    }
    if (findTheater(theater) == "") {
        return "Theater not found. Please use a theater name created by the admin.";
    }
    if (date < todayString()) {
        return "Rental date cannot be in the past.";
    }
    if (slotTaken(findTheater(theater), date, time, ignoreIndex)) {
        return "This theater is already requested for that date and time.";
    }
    return "";
}

function editRenterMovie(index) {
    var title = prompt("Movie title", renterMovies[index].title);
    if (title == null) {
        return;
    }
    var genre = prompt("Genre", renterMovies[index].genre);
    if (genre == null) {
        return;
    }
    var duration = prompt("Duration", renterMovies[index].duration);
    if (duration == null) {
        return;
    }
    title = title.trim();
    genre = genre.trim();
    var problem = checkMovie(title, genre, duration, index);
    if (problem != "") {
        alert(problem);
        return;
    }
    renterMovies[index].title = title;
    renterMovies[index].genre = genre;
    renterMovies[index].duration = Number(duration);
    renterMovies[index].status = "Pending";
    saveData("renterMovies", renterMovies);
    addActivity(currentUser.name + " updated movie " + title);
    alert("Movie updated. It is now waiting for admin approval again.");
    refreshAll();
}

function deleteRenterMovie(index) {
    if (!confirm("Delete movie " + renterMovies[index].title + "?")) {
        return;
    }
    addActivity(currentUser.name + " deleted movie " + renterMovies[index].title);
    renterMovies.splice(index, 1);
    saveData("renterMovies", renterMovies);
    refreshAll();
}

function editRental(index) {
    if (rentals[index].status != "Pending") {
        alert("Only pending applications can be edited.");
        return;
    }
    var movie = prompt("Movie title", rentals[index].movie);
    if (movie == null) {
        return;
    }
    var theater = prompt("Theater", rentals[index].theater);
    if (theater == null) {
        return;
    }
    var date = prompt("Date (YYYY-MM-DD)", rentals[index].date);
    if (date == null) {
        return;
    }
    var time = prompt("Time (HH:MM)", rentals[index].time);
    if (time == null) {
        return;
    }
    movie = movie.trim();
    theater = theater.trim();
    date = date.trim();
    time = time.trim();
    var problem = checkRental(movie, theater, date, time, index);
    if (problem != "") {
        alert(problem);
        return;
    }
    rentals[index].movie = renterMovies[findMyMovie(movie)].title;
    rentals[index].theater = findTheater(theater);
    rentals[index].date = date;
    rentals[index].time = time;
    saveData("rentals", rentals);
    addActivity(currentUser.name + " updated a rental application");
    alert("Application updated successfully.");
    refreshAll();
}

function deleteRental(index) {
    if (!confirm("Cancel this rental application?")) {
        return;
    }
    addActivity(currentUser.name + " cancelled a rental application for " + rentals[index].movie);
    rentals.splice(index, 1);
    saveData("rentals", rentals);
    alert("Application cancelled.");
    refreshAll();
}

document.getElementById("renterMovieForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var title = document.getElementById("renterMovieTitle").value.trim();
    var genre = document.getElementById("renterMovieGenre").value.trim();
    var duration = document.getElementById("renterMovieDuration").value;
    if (title == "" || genre == "" || duration == "") {
        alert("Please fill in all movie details.");
        return;
    }
    var problem = checkMovie(title, genre, duration, -1);
    if (problem != "") {
        alert(problem);
        return;
    }
    renterMovies.push({ title: title, genre: genre, duration: Number(duration), status: "Pending", owner: currentUser.email });
    saveData("renterMovies", renterMovies);
    addActivity(currentUser.name + " submitted movie " + title);
    alert("Movie submitted. Waiting for admin approval.");
    this.reset();
    refreshAll();
});

document.getElementById("rentalForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var movie = document.getElementById("rentalMovie").value.trim();
    var theater = document.getElementById("rentalTheater").value.trim();
    var date = document.getElementById("rentalDate").value;
    var time = document.getElementById("rentalTime").value;
    var problem = checkRental(movie, theater, date, time, -1);
    if (problem != "") {
        alert(problem);
        return;
    }
    rentals.push({ movie: renterMovies[findMyMovie(movie)].title, theater: findTheater(theater), date: date, time: time, status: "Pending", owner: currentUser.email });
    saveData("rentals", rentals);
    addActivity(currentUser.name + " applied to rent " + findTheater(theater));
    alert("Application submitted. Waiting for admin approval.");
    this.reset();
    refreshAll();
});

document.getElementById("renterMovieSearch").addEventListener("input", showRenterMovies);
document.getElementById("rentalSearch").addEventListener("input", showRentals);
document.getElementById("scheduleSearch").addEventListener("input", showSchedule);

refreshAll();
