import React from "react";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Trading Hall Tracker &copy; {new Date().getFullYear()}</p>
      <p style={{ marginTop: "0.5rem" }}>Hecho con cubos y Next.js</p>
    </footer>
  );
};
