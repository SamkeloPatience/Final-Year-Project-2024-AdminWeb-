"use client" 
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar2 from "@components/Navbar2";
import styles from "@styles/notification.module.css";
import Footer from "@components/Footer";

async function fetchHistoryDataFromFirestore() {
  try {
    const colRef = collection(db, "History");
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Error fetching history data from Firestore:", error);
    return [];
  }
}

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchHistoryDataFromFirestore();
        setHistoryData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <main>
      <Navbar2 />
      {error && <p>Error: {error}</p>}
      {historyData.length > 0 ? (
        <section className={`${styles.cd}`}>
          <div>
            {historyData.map((item) => (
              <div key={item.id} className={styles.items}>
                <p className={`${styles.description}`}>
                  Description<br/>{item.Description || 'N/A'} <br/>
                </p>
                <p className={`${styles.location}`}>Location<br/>{item.Location || 'N/A'}</p>
                <p className={`${styles.reportedBy}`}>ReportedBy<br/>{item.ReportedBy || 'N/A'}</p>
                <p className={`${styles.image}`}>Image<br/>{item.Image || 'N/A'}</p>
                <p className={`${styles.solved}`}>Status<br/>Solved</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p>No solved issues found</p>
      )}
      <Footer />
    </main>
  );
}
