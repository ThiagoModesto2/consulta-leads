import Dashboard from "@/pages/Dashboard";

import styles from "./page.module.css";
export default function Home() {
  return (
    <>
      <main id={styles.main}>
        <Dashboard />
      </main>
    </>
  );
}
