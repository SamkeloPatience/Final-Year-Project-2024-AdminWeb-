"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import styles from "@styles/History.module.css";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDataFromFirestore() {
      try {
        const collectionName = "History"; 
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No data found</p>;
  }

  return (
    <main>
      <Navbar/>
      <div className={`${styles.container}`}>
        {data.map((item) => (
          <div key={item.id} className={`row ${styles.secondContainer}`}>
            <p className={`${styles.description}`}>
                      Description
                      <br />
                      {item.Description || "N/A"} <br />
                    </p>
                    <p className={`${styles.location}`}>
                      Location
                      <br />
                      {item.Location || "N/A"}
                    </p>
                    <p className={`${styles.reportedBy}`}>
                      ReportedBy
                      <br />
                      {item.ReportedBy || "N/A"}
                    </p>
                    <p className={`${styles.image}`}>
                      Image
                      <br />
                      {item.Image || "N/A"}
                    </p>
                    <p className={`${styles.assignedTo}`}>
                        AssignedTo
                        <br/>
                        {item.assignedTo}
                    </p>
                    <p className= {`${styles.solved}`}> Status:
                      <br/>

                      {item.solved ? "In Progres" : "No Progress"}
                      </p>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
}
