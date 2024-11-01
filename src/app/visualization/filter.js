"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig"; // Adjust your Firebase config import

function Filters({ onFilterChange, userDepartment }) {
  const [problemType, setProblemType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [problemTypes, setProblemTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve userDepartment from localStorage if not provided as a prop
    const department = userDepartment || localStorage.getItem("userDepartment");
    if (!department) {
      console.error("User department not found.");
      return;
    }

    const fetchProblemTypes = async () => {
      try {
        const collectionName = department === "PPO" ? "PPO_History" : "PSD_History";
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map(doc => doc.data());

        const uniqueTypes = new Set();
        documents.forEach(item => {
          const desc = Array.isArray(item.Description) ? item.Description[0] : item.Description;
          uniqueTypes.add(desc);
        });

        setProblemTypes(["All", ...Array.from(uniqueTypes)]);
      } catch (error) {
        console.error("Error fetching problem types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemTypes();
  }, [userDepartment]);

  const handleFilterChange = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    onFilterChange({ problemType, startDate, endDate });
  };

  const handleClearFilters = () => {
    setProblemType("All");
    setStartDate("");
    setEndDate("");
    onFilterChange({ problemType: "All", startDate: "", endDate: "" });
  };

  return (
    <div>
      {loading ? (
        <p>Loading problem types...</p>
      ) : (
        <>
          <label htmlFor="problemType">Problem Type: </label>
          <select
            id="problemType"
            value={problemType}
            onChange={(e) => setProblemType(e.target.value)}
          >
            {problemTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
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
          <button onClick={handleClearFilters} style={{ marginLeft: "10px" }}>
            Clear Filters
          </button>
        </>
      )}
    </div>
  );
}

export default Filters;
