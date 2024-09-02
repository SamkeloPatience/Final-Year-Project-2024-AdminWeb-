"use client";
import styles from "@styles/Navbar2.module.css"
import logo from "@images/logo.jpg";
import Image from "next/image";

export default function Navbar2() {
  return (
    <main>
      <nav className={` navbar navbar-expand-sm text-bg-info ${styles.nav} `}>
        <ul>
          <Image
            src={logo}
            width={60}
            height={50}
            alt="unizulu"
            className={`navbar-brand ${styles.navImg}`}
          />
          <h6 className={`text-left text-dark`}>admin@unizulu</h6>
        </ul>
        <div className={`col-sm-12 col-md-4 col-lg-4 justify-content-end ${styles.navlink}`}>
          <ul className={`navbar-nav `}>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="visualization">
                Visulization
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="notification">
                Notification
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="history">
                History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="aboutUs">
                AboutUs
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </main>
  );
}
