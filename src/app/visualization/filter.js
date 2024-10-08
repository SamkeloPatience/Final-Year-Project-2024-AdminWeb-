import { useState } from 'react';

function Filters({ onFilterChange }) {
  const [problemType, setProblemType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be earlier than start date.");
      return;
    }
    onFilterChange({ problemType, startDate, endDate });
  };

  const handleClearFilters = () => {
    setProblemType("All");
    setStartDate("");
    setEndDate("");
    onFilterChange({ problemType: "All", startDate: "", endDate: "" }); // Reset the filters
  };

  return (
    <div>
      <label htmlFor="problemType">Problem Type: </label>
      <select 
        id="problemType" 
        value={problemType} 
        onChange={(e) => setProblemType(e.target.value)}
      >
        <option value="All">All Problems</option>
        <option value="Type1">Type 1</option>
        <option value="Type2">Type 2</option>
        {/* Add more types as needed */}
      </select>

      <label htmlFor="startDate">Start Date: </label>
      <input 
        type="date" 
        id="startDate" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
      />

      <label htmlFor="endDate">End Date: </label>
      <input 
        type="date" 
        id="endDate" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
      />

      <button onClick={handleFilterChange}>Apply Filters</button>
      <button onClick={handleClearFilters} style={{ marginLeft: '10px' }}>Clear Filters</button>
    </div>
  );
}

export default Filters;
