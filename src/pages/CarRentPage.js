import React, { useEffect, useState } from "react";
import "./styles/CarRentPage.css";
import options from "../data.json";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "../components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CarRentPage = () => {
  const navigate = useNavigate();
  const user = useAuth();

  if (!user.userId) {
    navigate("/");
  } else {
    console.log(user.userId);
  }

  const location = useLocation();
  const [city, setCity] = useState(location.state.city);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cars")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCars(data);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  const filterCarsByType = (carType) => {
    if (carType === "All") {
      return cars.filter((car) => car.carCity === city && car.available === true);
    } else {
      return cars.filter((car) => car.carType === carType && car.city === city && car.available === true);
    }
  };

  const filterOptions = (country) => {
    return options[country];
  };

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleRent = (carId) => {
    fetch("http://localhost:8080/api/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carId,
      }), 
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error renting car:", error);
      })
      .finally(() => {
        alert("Car rented successfully!");
        window.location.reload();
      });
    }

  const renderCarCards = (filteredCars) => {
    if (filteredCars.length === 0) {
      return <p>No cars available</p>;
    }

    return filteredCars.map((car) => (
      <div key={car._id} className="car-card">
        <h3>{car.carName}</h3>
        <p>Type: {car.carType}</p>
        <p>Price: {car.carPrice}</p>
        <p>Seats: {car.carSeats}</p>
        <p>Fuel Type: {car.carFuelType}</p>
        <p>Delivery Type: {car.carDeliveryType}</p>
        <img src={car.carImage} alt={car.carName} />
        <p>City: {car.carCity}</p>
        <p>Country: {car.carCountry}</p>
        <p>Model: {car.carModel}</p>
        <p>Number: {car.carNumber}</p>
        <p>Available from: {selectedDate}</p>
        <Button
        variant="ghost">
          <button
          onClick={() => handleRent(car._id)}
          >
          Rent
          </button>
        </Button>
      </div>
    ));
  };

  return (
    <div>
      <Layout />
      <div className="container mx-auto">
        <div className="flex">
          <div className="w-1/4 p-4">
            <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
            <div className="mb-4">
              <label className="block mb-1">Car Type:</label>
              <select
                className="border py-1 px-2 rounded w-full"
                value={filterType}
                onChange={handleTypeChange}
              >
                <option value="All">All</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">City:</label>
              <select
                className="border py-1 px-2 rounded w-full"
                value={city}
                onChange={handleCityChange}
              >
                <option value="" disabled hidden>
                  Select city
                </option>
                {filterOptions(location.state.country).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border py-1 px-2 rounded w-full"
              />
            </div>
          </div>
          <div className="w-3/4 p-4">
            <h1 className="text-2xl font-semibold mb-4">
              Available Cars in {city}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderCarCards(filterCarsByType(filterType))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarRentPage;