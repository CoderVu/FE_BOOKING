import React, { useState } from "react";

const RoomFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);

    const filteredRooms = data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedType.toLowerCase())
    );
    setFilteredData(filteredRooms);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const roomTypes = ["", ...new Set(data.map((room) => room.roomType))];

  return (
    <div className="mb-3">
      <select
        className="form-select"
        aria-label="room type filter"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">All Room Types</option>
        {roomTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button className="btn btn-hotel mt-2" type="button" onClick={clearFilter}>
        Clear Filter
      </button>
    </div>
  );
};

export default RoomFilter;
