"use client";

import { FC } from "react";

import styles from "./styles.module.css";

export const Header: FC = () => {
  return (
    <header id={styles.header}>
      <img src="/logo.jpg" />
    </header>
  );
};

export default Header;
