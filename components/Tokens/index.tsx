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
  origem_loja: string;
  createdAt: string;
}

interface Token {
  id: number;
  token: string;
  phone_number: string;
  store_id: string;
  created_at: string;
}

export const Tokens: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [storeId, setStoreId] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const onGetTokens = async () => {
    setIsVisible(true);
    try {
      const response = await axios.get("/api/tokens/get");
      setTokens(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error("Falha ao carregar os tokens");
    } finally {
      setIsVisible(false);
    }
  };

  const onGetStores = async () => {
    try {
      const response = await axios.get("/api/store/get");
      setStores(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error("Falha ao carregar as lojas");
    }
  };

  const handleAddToken = async () => {
    setIsVisible(true);
    try {
      await axios.post<Token>("/api/tokens/save", {
        token,
        phone_number: phoneNumber,
        store_id: storeId,
      });
      await onGetTokens();
      setToken("");
      setPhoneNumber("");
      setStoreId(0);
      toast.success("Token cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar token");
    } finally {
      setIsVisible(false);
    }
  };

  const handleDeleteToken = async (id: number) => {
    setIsVisible(true);
    try {
      await axios.delete(`/api/tokens/${id}/delete?id=${id}`);
      setTokens(tokens.filter((token) => token.id !== id));
      toast.success("Token excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir token");
    } finally {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddToken();
  };

  useEffect(() => {
    onGetTokens();
    onGetStores();
  }, []);

  const getStoreName = (storeId: number) => {
    const store = stores.find((store) => `${store.id}` === `${storeId}`);
    return store ? store.name : "Loja não encontrada";
  };

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token">Cadastrar Token</label>
            <div>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token"
                required
              />
            </div>
            <div>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Número de Telefone"
                required
              />
            </div>
            <div>
              <select
                value={storeId}
                onChange={(e) => setStoreId(Number(e.target.value))}
                required
              >
                <option value={0} disabled>
                  Selecione a loja
                </option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <button className={styles.register} type="submit">
              Cadastrar
            </button>
          </div>
        </form>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Token</th>
              <th>Número de Telefone</th>
              <th>Loja</th>
              <th>Criado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {tokens.length <= 0 && (
              <tr>
                <td colSpan={6}>Nenhum token cadastrado.</td>
              </tr>
            )}
            {tokens.map((token) => (
              <tr key={token.id}>
                <td>{token.id}</td>
                <td>{token.token}</td>
                <td>{token.phone_number}</td>
                <td>{getStoreName(Number(token.store_id))}</td>
                <td>{new Date(token.created_at).toLocaleString()}</td>
                <td className={styles.options}>
                  <button
                    onClick={() => handleDeleteToken(token.id)}
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

export default Tokens;
