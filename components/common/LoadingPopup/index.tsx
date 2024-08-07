"use client";

import React, { type FC } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import styles from "./styles.module.css";

interface LoadingPopupProps {
  isVisible: boolean;
}

export const LoadingPopup: FC<LoadingPopupProps> = ({ isVisible }) => {
  return (
    <>
      {isVisible && (
        <div className={styles.overlay}>
          <div className={styles.popupContainer}>
            <Player
              src="https://cdn.lordicon.com/avytqtql.json"
              loop
              autoplay
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
              }}
              style={{
                width: "125px",
                height: "125px",
                display: "flex",
                margin: "0 auto",
              }}
            />
            <span className={styles.popupText}>Carregando...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingPopup;
