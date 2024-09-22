"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, getDocs } from "firebase/firestore"; 
import { db } from "../app/notification/api/firebaseConfig"; 
import styles from "@styles/login.module.css"; 
import bcrypt from 'bcryptjs'; // Ensure you have bcryptjs installed

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error messages
    setLoading(true); // Disable button and show loading state
  
    try {
      const q = query(collection(db, "Login")); // Adjust collection name as needed
      const querySnapshot = await getDocs(q);
      
      let userFound = false;

      querySnapshot.docs.forEach((doc) => {
        const userDoc = doc.data();
        
        if (userDoc.username === username) {
          userFound = true; // User found

          // Use bcrypt to compare the hashed password
          if (bcrypt.compareSync(password, userDoc.password)) {
            router.push("/dashboard"); // Redirect on success
          } else {
            setErrorMessage("Incorrect password. Please try again.");
          }
        }
      });

      if (!userFound) {
        setErrorMessage("Incorrect username or password.");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Re-enable button after operation
    }
  };

  return (
    <main>
      <div className={`row ${styles.loginContainer}`}>
        <div className={`col-sm-12 col-md-6 col-lg-6`}>
          <div className={`justify-content-start ${styles.imageContainer}`}>
            <img src="/images/Login/login1.jpeg" alt="login" className={styles.loginImage1} />
            <img src="/images/Login/login2.jpeg" alt="login" className={styles.loginImage2} />
            <br />
            <img src="/images/Login/login3.jpeg" alt="login" className={styles.loginImage3} />
          </div>
          <div className={`row`}>
            <div className={`col-sm-12 col-md-6 col-lg-6 ${styles.imageContainer2}`}>
              <h6 className={`justify-content-center`}>@admin</h6>
            </div>
            <div className={`col-sm-12 col-md-6 col-lg-6 d-flex justify-content-end ${styles.imageContainer3}`}>
              <h6>@admin</h6>
            </div>
          </div>
        </div>
        <div className={`col-sm-12 col-md-4 col-lg-6 d-flex justify-content-end ${styles.formContainer1}`}>
          <div className={`p-4 p-lg-5 text-black`}>
            <form onSubmit={handleSubmit} autoComplete="off" className={styles.formContainer2}>
              <div className="form-outline mb-2">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control form-control-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-outline mb-4">
                <label htmlFor="userpassword" className="form-label">Password</label>
                <input
                  type="password"
                  id="userpassword"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <div className="pt-1 mb-4">
                <button
                  className="btn btn-dark btn-lg btn-block"
                  type="submit"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <a className="small text-muted" href="#!">Forgot password?</a>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
