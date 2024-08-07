"use client";

import React, { useState, type FC, FormEvent, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import LoadingPopup from "../common/LoadingPopup";
import Header from "../common/Header";

import styles from "./styles.module.css";

interface Store {
  id: number;
  name: string;
  createdAt: string;
}

const Store: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);

  const onGetStores = async () => {
    setIsVisible(true);
    try {
      const response = await axios.get("/api/store/get");
      setStores(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar as lojas");
    } finally {
      setIsVisible(false);
    }
  };

  const handleAddStore = async () => {
    setIsVisible(true);
    try {
      const response = await axios.post<Store>("/api/store/save", {
        name: storeName,
      });
      setStores([...stores, response.data]);
      setStoreName("");
      toast.success("Loja cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar loja");
    } finally {
      setIsVisible(false);
    }
  };

  const handleDeleteStore = async (id: number) => {
    setIsVisible(true);
    try {
      await axios.delete(`/api/store/${id}/delete?id=${id}`);
      setStores(stores.filter((store) => store.id !== id));
      toast.success("Loja excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir loja");
    } finally {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddStore();
  };

  useEffect(() => {
    onGetStores();
  }, []);

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="storeName">Cadastrar Loja</label>
          <div>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Nome da loja"
              required
            />
            <button type="submit">Cadastrar</button>
          </div>
        </form>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Loja</th>
              <th>Criado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {stores?.length <= 0 && (
              <tr>
                <td colSpan={4}>Nenhuma loja cadastrada.</td>
              </tr>
            )}
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{new Date(store.createdAt).toLocaleString()}</td>
                <td className={styles.options}>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className={styles.danger}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Store;
