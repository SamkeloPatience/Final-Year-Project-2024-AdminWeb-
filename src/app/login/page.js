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
      <section className={`vh-100 ${styles.section}`}>
  <div className={`container py-5 h-100`}>
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className={`${styles.card}`}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
              <Image src={Logo}
                alt="login form" className={`img-fluid `}/>
            </div>
            <div className={`col-md-6 col-lg-7 d-flex align-items-center ${styles.Login}`}>
              <div className="card-body p-4 p-lg-5 text-black">

                <form>
                  <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" for="form2Example17">Username</label>
                    <input type="email" id="form2Example17" className="form-control form-control-lg" />
                  </div>

                  <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" for="form2Example27">Password</label>
                    <input type="password" id="form2Example27" className="form-control form-control-lg" />
                  </div>

                  <div className="pt-1 mb-4">
                    <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="button">Login</button>
                  </div>
                  <a className="small text-muted" href="#!">Forgot password?</a>
                 
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}