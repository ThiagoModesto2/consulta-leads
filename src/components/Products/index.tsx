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

interface Product {
  id: number;
  product_name: string;
  store_id: number;
  created_at: string;
}

export const Products: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [productName, setProductName] = useState<string>("");
  const [storeId, setStoreId] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const onGetProducts = async () => {
    setIsVisible(true);
    try {
      const response = await axios.get("/api/products/get");
      setProducts(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar os produtos");
    } finally {
      setIsVisible(false);
    }
  };

  const onGetStores = async () => {
    try {
      const response = await axios.get("/api/store/get");
      setStores(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar as lojas");
    }
  };

  const handleAddProduct = async () => {
    setIsVisible(true);
    try {
      const response = await axios.post<Product>("/api/products/save", {
        product_name: productName,
        store_id: storeId,
      });
      await onGetProducts();
      setProductName("");
      setStoreId(0);
      toast.success("Produto cadastrado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
    } finally {
      setIsVisible(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setIsVisible(true);
    try {
      await axios.delete(`/api/products/${id}/delete?id=${id}`);
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
    } finally {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddProduct();
  };

  useEffect(() => {
    onGetProducts();
    onGetStores();
  }, []);

  const getStoreName = (storeId: number) => {
    const store = stores.find((store) => store.id === storeId);
    return store ? store.name : "Loja não encontrada";
  };

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productName">Cadastrar Produto</label>
            <div>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nome do produto"
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
              <th>Produto</th>
              <th>Loja</th>
              <th>Criado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {products?.length <= 0 && (
              <tr>
                <td colSpan={5}>Nenhum produto cadastrado.</td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{getStoreName(product.store_id)}</td>
                <td>{new Date(product.created_at).toLocaleString()}</td>
                <td className={styles.options}>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
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

export default Products;
