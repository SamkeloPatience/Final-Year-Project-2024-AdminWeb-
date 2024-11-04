"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Filters from "../visualization/filter";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import styles from "@styles/visualization.module.css";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";


Chart.register( CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip,Legend, ArcElement, ChartDataLabels );

export default function Visualization() {
  const [userDepartment, setUserDepartment] = useState(null);
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
    const department = localStorage.getItem("userDepartment");
    if (department) {
      setUserDepartment(department);
    } else {
      console.error("User department not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (!userDepartment) return; 
    
    const fetchDataFromFirestore = async () => {
      try {
        const collectionName = userDepartment === "PPO" ? "PPO_History" : "PSD_History";
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched documents:", documents);

        const filteredData = documents.filter((item) => {
          const description = Array.isArray(item.Description) && item.Description.length > 0 
            ? item.Description[0]?.toLowerCase().trim() 
            : typeof item.Description === "string" ? item.Description.toLowerCase().trim() : "";

          const problemType = filters.problemType.toLowerCase().trim();
          const isTypeMatch = filters.problemType === "All" || description.includes(problemType);

          const updatedAt = item.updatedAt ? item.updatedAt.toDate() : null;
          const isDateMatch = 
            (!filters.startDate || (updatedAt && updatedAt >= new Date(filters.startDate))) &&
            (!filters.endDate || (updatedAt && updatedAt <= new Date(filters.endDate)));

          return isTypeMatch && isDateMatch;
        });

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

        const sortedData = labels
          .map((label, index) => ({
            label,
            resolved: resolvedCounts[index],
          }))
          .sort((a, b) => b.resolved - a.resolved);

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
  }, [filters, userDepartment]);

  const generateColors = (count) => {
    return Array.from({ length: count }, () =>
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Resolved Reports",
        data: data.resolvedCounts,
        backgroundColor: generateColors(data.labels.length),
        borderColor: generateColors(data.labels.length).map((color) => color.replace("0.6", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Reports Status Visualization" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label || ""}: ${tooltipItem.raw}`,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff', 
        anchor: 'end',
        align: 'start',
      },
    },
    scales: {
      x: { title: { display: true, text: "Description" } },
      y: { title: { display: true, text: "Number of Reports" }, beginAtZero: true },
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
        <p>Error: {error.message}</p>
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
      <div className={styles.container}>
        <div className={`row ${styles.row}`}>
          <div className={`col-md-2 ${styles.lk}`}>
            <div className={styles.sidebar}>
              <ul>
                {["Report Trends", "Most Reported Problems", "Date Range Analysis"].map((vizType) => (
                  <li
                    key={vizType}
                    className={selectedVisualization === vizType ? styles.active : ""}
                    onClick={() => setSelectedVisualization(vizType)}
                  >
                    {vizType}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`col-sm-12 col-md-8 ${styles.mainContent}`}>
            <Filters onFilterChange={setFilters} userDepartment={userDepartment} />
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
