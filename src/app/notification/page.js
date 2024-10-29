"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc,} from "firebase/firestore";
import { db } from "../notification/api/firebaseConfig";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import styles from "@styles/notification.module.css";
import Stack from "./stack";
import { Dropdown } from "react-bootstrap";

// Fetching report based on admin's department and sorting by date
async function fetchDataFromFirestore(stack, userDepartment) {
  try {
    const collectionName =
      userDepartment === "PPO" ? "ppo_department" : "psd_department";
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);

    // Get and sort data based on TimeStamp
    const sortedData = [];
    querySnapshot.forEach((doc) => {
      const docData = { id: doc.id, ...doc.data() };
      sortedData.push(docData);
    });
    sortedData.sort((a, b) => b.TimeStamp.seconds - a.TimeStamp.seconds);

    sortedData.forEach((docData) => {
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
    const docRef = doc(db, collectionName, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dataDoc = docSnap.data();
      const timestamp = new Date();
      const userDepartment = localStorage.getItem("userDepartment");

      if (userDepartment === "PPO") {
        await setDoc(doc(db, "PPO_Staff", itemId), {
          ...dataDoc,
          assignedTo: assignee,
          assignAt: timestamp,
          status: "In Progress",
        });
      } else {
        await setDoc(doc(db, "PSD_Staff", itemId), {
          ...dataDoc,
          assignedTo: assignee,
          assignAt: timestamp,
          status: "In Progress",
        });
      }

      await setDoc(doc(db, "Tempo", itemId), {
        ...dataDoc,
        assignedTo: assignee,
        assignAt: timestamp,
        status: "In Progress",
      });

      await deleteDoc(docRef);

      setData((prevData) => {
        const updatedCollection = prevData[collectionName].filter(
          (item) => item.id !== itemId
        );
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
  const [expandedImage, setExpandedImage] = useState(null);

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
    if (activeDropdown === itemId) {
      setActiveDropdown(null);
      setDropdownItems((prevState) => ({ ...prevState, [itemId]: [] }));
    } else {
      const item = data[collectionName].find(
        (collection) => collection.id === itemId
      );

      if (item) {
        const description =
          item.Description && item.Description.length > 0
            ? item.Description[0].toLowerCase()
            : "";

        let role = null;

        if (description.includes("electricity")) {
          role = "Electrician";
        } else if (description.includes("plumbing")) {
          role = "Plumber";
        } else if (description.includes("infrastructure")) {
          role = "Technician";
        } else if (
          ["safety", "locked", "destructive noise", "property vandalism", "Illegal trading","other", "abuse"
           ].some((keyword) => description.includes(keyword.toLowerCase()))
        ) {
          role = "Security";
        }

        if (role) {
          const staff = await fetchStaffByDepartmentAndRole(
            localStorage.getItem("userDepartment"),
            role
          );
          setDropdownItems((prevState) => ({
            ...prevState,
            [itemId]: staff,
          }));
          setActiveDropdown(itemId);
        }
      }
    }
  };

  const renderImage = (image) => {
    if (!image) return <p>No image available</p>;

    return (
      <img
        src={image}
        alt="Report image"
        className={styles.image}
        onClick={() => setExpandedImage(image)} // Set image to be expanded
      />
    );
  };

  const renderModal = () => {
    if (!expandedImage) return null;

    return (
      <div className={styles.modal}>
        <span className={styles.close} onClick={() => setExpandedImage(null)}>
          &times;
        </span>
        <img
          className={styles.modalImage}
          src={expandedImage}
          alt="Expanded View"
        />
      </div>
    );
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
                      {item.Description?.length ? (
                        <ul className={`${styles.list}`}>
                          {item.Description.map((desc, i) => (
                            <li key={i}>{`${desc}`}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className={`${styles.location}`}>
                      Location:
                      <br />
                      {item.Location && item.Location.length === 3 ? (
                        <ul className={`${styles.list}`}>
                          <li>{`${item.Location[0]}`}</li>
                          <li>{`Block: ${item.Location[1]}`}</li>
                          <li>{`Room: ${item.Location[2]}`}</li>
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className={`${styles.reportedBy}`}>
                      ReportedBy
                      <br />
                      {item.ReportedBy && item.ReportedBy.length === 3 ? (
                        <ul className={`${styles.list}`}>
                          <li>{`${item.ReportedBy[0]}`}</li>
                          <li>{`cellPhone: ${item.ReportedBy[1]}`}</li>
                          <li>{`e-mail: ${item.ReportedBy[2]}`}</li>
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className={styles.Time}>
                      ReportedAt
                      <br />
                      {item.TimeStamp
                        ? new Date(
                            item.TimeStamp.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className={styles.image}>
                      Image:
                      <br />
                      {renderImage(item.Image)}
                      {renderModal()}
                    </p>
                    <Dropdown show={activeDropdown === item.id}>
                      <Dropdown.Toggle
                        variant="primary"
                        id={`dropdown-basic-${item.id}`}
                        onClick={() =>
                          handleDropdownToggle(item.id, collectionName)
                        }
                      >
                        Assign
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {dropdownItems[item.id]?.length > 0 ? (
                          dropdownItems[item.id].map((staff) => (
                            <Dropdown.Item
                              key={staff.id}
                              onClick={async () => {
                                await assignTask(
                                  collectionName,
                                  item.id,
                                  staff.name,
                                  setData,
                                  data
                                );
                                setActiveDropdown(null);
                              }}
                            >
                              {staff.name}
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item disabled>
                            No staff available
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ))
              ) : (
                <p>No reports available in {collectionName} collection.</p>
              )}
            </div>
          </section>
        ))
      ) : (
        <p>No data available</p>
      )}
      <Footer />
    </main>
  );
}
