"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import styles from "@styles/notification.module.css";
import Stack from "./stack";
import { Dropdown } from "react-bootstrap";


// Fetching report based on admin's department
async function fetchDataFromFirestore(stack, userDepartment) {
  try {
    const collectionName = userDepartment === "PPO" ? "ppo_Reports" : "psd_Reports";
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);

    querySnapshot.forEach((doc) => {
      const docData = { id: doc.id, ...doc.data() };
      stack.push(docData);
    });

    return { [collectionName]: stack.getStack() };
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return {};
  }
}

async function fetchStaffByDepartmentAndRole(userDepartment, role) {
  const assignColRef = collection(db, "Users");
  const assignSnapshot = await getDocs(assignColRef);
  const assignItems = [];

  assignSnapshot.forEach((doc) => {
    const staffData = doc.data();
    if (staffData.department === userDepartment && staffData.role === role) {
      assignItems.push({ id: doc.id, ...staffData });
    }
  });

  return assignItems;
}

async function assignTask(collectionName, itemId, assignee, setData, data) {
  try {
    console.log(`Assigning task from ${collectionName}, itemId: ${itemId}, to assignee: ${assignee}`);
    const docRef = doc(db, collectionName, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dataDoc = docSnap.data();
      const timestamp = new Date();
      // Updating collections 
      await updateDoc(docRef, {
        assignedTo: assignee,
        assignAt: timestamp,
        status: "In Progress",
      });

      await setDoc(doc(db, "Staff", itemId), {
        ...dataDoc,
        assignedTo: assignee,
        assignAt: timestamp,
        status: "In Progress",
      });
    
      await deleteDoc(docRef);
    // Removing Report from local state
      setData((prevData) => {
        const updatedCollection = prevData[collectionName].filter((item) => item.id !== itemId);
        return { ...prevData, [collectionName]: updatedCollection };
      });

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

  useEffect(() => {
    async function fetchData() {
      const stack = new Stack();
      const userDepartment = localStorage.getItem("userDepartment");
      if (!userDepartment) {
        setError("No department found. Please log in again.");
        return;
      }

      try {
        const result = await fetchDataFromFirestore(stack, userDepartment);
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

  const handleDropdownToggle = async (itemId, collectionName) => {
    console.log("Toggling dropdown for itemId:", itemId);
  
    if (activeDropdown === itemId) {
      setActiveDropdown(null);
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: [] }));
    } else {
      const item = data[collectionName].find((collection) => collection.id === itemId);
  
      if (item) {
        const description = item.Description ? item.Description.toLowerCase() : "";
        let role = null;
  
        // Matching roles based on the description
        if (description.includes("electricity")) {
          role = "Electrician";
        } else if (description.includes("plumbing")) {
          role = "Plumber";
        } else if (description.includes("infrastructure")) {
          role = "Technician";
        } else if (description.includes("safety")) {
          role = "Security";
        }
  
        if (role) {
          const staff = await fetchStaffByDepartmentAndRole(localStorage.getItem("userDepartment"), role);
          console.log("Staff fetched:", staff);
          setDropdownItems((prevState) => ({
            ...prevState,
            [itemId]: staff,
          }));
          setActiveDropdown(itemId);
        } else {
          console.warn("No role matched for the description:", description);
        }
      } else {
        console.error("Item not found for itemId:", itemId);
      }
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
                      Description:
                      <br />
                      {item.Description || "N/A"}
                    </p>
                    <p className={`${styles.location}`}>
                      Location:
                      <br />
                      {item.Location || "N/A"}
                    </p>
                    <p className={`${styles.reportedBy}`}>
                      Reported By:
                      <br />
                      {item.ReportedBy || "N/A"}
                    </p>
                    <p className={styles.image}>
                      Image:
                      <br />
                      {item.Image || "N/A"}
                    </p>
                    <Dropdown show={activeDropdown === item.id}>
                      <Dropdown.Toggle
                        variant="primary"
                        id={`dropdown-basic-${item.id}`}
                        onClick={() => handleDropdownToggle(item.id, collectionName)}
                      >
                        Assign
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {(dropdownItems[item.id] || []).length > 0 ? (
                          dropdownItems[item.id].map((dropdownItem) => (
                            <Dropdown.Item
                              key={dropdownItem.id}
                              onClick={() =>
                                assignTask(
                                  collectionName,
                                  item.id,
                                  dropdownItem.name?.trim(),
                                  setData,
                                  data
                                )
                              }
                            >
                              {dropdownItem.name?.trim() || "Not available"}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>No staff available</Dropdown.Item>
                        )}
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
