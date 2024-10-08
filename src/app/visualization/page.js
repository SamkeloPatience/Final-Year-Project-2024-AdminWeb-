"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig"; // Adjust your import path
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Filters from "../visualization/filter";
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import styles from "@styles/visualization.module.css";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function Visualization() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ problemType: "All", startDate: "", endDate: "" });
  const [chartType, setChartType] = useState("Bar"); // Default chart type

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const collectionName = "PSD_History"; 
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter based on selected problem type and date range
        const filteredData = documents.filter(item => {
          const isTypeMatch = filters.problemType === "All" || item.type === filters.problemType; 
          const isDateMatch = (!filters.startDate || new Date(item.date) >= new Date(filters.startDate)) && 
                              (!filters.endDate || new Date(item.date) <= new Date(filters.endDate)); 
          return isTypeMatch && isDateMatch;
        });

        // Group by Description and count statuses
        const groupedData = filteredData.reduce((acc, item) => {
          const desc = item.Description ? item.Description[0] : 'N/A'; 
          if (!acc[desc]) {
            acc[desc] = { resolved: 0, unresolved: 0 };
          }
          if (item.status === "Resolved") {
            acc[desc].resolved += 1;
          } else {
            acc[desc].unresolved += 1;
          }
          return acc;
        }, {});

        // Transform grouped data into arrays for the chart
        const labels = Object.keys(groupedData);
        const resolvedCounts = labels.map(label => groupedData[label].resolved);
        const unresolvedCounts = labels.map(label => groupedData[label].unresolved);
        
        setData({ labels, resolvedCounts, unresolvedCounts });
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        setError({ message: "Error fetching data from Firestore" });
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromFirestore();
  }, [filters]); // Run effect again if filters change

  // Prepare data for the chart
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: "Resolved Reports",
        data: data.resolvedCounts || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Unresolved Reports",
        data: data.unresolvedCounts || [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reports Status Visualization',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Description',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Reports',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <p>Error: {error.message || "An unexpected error occurred."}</p>
      </main>
    );
  }

  if (!data.labels || data.labels.length === 0) {
    return (
      <main>
        <Navbar />
        <h1>No reports found in history</h1>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <Filters onFilterChange={setFilters} />
      <div>
        <label htmlFor="chartType">Select Chart Type: </label>
        <select 
          id="chartType" 
          onChange={(e) => setChartType(e.target.value)} 
          value={chartType}
        >
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
          <option value="Pie">Pie Chart</option>
        </select>
      </div>
      <div className={styles.container}>
        {chartType === "Bar" && <Bar data={chartData} options={options} />}
        {chartType === "Line" && <Line data={chartData} options={options} />}
        {chartType === "Pie" && <Pie data={chartData} options={options} />}
      </div>
      <Footer />
    </main>
  );
}
