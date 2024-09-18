"use client";
import styles from "@styles/Navabar.module.css"
import logo from "@images/logo.jpg";
import bell from '@images/bell.svg'
import history from "@images/history.svg"
import graph from "@images/graph-up.svg"
import house from "@images/house.svg"
import Image from "next/image";

export default function Navbar() {
  return (
    <main>
      <nav className={` navbar fixed-top navbar-expand-sm text-bg-info ${styles.nav} `}>
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
        <div className={`col-sm-12 col-md-8 col-lg-6 justify-content-end ${styles.navlink}`}>
          <ul className={`navbar-nav  `}>
            <li className="nav-item">
              <a className="nav-link" href="dashboard">
              <Image src={house} width={30} height={30} alt="Home"/>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="notification">
                <Image src={bell} width={30} height={30} alt="notification"/>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="history">
                <Image src={history} width={30} height={30} alt="history"/>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="visualization">
                <Image src={graph} width={30} height={30} alt="visualization"/>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="assigned">
                Assignment
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
