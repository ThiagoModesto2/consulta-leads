"use client";

import React, { useState, useEffect, type FC, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import LoadingPopup from "../common/LoadingPopup";
import Header from "../common/Header";

import styles from "./styles.module.css";

interface Customer {
  id: number;
  customer_name: string;
  customer_document: string;
  customer_phone: string;
  status: string;
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[^0-9]/g, "");
};

export const CustomerSearch: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Customer | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const onSearchCustomer = async () => {
    const sanitizedSearchTerm = sanitizeInput(searchTerm);
    setIsVisible(true);
    try {
      const response = await axios.get(
        `/api/customer/search?identifier=${sanitizedSearchTerm}`
      );
      setSearchResult(response?.data || null);
    } catch (error) {
      toast.error("Erro ao buscar cliente");
    } finally {
      setIsVisible(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!searchResult) return;

    setIsVisible(true);
    const id = searchResult.id;
    try {
      await axios.put(`/api/customer/updateStatus?id=${id}`, {
        id,
        status,
      });
      setSearchResult({
        ...searchResult,
        status,
      });
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    } finally {
      setIsVisible(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    await handleUpdateStatus(status);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchCustomer();
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResult(null);
    setSelectedStatus("");
  };

  useEffect(() => {
    if (searchResult) {
      setSelectedStatus(searchResult.status);
    } else {
      setSelectedStatus("");
    }
  }, [searchResult]);

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="searchTerm">CPF ou Telefone</label>
          <input
            id="searchTerm"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o CPF ou Telefone"
            required
          />

          <div is={styles.buttons}>
            <button type="submit" id={styles.btn1}>
              Pesquisar
            </button>
            <button type="button" id={styles.btn2} onClick={handleClear}>
              Limpar
            </button>
          </div>
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Documento</th>
              <th>Telefone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {searchResult ? (
              <tr key={searchResult.id}>
                <td>{searchResult.customer_name}</td>
                <td>{searchResult.customer_document}</td>
                <td>{searchResult.customer_phone}</td>
                <td>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="approved">Aprovado</option>
                    <option value="abandoned_cart">Abandono de Carrinho</option>
                    <option value="canceled">Cancelado</option>
                    <option value="pending">Pendente</option>
                    <option value="expired">Pix Expirado</option>
                    <option value="paid">Pago</option>
                    <option value="Saldo Insuficiente">
                      Saldo Insuficiente
                    </option>
                  </select>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={4}>Nenhum cliente encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerSearch;
