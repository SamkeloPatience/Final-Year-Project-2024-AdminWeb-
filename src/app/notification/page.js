"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import styles from "@styles/notification.module.css";
import Stack from "./stack";
import { Dropdown } from "react-bootstrap";
import { useRouter } from 'next/navigation';

// Fetch reports from Firestore based on the admin's department
async function fetchDataFromFirestore(stack, userDepartment) {
  try {
    const collectionName = userDepartment === 'PPO' ? "ppo_Reports" : "psd_Reports";
    const data = {};
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);

    querySnapshot.forEach((doc) => {
      const docData = { id: doc.id, ...doc.data() };
      stack.push(docData);
    });

    data[collectionName] = stack.getStack();
    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return {};
  }
}

// Assign a task and move the document to history
async function assignTask(collectionName, itemId, assignee) {
  try {
    const docRef = doc(db, collectionName, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const timestamp = new Date();

      await updateDoc(docRef, {
        assignedTo: assignee,
        assignAt: timestamp
      });
      await setDoc(doc(db, "Staff", itemId), { ...data, assignedTo: assignee, assignAt: timestamp });
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
  const [assignData, setAssignData] = useState([]);
  const [dropdownItems, setDropdownItems] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const stack = new Stack();
      const userDepartment = localStorage.getItem('userDepartment');
      if (!userDepartment) {
        setError("No department found. Please log in again.");
        return;
      }

      try {
        const result = await fetchDataFromFirestore(stack, userDepartment);
        setData(result);
        const assignColRef = collection(db, "Staff");
        const assignSnapshot = await getDocs(assignColRef);
        const assignItems = [];
        
        assignSnapshot.forEach((doc) => {
          assignItems.push({ id: doc.id, ...doc.data() });
        });
        
        setAssignData(assignItems);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDropdownToggle = (itemId) => {
    if (activeDropdown === itemId) {
      setActiveDropdown(null);
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: [] }));
    } else {
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: assignData }));
      setActiveDropdown(itemId);
    }
  };

  const handleAssign = async (collectionName, itemId, assignee) => {
    const success = await assignTask(collectionName, itemId, assignee);
    if (success) {
      alert(`Report assigned to ${assignee}`);
      router.refresh();
    } else {
      alert("Failed to assign task");
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <main>
      <Navbar />
      {error && <p>Error: {error}</p>}
      {Object.keys(data).length > 0 ? (
        Object.keys(data).map((collectionName) => (
          <section className={`${styles.cd}`} key={collectionName}>
            <div>
              {data[collectionName].length > 0 ? (
                data[collectionName].map((item) => (
                  <div key={item.id} className={`${styles.items}`}>
                    <p className={`${styles.description}`}>
                      Description: {item.Description || "N/A"}
                    </p>
                    <p className={`${styles.location}`}>
                      Location: {item.Location || "N/A"}
                    </p>
                    <p className={`${styles.reportedBy}`}>
                      Reported By: {item.ReportedBy || "N/A"}
                    </p>
                    <p className={styles.image}>
                      Image: {item.Image || "N/A"}
                    </p>

                    <Dropdown
                      show={activeDropdown === item.id}
                      onToggle={() => handleDropdownToggle(item.id)}
                    >
                      <Dropdown.Toggle variant="primary" id={`dropdown-basic-${item.id}`}>
                        Assign
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {(dropdownItems[item.id] || []).map((dropdownItem) => (
                          <Dropdown.Item
                            key={dropdownItem.id}
                            onClick={() => handleAssign(collectionName, item.id, dropdownItem["name "]?.trim())}
                          >
                            {dropdownItem["name "]?.trim() || "Not available"}
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
