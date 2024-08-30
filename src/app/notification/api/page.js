"use client"
import { useEffect, useState } from 'react';
import styles from "../api/page.module.css"

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/fetchData');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        console.log('Data fetched from Firebase:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <main className={styles.parent}>
      <div>
        <h1>Data from Firebase</h1>
        {error && <p>Error: {error}</p>}
        {data ? (
          Object.keys(data).length > 0 ? (
            <div className={styles.row}>
              {Object.keys(data).map((collectionName) => (
                <section key={collectionName} className={styles.section}>
                  <h2 className={styles.h2}>{collectionName}</h2>
                  <div>
                    {data[collectionName].map((item, index) => (
                      <div key={index}>{JSON.stringify(item)}</div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p>No data available</p>
          )
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </main>
  );
}
