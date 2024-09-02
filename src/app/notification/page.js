"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar2 from "@components/Navbar2";
import styles from "@styles/notification.module.css";
import Footer from "@components/Footer";
import { Dropdown } from 'react-bootstrap'; // Import React Bootstrap components

async function fetchDataFromFirestore() {
  try {
    const collections = ["Reports", "Report2", "Report3", "Report4"]; // List your collections here
    const data = {};

    for (const collectionName of collections) {
      const colRef = collection(db, collectionName);
      const querySnapshot = await getDocs(colRef);

      data[collectionName] = [];
      querySnapshot.forEach((doc) => {
        data[collectionName].push({ id: doc.id, ...doc.data() });
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return {};
  }
}

export default function Notification() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchDataFromFirestore();
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

  const handleDropdownToggle = async (collectionName) => {
    try {
      const colRef = collection(db, collectionName);
      const querySnapshot = await getDocs(colRef);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setDropdownItems(items);
    } catch (error) {
      console.error("Error fetching dropdown items:", error);
      setDropdownItems([]);
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
                data[collectionName].map((item) => (
                  <div key={item.id} className={styles.items}>
                    <p className={`${styles.description}`}>
                      Description<br/>{item.Description || 'N/A'} <br/>
                    </p>
                    <p className={`${styles.location}`}>Location<br/>{item.Location || 'N/A'}</p>
                    <p className={`${styles.reportedBy}`}>ReportedBy<br/>{item.ReportedBy || 'N/A'}</p>
                    <p className={`${styles.image}`}>Image<br/>{item.Image || 'N/A'}</p>

                    <Dropdown onClick={() => handleDropdownToggle(collectionName)}>
                      <Dropdown.Toggle variant="primary" id={`dropdown-basic-${item.id}`}>
                        Assign
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {dropdownItems.map((dropdownItem) => (
                          <Dropdown.Item key={dropdownItem.id} href={`#/${dropdownItem.id}`}>
                            {dropdownItem.Assign || 'Not available'}
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
