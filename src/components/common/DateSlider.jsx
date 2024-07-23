import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";

const DateSlider = ({ onDateChange, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
    key: "selection"
  });

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection);
    onDateChange(ranges.selection.startDate, ranges.selection.endDate);
    onFilterChange(ranges.selection.startDate, ranges.selection.endDate);
  };

  const handleClearFilter = () => {
    setDateRange({
      startDate: undefined,
      endDate: undefined,
      key: "selection"
    });
    onDateChange(null, null);
    onFilterChange(null, null);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <h1 style={{ 
        backgroundColor: "blue", 
        color: "white", 
        padding: "10px", 
        marginBottom: "20px", 
        fontSize: "1.5rem",
        borderRadius: "5px"
      }}>
        Filter bookings by date
      </h1>
      <DateRangePicker 
        ranges={[dateRange]} 
        onChange={handleSelect} 
        style={{ marginBottom: "1.5rem" }} 
      />
      <button 
        className="btn btn-secondary" 
        onClick={handleClearFilter} 
        style={{ marginTop: "10px" }}
      >
        Clear Filter
      </button>
    </div>
  );
};

export default DateSlider;
