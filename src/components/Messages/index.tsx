"use client";

import React, { useState, useRef, useEffect, type FC, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import LoadingPopup from "../common/LoadingPopup";
import Header from "../common/Header";

import styles from "./styles.module.css";

interface Message {
  id: number;
  message: string;
  orderMessage: number;
  delay: number | null; // Adicionei o campo delay aqui
  status: string;
  store_id: number | null;
  origem_loja?: string | null;
  product_id?: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: number;
  name: string;
}

interface Product {
  id: number;
  product_name: string;
  store_id: number;
}

const Messages: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>("");
  const [orderMessage, setOrderMessage] = useState<string>("");
  const [delay, setDelay] = useState<string>(""); // Adicionei o estado delay
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [numberTest, setNumberTest] = useState<string>("");
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [productsAll, setProductsAll] = useState<Product[]>([]);

  const onGetAllStores = async () => {
    try {
      const response = await axios.get("/api/store/get");
      setAllStores(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar todas as lojas");
    } finally {
      setIsVisible(false);
    }
  };

  const onGetAllMessages = async () => {
    try {
      const response = await axios.get("/api/messages/get");
      const sortedMessages = (response?.data || []).sort(
        (a: Message, b: Message) => {
          if (a.orderMessage === b.orderMessage) {
            return a.status.localeCompare(b.status);
          }
          return a.orderMessage - b.orderMessage;
        }
      );
      setMessages(sortedMessages);
    } catch (error) {
      toast.error("Falha ao carregar as mensagens");
    } finally {
      setIsVisible(false);
    }
  };

  const onGetProducts = async () => {
    setIsVisible(true);
    try {
      const response = await axios.get("/api/products/get");
      setProductsAll(response?.data || []);
    } finally {
      setIsVisible(false);
    }
  };

  const onGetProductsByStore = async (storeId: string) => {
    try {
      const response = await axios.get(`/api/products/get?store_id=${storeId}`);
      setProducts(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar os produtos da loja selecionada");
    }
  };

  const translateNewlines = (text: string) => {
    return text.replace(/\n/g, "\\n");
  };

  const translatedMessage = translateNewlines(storeName)
    .replace(/{{nome}}/g, "{{name}}")
    .replace(/{{telefone}}/g, "{{phone}}")
    .replace(/{{email}}/g, "{{email}}")
    .replace(/{{documento}}/g, "{{document}}")
    .replace(/{{pix}}/g, "{{pix}}")
    .replace(/{{pagina}}/g, "{{billet_url}}")
    .replace(/{{ms}}/g, "{{ms}}");

  const handleAddMessage = async () => {
    if (!orderMessage || !storeName || !selectedStatus) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsVisible(true);
    try {
      const data: any = {
        message: translatedMessage,
        orderMessage: parseInt(orderMessage),
        delay: delay ? parseInt(delay) : null,
        status: selectedStatus,
        store_id: selectedStoreId,
        origem_loja: null,
        product_id: selectedProductId ? parseInt(selectedProductId) : null,
      };

      if (
        selectedStoreId?.toLowerCase() === "kirvano" ||
        selectedStoreId?.toLowerCase() === "perfect-pay"
      ) {
        data.store_id = null;
        data.origem_loja = selectedStoreId;
      }

      const response = await axios.post<Message>("/api/messages/save", data);
      const newMessages = [...messages, response.data];
      const sortedMessages = newMessages.sort((a, b) => {
        if (a.orderMessage === b.orderMessage) {
          return a.status.localeCompare(b.status);
        }
        return a.orderMessage - b.orderMessage;
      });
      setMessages(sortedMessages);
      setStoreName("");
      setOrderMessage("");
      setDelay("");
      setSelectedStatus(null);
      setSelectedStoreId(null);
      setNumberTest("");
      setSelectedProductId(null);
      toast.success("Mensagem cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar mensagem");
    } finally {
      setIsVisible(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    setIsVisible(true);
    try {
      await axios.delete(`/api/messages/delete?id=${id}`);
      const newMessages = messages.filter((message) => message.id !== id);
      setMessages(newMessages);
      toast.success("Mensagem excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir mensagem");
    } finally {
      setIsVisible(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddMessage();
  };

  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText =
        textarea.value.substring(0, start) +
        text +
        textarea.value.substring(end);
      setStoreName(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    }
  };

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      approved: "Aprovado",
      abandoned_cart: "Abandono de Carrinho",
      canceled: "Cancelado",
      pending: "Pendente",
      expired: "Pix Expirado",
      paid: "Pago",
    };
    return translations[status] || status;
  };

  const sendMessageTest = async () => {
    toast.warn("Enviando mensagem...");

    const data = {
      customer_phone: numberTest,
      body: translatedMessage,
    };

    try {
      await axios.post(`/api/messages/send`, data);
      toast.success("Mensagem de teste enviada com sucesso");
    } catch (e) {
      toast.error("Erro ao enviar teste de mensagem");
      console.error(e);
    }
  };

  useEffect(() => {
    onGetAllStores();
    onGetAllMessages();
    onGetProducts();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      onGetProductsByStore(selectedStoreId);
    } else {
      setProducts([]);
    }
  }, [selectedStoreId]);

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="numberTest">
            Número para realizar o teste de envio
          </label>
          <input
            id="numberTest"
            type="number"
            value={numberTest}
            onChange={(e) => setNumberTest(e.target.value)}
            placeholder="Digite um número para realizar teste"
          />

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="orderMessage">Ordem</label>
              <input
                id="orderMessage"
                type="number"
                value={orderMessage}
                onChange={(e) => setOrderMessage(e.target.value)}
                placeholder="Ordem da Mensagem"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="delay">Delay (segundos)</label>
              <input
                id="delay"
                type="number"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                placeholder="Delay"
              />
            </div>
          </div>

          <textarea
            id="storeName"
            ref={textareaRef}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Mensagem"
            required
          />

          <div className={styles.tagContainer}>
            <button
              type="button"
              onClick={() => insertAtCursor("{{nome}}")}
              className={styles.tag}
            >
              nome
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{telefone}}")}
              className={styles.tag}
            >
              telefone
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{email}}")}
              className={styles.tag}
            >
              e-mail
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{documento}}")}
              className={styles.tag}
            >
              documento
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{pix}}")}
              className={styles.tag}
            >
              pix
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{ms}}")}
              className={styles.tag}
            >
              saudação
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("{{pagina}}")}
              className={styles.tag}
            >
              página pix
            </button>
          </div>

          <div className={styles.selectContainer}>
            <div className={styles.selectItem}>
              <label htmlFor="statusSelect">Status</label>
              <select
                id="statusSelect"
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione um status
                </option>
                <option value="approved">Aprovado</option>
                <option value="abandoned_cart">Abandono de Carrinho</option>
                <option value="canceled">Cancelado</option>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
                <option value="expired">Pix expirado</option>
                <option value="Saldo insuficiente">Saldo insuficiente</option>
              </select>
            </div>

            <div className={styles.selectItem}>
              <label htmlFor="storeSelect">Loja</label>
              <select
                id="storeSelect"
                value={selectedStoreId || ""}
                onChange={(e) => setSelectedStoreId(e.target.value)}
              >
                <option value="" disabled>
                  Selecione uma loja
                </option>
                {allStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedStoreId && (
              <div className={styles.selectItem}>
                <label htmlFor="productSelect">Produto</label>
                <select
                  id="productSelect"
                  value={selectedProductId || ""}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um produto
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" id={styles.btn1}>
              Cadastrar
            </button>
            <button
              type="button"
              id={styles.btn2}
              onClick={() => sendMessageTest()}
            >
              Testar
            </button>
          </div>
        </form>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mensagem</th>
              <th>Ordem</th>
              <th>Delay</th> {/* Adicionei a coluna Delay na tabela */}
              <th>Status</th>
              <th>Loja/Origem</th>
              <th>Produto</th>
              <th>Criado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {messages?.length <= 0 && (
              <tr>
                <td colSpan={9}>Nenhuma mensagem cadastrada.</td>
              </tr>
            )}
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.message}</td>
                <td>{message.orderMessage}</td>
                <td>{message.delay ?? "#"}</td> {/* Mostra o delay ou # */}
                <td>{translateStatus(message.status)}</td>
                <td>
                  {message.origem_loja ||
                    allStores.find((store) => store.id === message.store_id)
                      ?.name}
                </td>
                <td>
                  {message.product_id
                    ? productsAll.find(
                        (product) => product.id === message.product_id
                      )?.product_name || "#"
                    : "#"}
                </td>
                <td>{new Date(message.createdAt).toLocaleString()}</td>
                <td className={styles.options}>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
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

export default Messages;
