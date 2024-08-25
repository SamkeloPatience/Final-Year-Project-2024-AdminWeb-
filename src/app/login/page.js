'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from "@styles/login.module.css";
import Logo from "@images/log.png";
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [Username, setUsername] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Display alert with login information
    alert(`Username: ${Username}\nPassword: ${name}`);

    // Perform validation or data processing here
    router.push('/visualization');
  };

  return (
    <main>
        <div className={``}>
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className={`col-sm-12 col-md-4 col-lg-4 d-flex justify-content-center bg-light ${styles.container}`}>
              <div className={styles.card}>
                <div className="row g-0">
                  <div className="col-md-8 col-lg-9 d-flex align-items-center">
                    <div className="card-body p-6 p-lg-8 text-black">
                      <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="d-flex align-items-center mb-2 pb-1">
                          <i className="fas fa-cubes fa-2x me-3"></i>
                          <div className={`h1 fw-bold mb-0 `}>
                            <Image
                              className={` justify-content-end${styles.LogoImage}`}
                              src={Logo}
                              width={80}
                              height={50} 
                              alt="Logo" 
                            />
                          </div>
                        </div>
                        <div className="form-outline mb-2">
                          <label className="form-label" htmlFor="form2Example17">
                            Username
                          </label>
                          <input
                            type="username"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off" 
                            required
                          />
                        </div>
                        <div className="form-outline mb-1">
                        <label className="form-label" htmlFor="form2Example27">Password</label>
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="new-password" // Prevents browser from autofilling or saving this input
                            required
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button className="btn btn-dark btn-lg btn-block" type="submit">
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
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
