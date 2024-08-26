import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@components/Navbar"

export default function Home() {
  return (
    <main className={styles.home}>
          <Navbar/>
         <h1>This is a home page </h1>
         <h1>Msizi</h1>
    </main>
  );
}
