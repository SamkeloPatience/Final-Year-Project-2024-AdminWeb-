'use client';
import React, { useState } from 'react';
import styles from '@styles/Sidebar.module.css';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className="sidebar-header">
        <h4 className="text-center">Admin Panel</h4>
        <button
          className={` ${styles.toggleButton}`}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          data-toggle="collapse" 
          role="button" aria-expanded="false" aria-controls="collapseExample"
        >
          <i className={`bi ${isOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
      </div>
      <ul className={`nav flex-column ${styles.sidebarLinks}`}>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-house-door"></i> Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/notification">
            <i className="bi bi-bell"></i> Notifications
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/history">
            <i className="bi bi-clock"></i> History
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/visualization">
            <i className="bi bi-bar-chart"></i> Visualization
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/aboutUs">
            <i className="bi bi-info-circle"></i> About Us
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
