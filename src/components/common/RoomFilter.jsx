import React, { useState, useEffect } from "react";

const RoomFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const types = ["", ...new Set(data.map((room) => room.roomType))];
      setRoomTypes(types);
    }
  }, [data]);

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);

    const filteredRooms = data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedType.toLowerCase())
    );
    setFilteredData(filteredRooms);
    console.log('Filtered Rooms:', filteredRooms); // Debug output
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
    console.log('Filter cleared'); // Debug output
  };

  return (
    <div className="mb-3">
      <select
        className="form-select"
        aria-label="room type filter"
        value={filter}
        onChange={handleSelectChange}
      >
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
