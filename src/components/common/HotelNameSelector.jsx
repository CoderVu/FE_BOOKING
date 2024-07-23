import React, { useState, useEffect } from "react";
import { getAllHotels } from "../utils/ApiFunctions";
import "../styles/index.css";

const HotelNameSelector = ({ handleHotelInputChange, selectedHotelName, clearHotelFilter }) => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelList = await getAllHotels();
        setHotels(hotelList);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="mb-3">
      <select
        id="hotelNameFilter"
        className="form-select"
        value={selectedHotelName}
        onChange={(e) => handleHotelInputChange(e.target.value)}
      >
        <option value="">All Hotels</option>
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.name}>
            {hotel.name}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel mt-2" type="button" onClick={clearHotelFilter}>
        Clear Filter
      </button>
    </div>
  );
};

export default HotelNameSelector;
