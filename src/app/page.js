"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../app/notification/api/firebaseConfig"; 
import styles from "@styles/login.module.css"; 

const testFirestoreConnection = async () => {
  try {
    const loginCollection = collection(db, "Users");
    const snapshot = await getDocs(loginCollection);
    console.log("Number of documents:", snapshot.size);  
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());  
    });
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
};

testFirestoreConnection();

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Starting login process...");

      const loginCollection = collection(db, "Users");
      const querySnapshot = await getDocs(loginCollection);
      console.log("Documents fetched from Firestore:", querySnapshot.size);

      let loginSuccess = false;

      // Iterating through the documents to check for matching credentials
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        console.log("Checking document:", data);

        // Comparing username and password 
        if (data.username === username && data.password === password) {
          console.log("Login successful for user:", username);
          loginSuccess = true;

          // Checking if the department is PPO or PSD 
          if (data.department === "PPO") {
            router.push('/ppo'); 
          } else if (data.department === "PSD") {
            router.push('/psd'); 
          } else {
            setError("Unauthorized role.");
            console.log("Unauthorized role.");
          }
          break; 
        }
      }

      if (!loginSuccess) {
        setError("Invalid username or password.");
        console.log("Invalid username or password.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <div className="pt-1 mb-4">
                <button
                  className="btn btn-dark btn-lg btn-block"
                  type="submit"
                  disabled={loading}
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
