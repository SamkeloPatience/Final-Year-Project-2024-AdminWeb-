"use client";
import styles from "@styles/Navabar.module.css";
import logo from "@images/Login/logo.png";
import Image from "next/image";

export default function Navbar() {
  return (
    <main>
      <nav
        className={` col-lg-6 col-xlg-4 navbar navbar-expand-md text-bg-info ${styles.nav} `}
      >
        <ul>
          <Image
            src={logo}
            alt="unizulu"
            className={`navbar-brand ${styles.navImg}`}
          />
          <h6 className={`text-left text-dark`}>admin@unizulu</h6>
        </ul>
        <div className={`justify-content-end ${styles.navlink}`}>
          <ul className={`navbar-nav  `}>
            <li className="nav-item">
              <a className="nav-link" href="dashboard">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="notification">
                Notification
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="assigned">
                Assignment
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="history">
                History
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="visualization">
                Visualization
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="aboutUs">
                AboutUs
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </main>
  );
}
