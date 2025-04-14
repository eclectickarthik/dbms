const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()

// Load environment variables from .env file
require('dotenv').config();

// Replace hardcoded MongoDB URL with environment variable
mongoose.connect("mongodb+srv://kg:admin@cluster0.al7mqsv.mongodb.net/database");

app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Adding a global CSS file to all pages
const globalStyles = `<link rel="stylesheet" href="/styles.css">`;

// Define Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const flightSchema = new mongoose.Schema({
    flightno: String, // Updated field name to match "flightno"
    departure: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date,
});

const passengerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

const reservationSchema = new mongoose.Schema({
    passengerId: mongoose.Schema.Types.ObjectId,
    flightId: mongoose.Schema.Types.ObjectId,
    seatNumber: String,
});

const airlineSchema = new mongoose.Schema({
    name: String,
    country: String,
});

const airportSchema = new mongoose.Schema({
    name: String,
    location: String,
    code: String,
});

const ticketSchema = new mongoose.Schema({
    reservationId: mongoose.Schema.Types.ObjectId,
    price: Number,
    issuedDate: Date,
});

const employeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    salary: Number,
});

// Define Models
const User = mongoose.model("users", userSchema);
const Flight = mongoose.model("flights", flightSchema);
const Passenger = mongoose.model("passengers", passengerSchema);
const Reservation = mongoose.model("reservations", reservationSchema);
const Airline = mongoose.model("airlines", airlineSchema);
const Airport = mongoose.model("airports", airportSchema);
const Ticket = mongoose.model("tickets", ticketSchema);
const Employee = mongoose.model("employees", employeeSchema);

const flightmodel = mongoose.model("flights", flightSchema);
const flight1 = new flightmodel({
    flightno: "AI101",
    departure: "Chennai",
    destination: "Delhi",
    departureTime: new Date("2025-04-15T10:00:00Z"),
    arrivalTime: new Date("2025-04-15T12:00:00Z"),
});
const flight2 = new flightmodel({
    flightno: "CP200",
    departure: "Mumbai",
    destination: "New York",
    departureTime: new Date("2025-04-16T08:00:00Z"),
    arrivalTime: new Date("2025-04-16T18:00:00Z"),
});
const flight3 = new flightmodel({
    flightno: String,
    departure: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date,
});

// Serve a basic website, 
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FlightEase</title>
            ${globalStyles}
            <style>
                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                h1 {
                    color: #333;
                }
                .button-container {
                    display: flex;
                    gap: 20px;
                }
                .button {
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color:rgb(32, 32, 32);
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                }
                .button:hover {
                    background-color:rgb(88, 88, 88);
                }
            </style>
        </head>
        <body>
            <h1>Welcome to FlightEase: Airline Management System</h1>
            <p>You are:</p>
            <div class="button-container">
                <a href="/passenger" class="button">Passenger</a>
                <a href="/admin" class="button">Admin</a>
            </div>
        </body>
        </html>
    `);
});


// Placeholder routes for Passenger and Admin
app.get("/passenger", (req, res) => {
    res.send(`
        <html>
        <head>
            ${globalStyles}
            <style>
                .back-button {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 10px;
                    font-size: 14px;
                    color: #fff;
                    background-color:rgb(32, 32, 32);
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                }
                .back-button:hover {
                    background-color:rgb(88, 88, 88);;
                }
                body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                h1 {
                    color: #333;
                }
                .button {
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color:rgb(32, 32, 32);
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                    margin-top: 20px;
                }
                .button:hover {
                    background-color:rgb(88, 88, 88);
                }
            </style>
        </head>
        <body>
            <a href="/" class="back-button">Back</a>
            <h1>Passenger Portal</h1>
            <a href="/passenger/flights" class="button">View Available Flights</a>
        </body>
        </html>
    `);
});

// Updating the passenger flights page to keep the "Select Flight" button and show a form for passenger details after clicking it
app.get("/passenger/flights", async (req, res) => {
    try {
        const flights = await Flight.find(); // Fetch all flights from the database
        let html = `
            <a href="/passenger" style="position: absolute; top: 10px; left: 10px; padding: 10px; font-size: 14px; color: #fff; background-color: rgb(32, 32, 32); border: none; border-radius: 5px; cursor: pointer; text-decoration: none;" onmouseover="this.style.backgroundColor='rgb(88, 88, 88)'" onmouseout="this.style.backgroundColor='rgb(32, 32, 32)'">Back</a>
            <h1 style="text-align: center;">Available Flights</h1>
            <div style="display: flex; justify-content: center;">
            <table border='1' style="border-collapse: collapse; text-align: center; width: 100%;">
                <tr>
                    <th style="padding: 10px;">Flight Number</th>
                    <th style="padding: 10px;">Departure</th>
                    <th style="padding: 10px;">Destination</th>
                    <th style="padding: 10px;">Departure Time</th>
                    <th style="padding: 10px;">Arrival Time</th>
                    <th style="padding: 10px;">Action</th>
                </tr>
        `;

        flights.forEach(flight => {
            html += `<tr>
                        <td style="padding: 10px;">${flight.flightno}</td>
                        <td style="padding: 10px;">${flight.departure}</td>
                        <td style="padding: 10px;">${flight.destination}</td>
                        <td style="padding: 10px;">${new Date(flight.departureTime).toLocaleString()}</td>
                        <td style="padding: 10px;">${new Date(flight.arrivalTime).toLocaleString()}</td>
                        <td style="padding: 10px;">
                            <button class="button" onclick="showPassengerForm('${flight._id}')">Select Flight</button>
                            <form id="passenger-form-${flight._id}" action="/passenger/confirm-ticket" method="POST" style="display:none; margin-top: 10px;">
                                <input type="hidden" name="flightId" value="${flight._id}" />
                                <label>Name: <input type="text" name="name" required /></label><br />
                                <label>Email: <input type="email" name="email" required /></label><br />
                                <label>Phone: <input type="text" name="phone" required /></label><br />
                                <button type="submit" class="button">Confirm Ticket</button>
                            </form>
                        </td>
                     </tr>`;
        });

        html += "</table></div>";

        const script = `
            <script>
                function showPassengerForm(flightId) {
                    const form = document.getElementById('passenger-form-' + flightId);
                    form.style.display = form.style.display === 'none' ? 'block' : 'none';
                }
            </script>
        `;

        res.send(html + script);
    } catch (error) {
        res.status(500).send("Error fetching flights: " + error.message);
    }
});

// Route to handle ticket confirmation and save passenger details
app.post("/passenger/confirm-ticket", async (req, res) => {
    try {
        const { flightId, name, email, phone } = req.body;
        const newPassenger = new Passenger({ name, email, phone });
        await newPassenger.save();
        res.send(`
            <html>
            <head>
                <style>
                    .back-button {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        padding: 10px;
                        font-size: 14px;
                        color: #fff;
                        background-color: rgb(32, 32, 32);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .back-button:hover {
                        background-color: rgb(88, 88, 88);
                    }
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                    h1 {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <a href="/passenger/flights" class="back-button">Back</a>
                <h1>Ticket confirmed successfully!</h1>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Error confirming ticket: " + error.message);
    }
});

