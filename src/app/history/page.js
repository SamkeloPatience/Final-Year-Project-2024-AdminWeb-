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
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedImageId, setExpandedImageId] = useState(null);

  useEffect(() => {
    async function fetchDataFromFirestore() {
      try {
        const userDepartment = localStorage.getItem("userDepartment");
        const collectionName =
          userDepartment === "PPO" ? "PPO_History" : "PSD_History";

        /* Fetching data from the appropriate history collection */
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds); 

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
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (data.length === 0) {
    return (
      <div>
        <Navbar />
        <h1 className={`justify-content-center`}>
          No Reports have been solved
        </h1>
      </div>
    );
  }
  // Function to handle image click and update state
  const handleImageClick = (image, itemId) => {
    console.log("Image clicked:", image, "ID:", itemId);
    setExpandedImage(image);
    setExpandedImageId(itemId);
  };

  // Function to render each report image
  const renderImage = (image, itemId) => {
    if (!image) return <p>No image available</p>;

    return (
      <img
        src={image}
        alt="Report image"
        className={styles.image}
        onClick={() => handleImageClick(image, itemId)} 
      />
    );
  };

  // Function to render the modal
  const renderModal = () => {
    if (!expandedImage) return null;

    return (
      <div
        className={styles.modal}
        onClick={() => {
          setExpandedImage(null); 
          setExpandedImageId(null);
        }}
      >
        <span
          className={styles.close}
          onClick={(e) => {
            e.stopPropagation(); 
            setExpandedImage(null);
            setExpandedImageId(null);
          }}
        >
          &times;
        </span>
        <img
          className={`${styles.modalImage}`}
          src={expandedImage}
          alt="Expanded View"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };
  return (
    <main>
      <Navbar />
      <div className={`${styles.container}`}>
        {data.map((item) => (
          <div key={item.id} className={`row ${styles.secondContainer}`}>
            <p className={`${styles.description}`}>
              Description:
              <br />
              {Array.isArray(item.Description) && item.Description.length ? (
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
              Reported By:
              <br />
              {Array.isArray(item.ReportedBy) && item.ReportedBy.length ? (
                <ul className={`${styles.list}`}>
                  {item.ReportedBy.map((desc, i) => (
                    <li key={i}>{`${desc}`}</li>
                  ))}
                </ul>
              ) : (
                "N/A"
              )}
            </p>
            <p className={`${styles.assignedTo}`}>
              Assigned To:
              <br />
              {item.assignedTo || "N/A"}
              <br />
              {item.assignAt ? (
                <span className={`${styles.assignedTo}`}>
                  {new Date(item.assignAt.seconds * 1000).toLocaleString()}
                </span>
              ) : (
                "N/A"
              )}
            </p>
            <p className={styles.image2}>
              Image:
              <br />
              {renderImage(item.Image, item.id)}
            </p>
            <p className={`${styles.status}`}>
              Status:
              <br />
              {item.status || "N/A"}
              <br />
              {item.updatedAt ? (
                <span className={`${styles.updatedAt}`}>
                  {new Date(item.updatedAt.seconds * 1000).toLocaleString()}
                </span>
              ) : (
                "N/A"
              )}
            </p>
            <div className={`row`}>
              <div className={`${styles.Feedback}`}>
                <p className={styles.feedback}>
                  Feedback from the Technician:
                  <br />
                  {item.remarks || "No feedback avaialable"}
                </p>
                
                {/* Conditional rendering for user feedback */}
                {item.feedback ? (
                  <p className={styles.feedback}>
                    Feedback from Users:
                    <br />
                    {item.feedback}
                  </p>
                ) : (
                  <p className={styles.feedback}>
                    Feedback from Users:
                    <br />
                    No feedback available
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
       {expandedImage && expandedImageId && renderModal()}
      <Footer />
    </main>
  );
}
