"use client";

import { FC } from "react";
import Link from "next/link";

import styles from "./styles.module.css";

export const Header: FC = () => {
  return (
    <header id={styles.header}>
      <img src="/logo.jpg" />

      <nav id={styles.nav}>
        <ul id={styles.ul}>
          <li className={styles.li}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.li}>
            <Link href="/tokens">Tokens</Link>
          </li>
          <li className={styles.li}>
            <Link href="/loja">Lojas</Link>
          </li>
          <li className={styles.li}>
            <Link href="/produtos">Produtos</Link>
          </li>
          <li className={styles.li}>
            <Link href="/mensagens">Mensagens</Link>
          </li>
          <li className={styles.li}>
            <Link href="/importar">Importar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
