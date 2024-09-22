"use client";
import React from "react";
import Navbar from "@components/Navbar";
import styles from "@styles/dashboard.module.css";

export default function Dashboard() {
 
  return (
    <main>
      <Navbar />
      <h2 className={`d-flex justify-content-center ${styles.heading}`}>
        Welcome to the Physical Planning and Operations Department
      </h2>
     
    </main>
  );
}
