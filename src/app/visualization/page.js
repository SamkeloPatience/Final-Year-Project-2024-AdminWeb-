"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig"; // Adjust your import path
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Filters from "../visualization/filter";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";
import styles from "@styles/visualization.module.css";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function Visualization({ loggedInUserDepartment }) {
  const [data, setData] = useState({ labels: [], resolvedCounts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    problemType: "All",
    startDate: "",
    endDate: "",
  });
  const [selectedVisualization, setSelectedVisualization] = useState("Report Trends");

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const collectionName = loggedInUserDepartment === "PPO" ? "PPO_History" : "PSD_History"; // Choose correct collection
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter the data based on filters
        const filteredData = documents.filter((item) => {
          let description = "";
          if (Array.isArray(item.Description) && item.Description.length > 0) {
            description = item.Description[0]?.toLowerCase();
          } else if (typeof item.Description === "string") {
            description = item.Description.toLowerCase();
          }

          const problemType = filters.problemType.toLowerCase();
          const isTypeMatch = filters.problemType === "All" || description.includes(problemType);

          const updatedAt = item.updatedAt ? item.updatedAt.toDate() : null;
          const isDateMatch =
            (!filters.startDate || (updatedAt && updatedAt >= new Date(filters.startDate))) &&
            (!filters.endDate || (updatedAt && updatedAt <= new Date(filters.endDate)));

          return isTypeMatch && isDateMatch;
        });

        // Group the data by description and count resolved issues
        const groupedData = filteredData.reduce((acc, item) => {
          const desc = Array.isArray(item.Description) ? item.Description[0] : "N/A";
          if (!acc[desc]) {
            acc[desc] = { resolved: 0 };
          }
          if (item.status === "Resolved") {
            acc[desc].resolved += 1;
          }
          return acc;
        }, {});

        let labels = Object.keys(groupedData);
        let resolvedCounts = labels.map((label) => groupedData[label].resolved);

        // Sort the data by resolvedCounts in descending order
        const sortedData = labels
          .map((label, index) => ({
            label,
            resolved: resolvedCounts[index],
          }))
          .sort((a, b) => b.resolved - a.resolved);

        // Extract sorted labels and resolvedCounts
        labels = sortedData.map((item) => item.label);
        resolvedCounts = sortedData.map((item) => item.resolved);

        setData({ labels, resolvedCounts });
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        setError({ message: error.message || "Error fetching data from Firestore" });
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromFirestore();
  }, [filters, loggedInUserDepartment]); // Re-fetch when filters or department changes

  // Function to generate random colors for the Pie chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      colors.push(randomColor);
    }
    return colors;
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Resolved Reports",
        data: data.resolvedCounts,
        backgroundColor: generateColors(data.labels.length), // Apply dynamic colors to each data point
        borderColor: generateColors(data.labels.length).map((color) => color.replace("0.6", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Reports Status Visualization",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.dataset.label || "";
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
          text: "Description",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Reports",
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

  if (data.labels.length === 0) {
    return (
      <main>
        <Navbar />
        <h1>No reports found in history</h1>
      </main>
    );
  }

  return (
    <div>
      <Navbar />
      <div className={`${styles.container}`}>
        <div className={`row ${styles.row}`}>
          <div className={`col-md-2 ${styles.lk}`}>
            <div className={`${styles.sidebar}`}>
              <ul>
                <li
                  className={selectedVisualization === "Report Trends" ? styles.active : ""}
                  onClick={() => setSelectedVisualization("Report Trends")}
                >
                  Report Trends
                </li>
                <li
                  className={selectedVisualization === "Most Reported Problems" ? styles.active : ""}
                  onClick={() => setSelectedVisualization("Most Reported Problems")}
                >
                  Most Reported Problems
                </li>
                <li
                  className={selectedVisualization === "Date Range Analysis" ? styles.active : ""}
                  onClick={() => setSelectedVisualization("Date Range Analysis")}
                >
                  Date Range Analysis
                </li>
              </ul>
            </div>
          </div>
          <div className={`col-sm-12 col-md-8 ${styles.mainContent}`}>
            <Filters onFilterChange={setFilters} loggedInUserDepartment={loggedInUserDepartment} />
            <div className={styles.chartContainer}>
              {selectedVisualization === "Report Trends" && <Bar data={chartData} options={options} />}
              {selectedVisualization === "Most Reported Problems" && <Pie data={chartData} options={options} />}
              {selectedVisualization === "Date Range Analysis" && <Line data={chartData} options={options} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
