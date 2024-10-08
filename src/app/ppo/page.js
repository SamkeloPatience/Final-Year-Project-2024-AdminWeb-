"use client";

import Dashboard from "../dashboard/page";
import styles from "@styles/dashboard.module.css"
import Image from "next/image";
import logo from "@images/Login/login1.jpeg"

export default function PPO() {
  return (
    <main>
      <Dashboard />
      <div className= {`row justify-content-center ${styles.row}`}>
        <div className={`col-sm-12 col-md-6 col-large-4 ${styles.ppo}`}>
      <h2 className={`${styles.heading}`}>
        Welcome to the Physical Planning and Operations Department
      </h2>
      <Image 
        src={logo} 
        width={100}
        height={50}
        className= {` ${styles.image}`}
        />
        </div>
        </div>
    </main>
  );
}
