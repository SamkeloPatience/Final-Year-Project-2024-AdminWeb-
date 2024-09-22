"use client";

import Dashboard from "../dashboard/page";
import styles from "@styles/dashboard.module.css"

export default function PPO() {
  return (
    <main>
      <Dashboard />
      <h2 className={`d-flex justify-content-center ${styles.heading}`}>
        Welcome to the Physical Planning and Operations Department
      </h2>
    </main>
  );
}
