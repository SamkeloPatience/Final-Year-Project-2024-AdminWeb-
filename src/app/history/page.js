// History.js
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar2 from "@components/Navbar2";
import Footer from "@components/Footer";
import styles from "@styles/notification.module.css";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const colRef = collection(db, "History");
        const querySnapshot = await getDocs(colRef);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setHistoryData(items);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setError("Error fetching history data");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading history...</p>;
  }
}
  return; 
