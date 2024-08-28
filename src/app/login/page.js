"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@styles/login.module.css";

export default function Login() {
  const router = useRouter();
  const [name, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Display alert with login information
    alert(`Username: ${Username}\nPassword: ${name}`);
    console.log("Hello there");

    // Perform validation or data processing here
    router.push("/visualization");
  };

  return (
    <main>
      <div className={`row ${styles.loginContainer}`}>
        <div className={`col-sm-12 col-md-6 col-lg-6`}>
          <div className={`justify-content-start ${styles.imageContainer}`}>
            <img
              src="/images/Login/login1.jpeg"
              alt="login"
              className={styles.loginImage1}
            />
            <img
              src="/images/Login/login2.jpeg"
              alt="login"
              className={styles.loginImage2}
            />
            <br/>
            <img
              src="/images/Login/login3.jpeg"
              alt="login"
              className={styles.loginImage3}
            />
          </div>
      <div className= {`row`}>
        <div className={`col-sm-12 col-md-6 col-lg-6 ${styles.imageContainer2}`} > 
          <h6 className= {`justify-content-center`}>@admin</h6>
          </div>
          <div className={`col-sm-12 col-md-6 col-lg-6 d-flex jusify-content-end ${styles.imageContainer3}`}>
           <h6>@admin</h6>
          </div>
        </div>
      </div>
        <div className={`col-sm-12 col-md-6 col-lg-6 d-flex justify-content-end ${styles.formContainer1}`}>
          <div className={`p-4 p-lg-5 text-black`}>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className={styles.formContainer2}
            >
              <div className="form-outline mb-2">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  id="form"
                  className="form-control form-control-lg"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  id="userpassword"
                  className="form-control form-control-lg"
                  value={name}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="pt-1 mb-4">
                <button
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-dark btn-lg btn-block"
                  type="submit"
                >
                  Login
                </button>
              </div>
              <a className="small text-muted" href="#!">
                Forgot password?
              </a>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
