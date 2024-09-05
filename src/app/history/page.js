"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar2 from "@components/Navbar2";
import Footer from "@components/Footer";
import styles from "@styles/History.module.css";

// Define assignTask function separately if needed
async function assignTask(collectionName, itemId, assignee) {
  try {
    const docRef = doc(db, collectionName, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      await updateDoc(docRef, { assignedTo: assignee });
      await setDoc(doc(db, "History", itemId), { ...data, solved: true });
      await deleteDoc(docRef);
      return true;
    } else {
      console.error("Document does not exist");
      return false;
    }
  } catch (error) {
    console.error("Error assigning task and moving document:", error);
    return false;
  }
}

export default function History() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItemData() {
      if (itemId) {
        try {
          const docRef = doc(db, "History", itemId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setItemData(docSnap.data());
          } else {
            setError("Item not found");
          }
        } catch (err) {
          setError("Error fetching data");
          console.error("Error fetching item data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No item ID provided");
      }
    }

    fetchItemData();
  }, [itemId]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!itemData) {
    return <p>No data found for the provided item ID</p>;
  }

  return (
    <main>
      <Navbar2 />
      <div className={styles.container}>
        <h1>Item Details</h1>
        <p><strong>Description:</strong> {itemData.Description || "N/A"}</p>
        <p><strong>Location:</strong> {itemData.Location || "N/A"}</p>
        <p><strong>Reported By:</strong> {itemData.ReportedBy || "N/A"}</p>
        <p><strong>Image:</strong> {itemData.Image || "N/A"}</p>
        <p><strong>Assigned To:</strong> {itemData.assignedTo || "N/A"}</p>
        <p><strong>Solved:</strong> {itemData.solved ? "Yes" : "No"}</p>
      </div>
      <Footer />
    </main>
  );
}
