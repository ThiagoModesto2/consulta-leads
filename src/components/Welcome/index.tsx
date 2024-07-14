"use client";

import React, { useState, useRef, type FC } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Button from "../common/Button";
import LoadingPopup from "../common/LoadingPopup";
import Header from "../common/Header";

import { token } from "@/config/links";

import styles from "./styles.module.css";

const Welcome: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension !== "csv") {
        toast.error("Por favor, selecione um arquivo CSV.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInit = async () => {
    if (!file) {
      toast.error("Por favor, selecione um arquivo CSV.");
      return;
    }

    setIsVisible(true);

    const formData = new FormData();
    formData.append("csv_file", file);
    formData.append("token", token);

    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cadastrado com sucesso!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo CSV:", error);
      toast.error("Erro ao enviar o arquivo CSV.");
    } finally {
      setIsVisible(false);
    }
  };

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div id={styles.center}>
        <p className={styles.text}>Olá Rato!</p>
        <br />
        <p style={{ textAlign: "center" }}>
          Para começar, faça o upload do arquivo CSV e clique em cadastrar:
        </p>
        <br />
        <br />
        <div id={styles.fileInputWrapper}>
          <input
            type="file"
            accept=".csv"
            id="fileInput"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={styles.fileButton}
            onClick={handleButtonClick}
          >
            Escolher Arquivo
          </button>
          {file && <span className={styles.fileName}>{file.name}</span>}
        </div>
        <br />
        <div id={styles.buttonWrapper}>
          <Button handleSubmit={handleInit} title="Cadastrar leads" />
        </div>
      </div>
    </>
  );
};

export default Welcome;
