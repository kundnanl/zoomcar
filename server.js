const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Import Multer
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

const corsOptions = {
  origin: 'http://localhost:3000'
};  

app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// MongoDB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB Schemas and Models
const countrySchema = new mongoose.Schema({
  name: String,
  cities: [String]
});

const carSchema = new mongoose.Schema({
  UserId: String,
  carName: String,
  carNumber: String,
  carModel: String,
  carType: String,
  carSeats: Number,
  carFuelType: String,
  carDeliveryType: String,
  carPrice: Number,
  carCountry: String,
  carCity: String,
  carImage: String,
  startDate: String,
  endDate: String,
  available: Boolean
});

const Country = mongoose.model('Country', countrySchema);
const Car = mongoose.model('Car', carSchema);

// API Routes
app.get('/api/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    const { carId } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(carId, { available: false }, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    console.error('Error renting car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/car/add', upload.single('carImage'), async (req, res) => {
  try {
    const { UserId, carName, carNumber, carModel, carType, carSeats, carFuelType, carDeliveryType, carPrice, carCountry, carCity, startDate, endDate } = req.body;
    const carImage = `http://localhost:8080/uploads/${req.file.filename}`;

    const newCar = new Car({
      UserId,
      carName,
      carNumber,
      carModel,
      carType,
      carSeats,
      carFuelType,
      carDeliveryType,
      carPrice,
      carCountry,
      carCity,
      carImage,
      startDate: startDate,
      endDate: endDate,
      available: true
    });

    await newCar.save();

    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
