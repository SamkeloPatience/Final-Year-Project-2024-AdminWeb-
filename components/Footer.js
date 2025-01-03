'use client' ; 
import React from "react";
import styles from '../styles/Footer.module.css'



export default function Footer(){
    return(
        <main>
           <footer className= {`bg-dark ${styles.Footer}`} >
            <div className= { `row`}>
                <div className= {` col-sm-12 col-md-4 col-lg-4`}>
                    <h6 className= {`text-light text-start ${styles.footerColumnHeader}`}>ReportMe</h6>
                </div>
               <div className={`col-sm-12 col-md-4 col-lg-4 d-flex justify-content-center`}>
                </div> 
                <div className= {` col-sm-12 col-md-4 col-lg-4`} >
                    <div className={`justify-content-center`}>
                 
                    </div>
                   
                </div>

            </div>
       
            <div className= {`bg-light ${styles.coypright}`}>
            <h6 className= {`text-center text-dark`}>Coypright @ReportMe-2024</h6>
            </div>
            
           </footer>
        </main>

    );
}