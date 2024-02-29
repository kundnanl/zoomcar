import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Home = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("Please select a country first.");
  const [countries, setCountries] = useState([]);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
  };

  const handleSubmit = () => {
    if (!user.userId) {
      alert("Please sign in to continue.");
    }
    navigate(`/carRentPage`, {
      state: { country: selectedCountry, city: selectedCity },
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  return (
    <div>
      <Layout />
      <div className="mx-auto flex items-center justify-center flex-col">
        <div className="my-5 text-center space-y-4">
          <h1 className="text-6xl font-bold">Welcome to Car Rent</h1>
          <h3 className="text-3xl font-normal">
            Car Rent is a platform where you can rent cars from different
            countries and cities.
          </h3>
        </div>
        <div className="mt-8 mb-4">
          <h1 className="text-2xl font-bold">Select your country/city</h1>
        </div>
        <div className="flex space-x-4">
          <select
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="Country"
            onChange={handleCountryChange}
            required
          >
            <option value="" disabled selected hidden>
              Select country
            </option>
            {countries.map((country) => (
              <option key={country._id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="City"
            onChange={handleCityChange}
            required
            disabled={!selectedCountry}
          >
            <option value="" disabled selected hidden>
              {selectedCountry ? "Select city" : "Please select a country first"}
            </option>
            {selectedCountry &&
              countries.find((country) => country.name === selectedCountry)?.cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedCity}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
