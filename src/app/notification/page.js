"use client"
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar2 from "@components/Navbar2";
import styles from "@styles/notification.module.css";
import Footer from "@components/Footer";
import { Dropdown } from "react-bootstrap";
import Stack from "./stack";

async function fetchDataFromFirestore(stack) {
  try {
    const collections = ["Reports"];
    const data = {};

    for (const collectionName of collections) {
      const colRef = collection(db, collectionName);
      const querySnapshot = await getDocs(colRef);

      querySnapshot.forEach((doc) => {
        const docData = { id: doc.id, ...doc.data() };
        stack.push(docData);
      });

      data[collectionName] = stack.getStack();
    }

    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return {};
  }
}

async function assignTask(collectionName, itemId, assignee) {
  try {
    const docRef = doc(db, collectionName, itemId);

    const docSnap = await docRef.get();

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

export default function Notification() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownItems, setDropdownItems] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    async function fetchData() {
      const stack = new Stack();
      try {
        const result = await fetchDataFromFirestore(stack);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDropdownToggle = async (collectionName, itemId) => {
    if (activeDropdown === itemId) {
      setActiveDropdown(null);
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: [] }));
      return;
    }

    try {
      const colRef = collection(db, "Assign");
      const querySnapshot = await getDocs(colRef);
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setDropdownItems((prevState) => ({ ...prevState, [itemId]: items }));
      setActiveDropdown(itemId);
    } catch (error) {
      console.error("Error fetching dropdown items:", error);
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: [] }));
      setActiveDropdown(null);
    }
  };

  const handleAssign = async (collectionName, itemId, assignee) => {
    const success = await assignTask(collectionName, itemId, assignee);
    if (success) {
      navigate('/history');
    } else {
      alert("Failed to assign task");
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <main>
      <Navbar2 />
      {error && <p>Error: {error}</p>}
      {Object.keys(data).length > 0 ? (
        Object.keys(data).map((collectionName) => (
          <section className={`${styles.cd}`} key={collectionName}>
            <div>
              {data[collectionName].length > 0 ? (
                data[collectionName].map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.items} ${item.solved ? styles.solved : ""}`}
                  >
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

                    <Dropdown
                      onToggle={() => handleDropdownToggle(collectionName, item.id)}
                    >
                      <Dropdown.Toggle
                        variant="primary"
                        id={`dropdown-basic-${item.id}`}
                      >
                        Assign
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {(dropdownItems[item.id] || []).map((dropdownItem) => (
                          <Dropdown.Item
                            key={dropdownItem.id}
                            onClick={() =>
                              handleAssign(collectionName, item.id, dropdownItem.name)
                            }
                          >
                            {dropdownItem.name || "Not available"}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ))
              ) : (
                <p>No items in this collection</p>
              )}
            </div>
          </section>
        ))
      ) : (
        <p>No data found</p>
      )}
      <Footer />
    </main>
  );
}
