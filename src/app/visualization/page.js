"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from "@styles/visualization.module.css"
// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Visualization() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDataFromFirestore() {
      try {
        const collectionName = "PPO_History"; // You can dynamically switch this based on department
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(documents);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        setError("Error fetching data from Firestore");
      } finally {
        setLoading(false);
      }
    }

    fetchDataFromFirestore();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: data.map(item => item.Description), 
    datasets: [
      {
        label: "Reports by Status",
        data: data.map(item => item.status === "Resolved" ? 1 : 0), 
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reports Status Visualization',
      },
    },
  };

  if (loading) {
    return <Navbar />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (data.length === 0) {
    return <h1>No reports found in history</h1>;
  }

  return (
    <main>
      <Navbar />
      <div className={styles.container}>
        <Bar data={chartData} 
        options={options} 
        width={40} 
        height={10} 
        className={`${styles.Bar}`}
        />
      </div>
      <Footer />
    </main>
  );
}
