"use client";

import Dashboard from "../dashboard/page";
import styles from "@styles/dashboard.module.css"

export default function PSD() {
  return (
    <main>
      <Dashboard />
      <div className= {`row justify-content-center ${styles.row}`}>
        <div className={`col-sm-12 col-md-6 col-large-4 ${styles.ppo}`}>
      <h2 className={`${styles.heading}`}>
        Welcome to the PROTECTION SERVICES DEPARTMENT 
      </h2>
      </div>
      </div>
    </main>
  );
}
