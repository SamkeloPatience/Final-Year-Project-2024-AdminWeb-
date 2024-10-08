"use client";
import Navbar from "@components/Navbar"
import styles from "@styles/aboutUs.module.css"

export default function AboutUs() {
    return (
        <main>
            <Navbar />
            <div className="container">
                <h1 className={styles.About}>About Us</h1>
                <p>
                    The Protective Services Department (PSD) at UNIZULU was set up to assist the University in executing 
                    its mission of ensuring a safe and secure environment that is conducive to teaching and learning.
                    With more than 80 staff members at the KwaDlangezwa and Richards Bay Campuses, the Department has made 
                    great strides in crime prevention on campus through increased visibility of uniformed officers, 
                    satellite stations, community engagement as well as institutional campaigns.
                </p>
                <div className="campus-info">
                    <div className="campus kwa">
                        <p><strong>KwaDlangezwa Campus:</strong><br />
                        Office: 035 902 6599<br />
                        Fax: 035 902 6480<br />
                        Email: <a href="mailto:GoosenE@unizulu.ac.za">GoosenE@unizulu.ac.za</a></p>
                    </div>
                    
                    </div>
                </div>
                <div className="objectives-section">
                    <div className="objectives">
                        <h2>Objectives</h2>
                        <p>To protect persons on campus through proactive law enforcement and promote a safe and secure environment.</p>
                        <p>To address issues that impede and/or disrupt the orderly operation of the University's academic efforts.</p>
                        <p>To protect the University’s property and that of the campus community by initiating police action, enforcing laws, and educating the campus on crime prevention methods.</p>
                        <p>To protect the University's reputation by taking action to deter acts or omissions that can damage the good name of the University.</p>
                        <p>To minimize liability and hazards to the University and the campus community.</p>
                    </div>
                    <div className="interactive-approach">
                        <h2>24/7 Interactive Approach</h2>
                        <p>PSD is interactive in its approach and has implemented innovative ways to curb crime. In addition to daily patrol and protection services, the Department facilitates trauma counselling and emergency medical care.</p>
                        <img src="https://www.unizulu.ac.za/wp-content/uploads/2021/11/2-NEW-HOSTEL-.jpg" alt="Campus overview" className="campus-image" />
                    </div>
                </div>
        
    </main>
);
}