// Adding routes to handle add, delete, and modify operations for flights

// Route to add a new flight
app.post("/admin/add-flight", async (req, res) => {
    try {
        const { flightno, departure, destination, departureTime, arrivalTime } = req.body;
        const newFlight = new Flight({ flightno, departure, destination, departureTime, arrivalTime });
        await newFlight.save();
        res.send(`
            <html>
            <head>
                ${globalStyles}
                <style>
                    .back-button {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        padding: 10px;
                        font-size: 14px;
                        color: #fff;
                        background-color: rgb(32, 32, 32);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .back-button:hover {
                        background-color: rgb(88, 88, 88);
                    }
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                    h1 {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <a href="/admin" class="back-button">Back</a>
                <h1>Flight added successfully.</h1>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Error adding flight: " + error.message);
    }
});

// Route to delete a flight
app.post("/admin/delete-flight", async (req, res) => {
    try {
        const { flightId } = req.body;
        await Flight.findByIdAndDelete(flightId);
        res.send(`
            <html>
            <head>
                ${globalStyles}
                <style>
                    .back-button {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        padding: 10px;
                        font-size: 14px;
                        color: #fff;
                        background-color: rgb(32, 32, 32);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .back-button:hover {
                        background-color: rgb(88, 88, 88);
                    }
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                    h1 {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <a href="/admin" class="back-button">Back</a>
                <h1>Flight deleted successfully.</h1>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Error deleting flight: " + error.message);
    }
});

// Route to modify a flight
app.post("/admin/modify-flight", async (req, res) => {
    try {
        const { flightId, flightno, departure, destination, departureTime, arrivalTime } = req.body;
        await Flight.findByIdAndUpdate(flightId, { flightno, departure, destination, departureTime, arrivalTime });
        res.send(`
            <html>
            <head>
                ${globalStyles}
                <style>
                    .back-button {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        padding: 10px;
                        font-size: 14px;
                        color: #fff;
                        background-color: rgb(32, 32, 32);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none.
                    }
                    .back-button:hover {
                        background-color: rgb(88, 88, 88);
                    }
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                    h1 {
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <a href="/admin" class="back-button">Back</a>
                <h1>Flight modified successfully.</h1>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Error modifying flight: " + error.message);
    }
});

// Updated the /admin page to include "Add Flights" at the top of the left partition and "Manage Flights" below it
app.get("/admin", async (_, res) => {
    try {
        const flights = await Flight.find(); // Fetch all flights from the database
        const passengers = await Passenger.find(); // Fetch all passengers from the database

        let flightListHtml = "<h2>Manage Flights</h2>";
        flights.forEach(flight => {
            flightListHtml += `<table border='1' style='border-collapse: collapse; margin-bottom: 20px; width: 100%;'>
                <tr><th>Flight Number</th><td>${flight.flightno}</td></tr>
                <tr><th>Departure</th><td>${flight.departure}</td></tr>
                <tr><th>Destination</th><td>${flight.destination}</td></tr>
                <tr><th>Departure Time</th><td>${new Date(flight.departureTime).toLocaleString()}</td></tr>
                <tr><th>Arrival Time</th><td>${new Date(flight.arrivalTime).toLocaleString()}</td></tr>
                <tr>
                    <td colspan='2' style='text-align: center;'>
                        <button class='button' onclick="showModifyForm('${flight._id}')">Modify</button>
                        <form id='modify-form-${flight._id}' action='/admin/modify-flight' method='POST' style='display:none; margin-top: 10px;'>
                            <input type='hidden' name='flightId' value='${flight._id}' />
                            <label>Flight Number: <input type='text' name='flightno' value='${flight.flightno}' required /></label><br />
                            <label>Departure: <input type='text' name='departure' value='${flight.departure}' required /></label><br />
                            <label>Destination: <input type='text' name='destination' value='${flight.destination}' required /></label><br />
                            <label>Departure Time: <input type='datetime-local' name='departureTime' value='${new Date(flight.departureTime).toISOString().slice(0, 16)}' required /></label><br />
                            <label>Arrival Time: <input type='datetime-local' name='arrivalTime' value='${new Date(flight.arrivalTime).toISOString().slice(0, 16)}' required /></label><br />
                            <button type='submit' class='button'>Confirm</button>
                        </form>
                        <form action='/admin/delete-flight' method='POST' style='display:inline;'>
                            <input type='hidden' name='flightId' value='${flight._id}' />
                            <button type='submit' class='button'>Delete</button>
                        </form>
                    </td>
                </tr>
            </table>`;
        });

        let passengerListHtml = "<h2>Manage Passengers</h2>";
        passengers.forEach(passenger => {
            passengerListHtml += `<table border='1' style='border-collapse: collapse; margin-bottom: 20px; width: 100%;'>
                <tr><th>Name</th><td>${passenger.name}</td></tr>
                <tr><th>Email</th><td>${passenger.email}</td></tr>
                <tr><th>Phone</th><td>${passenger.phone}</td></tr>
                <tr>
                    <td colspan='2' style='text-align: center;'>
                        <button class='button' onclick="showEditPassengerForm('${passenger._id}')">Edit</button>
                        <form id='edit-passenger-form-${passenger._id}' action='/admin/edit-passenger' method='POST' style='display:none; margin-top: 10px;'>
                            <input type='hidden' name='passengerId' value='${passenger._id}' />
                            <label>Name: <input type='text' name='name' value='${passenger.name}' required /></label><br />
                            <label>Email: <input type='email' name='email' value='${passenger.email}' required /></label><br />
                            <label>Phone: <input type='text' name='phone' value='${passenger.phone}' required /></label><br />
                            <button type='submit' class='button'>Confirm</button>
                        </form>
                    </td>
                </tr>
            </table>`;
        });

        const script = `
            <script>
                function showModifyForm(flightId) {
                    const form = document.getElementById('modify-form-' + flightId);
                    form.style.display = form.style.display === 'none' ? 'block' : 'none';
                }
                function showEditPassengerForm(passengerId) {
                    const form = document.getElementById('edit-passenger-form-' + passengerId);
                    form.style.display = form.style.display === 'none' ? 'block' : 'none';
                }
            </script>
        `;

        res.send(`
            <html>
            <head>
                ${globalStyles}
            </head>
            <body>
                <a href="/" class="back-button">Back</a>
                <div style="display: flex; justify-content: space-between;">
                    <div style="width: 48%;">
                        <h2>Add a New Flight</h2>
                        <form action="/admin/add-flight" method="POST">
                            <label>Flight Number: <input type="text" name="flightno" required /></label><br />
                            <label>Departure: <input type="text" name="departure" required /></label><br />
                            <label>Destination: <input type="text" name="destination" required /></label><br />
                            <label>Departure Time: <input type="datetime-local" name="departureTime" required /></label><br />
                            <label>Arrival Time: <input type="datetime-local" name="arrivalTime" required /></label><br />
                            <button type="submit" class="button">Add Flight</button>
                        </form>
                        <h2>Manage Flights</h2>
                        ${flightListHtml}
                    </div>
                    <div style="width: 48%;">
                        <h2>Manage Passengers</h2>
                        ${passengerListHtml}
                    </div>
                </div>
                ${script}
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send("Error loading admin page: " + error.message);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

