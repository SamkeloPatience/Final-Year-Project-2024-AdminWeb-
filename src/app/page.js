"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../app/notification/api/firebaseConfig";
import styles from "@styles/login.module.css";

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

      // Query Firestore for the user with matching username and password
      const loginCollection = collection(db, "Users");
      const q = query(
        loginCollection,
        where("username", "==", username),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If user not found
        setError("Invalid username or password.");
        console.log("Invalid username or password.");
      } else {
        // One user to match the credentials
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Checking the user's department to route
        if (userData.department === "PPO") {
          localStorage.setItem("userDepartment", "PPO");
          router.push("/ppo");
        } else if (userData.department === "PSD") {
          localStorage.setItem("userDepartment", "PSD");
          router.push("/psd");
        }
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
      <div className={`row`}>
        <div className={`col-sm-12 col-md-4 col-large-4`}>
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
                <br />
                <img
                  src="/images/Login/login3.jpeg"
                  alt="login"
                  className={styles.loginImage3}
                />
              </div>
              <div
                className={`col-sm-12 col-md-6 col-lg-6 ${styles.imageContainer2}`}
              >
                <h6 className={`justify-content-center`}>@admin</h6>
              </div>
              <div
                className={`col-sm-12 col-md-6 col-lg-6 d-flex justify-content-end ${styles.imageContainer3}`}
              >
                <h6>@admin</h6>
              </div>
            </div>
          </div>
        </div>
        <div className={`col-sm-12 col-md-6 col-lg-6 justify-content-end  ${styles.form}`}>
          <div className={`${styles.formContainer1}`}>
            <div className={`p-4 p-lg-5 text-black`}>
              <form
                onSubmit={handleSubmit}
                autoComplete="off"
                className={styles.formContainer2}
              >
                <div className="form-outline mb-2">
                  <label htmlFor="username" className="form-label">
                    Admin Username
                  </label>
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
                  <label htmlFor="userpassword" className="form-label">
                    Password
                  </label>
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
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-dark btn-lg btn-block"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
                <a className="small text-muted" href="#!">
                  Forgot password?
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
