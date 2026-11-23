var renterMovies = [];
var rentalApplications = [];

function showRenterMovies(list) {
    var table = document.getElementById("renterMovieTable");
    table.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        table.innerHTML += "<tr><td>" + list[i].title + "</td><td>" + list[i].genre + "</td><td>" + list[i].duration + " min</td><td>Pending</td><td><button class='small-button' onclick='editRenterMovie(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteRenterMovie(" + i + ")'>Delete</button></td></tr>";
    }
}

function editRenterMovie(index) {
    var title = prompt("Movie title", renterMovies[index].title);
    var genre = prompt("Genre", renterMovies[index].genre);
    var duration = prompt("Duration", renterMovies[index].duration);
    if (title != null && genre != null && duration != null && title != "" && genre != "" && duration != "") {
        renterMovies[index] = { title: title, genre: genre, duration: duration };

        showRenterMovies(renterMovies);
    }
}

function deleteRenterMovie(index) {
    renterMovies.splice(index, 1);

    showRenterMovies(renterMovies);
}

document.getElementById("renterMovieForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var title = document.getElementById("renterMovieTitle").value;
    var genre = document.getElementById("renterMovieGenre").value;
    var duration = document.getElementById("renterMovieDuration").value;
    if (title == "" || genre == "" || duration == "") {
        alert("Please fill in all movie details.");
        return;
    }
    renterMovies.push({ title: title, genre: genre, duration: duration });

    showRenterMovies(renterMovies);
    this.reset();
});

function showRentals(list) {
    var table = document.getElementById("rentalTable");
    table.innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        table.innerHTML += "<tr><td>" + list[i].movie + "</td><td>" + list[i].theater + "</td><td>" + list[i].date + "</td><td>" + list[i].time + "</td><td>Pending</td><td><button class='small-button' onclick='editRental(" + i + ")'>Edit</button> <button class='small-button delete-button' onclick='deleteRental(" + i + ")'>Delete</button></td></tr>";
    }
    document.getElementById("renterScreenings").textContent = list.length;
}

function editRental(index) {
    var movie = prompt("Movie title", rentalApplications[index].movie);
    var theater = prompt("Theater", rentalApplications[index].theater);
    var date = prompt("Date (YYYY-MM-DD)", rentalApplications[index].date);
    var time = prompt("Time", rentalApplications[index].time);
    if (movie != null && theater != null && date != null && time != null && movie != "" && theater != "" && date != "" && time != "") {
        rentalApplications[index] = { movie: movie, theater: theater, date: date, time: time };

        showRentals(rentalApplications);
    }
}

function deleteRental(index) {
    rentalApplications.splice(index, 1);

    showRentals(rentalApplications);
}

document.getElementById("rentalForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var movie = document.getElementById("rentalMovie").value;
    var theater = document.getElementById("rentalTheater").value;
    var date = document.getElementById("rentalDate").value;
    var time = document.getElementById("rentalTime").value;
    if (movie == "" || theater == "" || date == "" || time == "") {
        alert("Please complete the rental application.");
        return;
    }
    rentalApplications.push({ movie: movie, theater: theater, date: date, time: time });

    showRentals(rentalApplications);
    this.reset();
});

document.getElementById("renterMovieSearch").addEventListener("input", function() {
    var searchText = this.value.toLowerCase();
    var result = renterMovies.filter(function(item) {
        return item.title.toLowerCase().includes(searchText);
    });
    showRenterMovies(result);
});

document.getElementById("rentalSearch").addEventListener("input", function() {
    var searchText = this.value.toLowerCase();
    var result = rentalApplications.filter(function(item) {
        return item.movie.toLowerCase().includes(searchText) || item.theater.toLowerCase().includes(searchText);
    });
    showRentals(result);
});

showRenterMovies(renterMovies);
showRentals(rentalApplications);
