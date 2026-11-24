var ticketPrices = { Regular: 300, Premium: 450, VIP: 600 };
var seatCapacity = 12;

var movieData = {
    Avengers: { poster: "images/avengers.jpg", rating: "8.0 / 10", trailer: "eOrNdBpGMv8", hall: "Hall-01" },
    Interstellar: { poster: "images/interstellar.jpg", rating: "8.7 / 10", trailer: "zSWdZVtXT7E", hall: "Hall-02" },
    Inception: { poster: "images/inception.jpg", rating: "8.8 / 10", trailer: "YoHD9XEInc0", hall: "Hall-03" },
    Titanic: { poster: "images/titanic.jpg", rating: "7.9 / 10", trailer: "kVrqfYjkTdQ", hall: "Hall-04" }
};

function todayString() {
    var d = new Date();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + month + "-" + day;
}

var defaultUsers = [
    { name: "System Admin", email: "admin@mtms.com", password: "admin123", phone: "01700000001", role: "admin", status: "Active" },
    { name: "Demo Buyer", email: "buyer@mtms.com", password: "buyer123", phone: "01700000002", role: "buyer", status: "Active" },
    { name: "Demo Employee", email: "employee@mtms.com", password: "staff123", phone: "01700000003", role: "employee", status: "Active" },
    { name: "Demo Renter", email: "renter@mtms.com", password: "renter123", phone: "01700000004", role: "renter", status: "Active" }
];

var defaultTheaters = [
    { name: "City Cinema", location: "Dhaka", screens: 4 },
    { name: "Star Cineplex", location: "Dhaka", screens: 6 }
];

var defaultRenterMovies = [
    { title: "Interstellar", genre: "Sci-Fi", duration: 169, status: "Approved", owner: "renter@mtms.com" }
];

var defaultRentals = [
    { movie: "Interstellar", theater: "City Cinema", date: todayString(), time: "19:00", status: "Approved", owner: "renter@mtms.com" }
];

var defaultBookings = [
    { bookingId: "TCK-101", buyerEmail: "buyer@mtms.com", buyerName: "Demo Buyer", buyerPhone: "01700000002", movie: "Interstellar", hall: "Hall-02", showDate: todayString(), showTime: "07:00 PM", quantity: 2, category: "Regular", seats: ["A1", "A2"], totalPrice: 600, paymentMethod: "bKash", status: "Confirmed", refundStatus: "", checkedIn: false, checkInTime: "-", bookingDate: todayString() },
    { bookingId: "TCK-102", buyerEmail: "karim@example.com", buyerName: "Karim Chowdhury", buyerPhone: "01800000001", movie: "Interstellar", hall: "Hall-02", showDate: todayString(), showTime: "07:00 PM", quantity: 1, category: "Premium", seats: ["B1"], totalPrice: 450, paymentMethod: "Nagad", status: "Confirmed", refundStatus: "", checkedIn: true, checkInTime: "06:40 PM", bookingDate: todayString() },
    { bookingId: "TCK-103", buyerEmail: "nusrat@example.com", buyerName: "Nusrat Jahan", buyerPhone: "01900000001", movie: "Avengers", hall: "Hall-01", showDate: todayString(), showTime: "04:00 PM", quantity: 2, category: "Regular", seats: ["C2", "C3"], totalPrice: 600, paymentMethod: "Card", status: "Confirmed", refundStatus: "", checkedIn: false, checkInTime: "-", bookingDate: todayString() }
];

var defaultSupport = [
    { issueId: "SUP-1001", customerName: "Rahim Uddin", bookingId: "TCK-101", category: "Seat Duplicate / Mix-up", priority: "High", details: "Another customer has duplicate ticket for A1.", status: "Open" },
    { issueId: "SUP-1002", customerName: "Farhan Ali", bookingId: "TCK-088", category: "Payment / Refund Request", priority: "Medium", details: "Double charged on bKash during payment.", status: "Resolved" }
];

function loadData(key, fallback) {
    var saved = localStorage.getItem("mtms_" + key);
    if (saved === null) {
        localStorage.setItem("mtms_" + key, JSON.stringify(fallback));
        return JSON.parse(JSON.stringify(fallback));
    }
    return JSON.parse(saved);
}

function saveData(key, value) {
    localStorage.setItem("mtms_" + key, JSON.stringify(value));
}
