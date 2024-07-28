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
  status: string;
  store_id: number | null;
  origem_loja?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: number;
  name: string;
}

const Messages: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>("");
  const [orderMessage, setOrderMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [numberTest, setNumberTest] = useState<string>("");
  const [allStores, setAllStores] = useState<Store[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setMessages(response?.data || []);
    } catch (error) {
      toast.error("Falha ao carregar as mensagens");
    } finally {
      setIsVisible(false);
    }
  };

  const handleAddMessage = async () => {
    if (!orderMessage || !storeName || !selectedStatus) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const translatedMessage = storeName
      .replace(/{{nome}}/g, "{{name}}")
      .replace(/{{telefone}}/g, "{{phone}}")
      .replace(/{{email}}/g, "{{email}}")
      .replace(/{{documento}}/g, "{{document}}")
      .replace(/{{pix}}/g, "{{pix}}")
      .replace(/{{ms}}/g, "{{ms}}");

    setIsVisible(true);
    try {
      const data: any = {
        message: translatedMessage,
        orderMessage: parseInt(orderMessage),
        status: selectedStatus,
        store_id: selectedStoreId,
        origem_loja: null,
      };

      if (
        selectedStoreId?.toLowerCase() === "kirvano" ||
        selectedStoreId?.toLowerCase() === "perfect-pay"
      ) {
        data.store_id = null;
        data.origem_loja = selectedStoreId;
      }

      const response = await axios.post<Message>("/api/messages/save", data);
      setMessages([...messages, response.data]);
      setStoreName("");
      setOrderMessage("");
      setSelectedStatus(null);
      setSelectedStoreId(null);
      setNumberTest("");
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
      setMessages(messages.filter((message) => message.id !== id));
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
    };
    return translations[status] || status;
  };

  const sendMessageTest = async () => {
    toast.warn("Enviando mensagem...");

    const data = {
      customer_phone: numberTest,
      body: storeName,
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
  }, []);

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
            required
          />

          <label htmlFor="orderMessage">Ordem</label>
          <input
            id="orderMessage"
            type="number"
            value={orderMessage}
            onChange={(e) => setOrderMessage(e.target.value)}
            placeholder="Ordem da Mensagem"
            required
          />

          <textarea
            id="storeName"
            ref={textareaRef}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Mensagem"
            required
          />

          <div>
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
          </div>

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
            <option value="pending">Pendente</option>
          </select>

          <label htmlFor="storeSelect">
            Selecionar Loja <small>(Opcional)</small>
          </label>
          <select
            id="storeSelect"
            value={selectedStoreId || ""}
            onChange={(e) => setSelectedStoreId(e.target.value)}
          >
            <option value="" disabled>
              Selecione uma loja
            </option>
            <option value="perfect-pay">Perfect Pay</option>
            <option value="kirvano">Kirvano</option>
            {allStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          <div>
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
              <th>Status</th>
              <th>Loja/Origem</th>
              <th>Criado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {messages?.length <= 0 && (
              <tr>
                <td colSpan={7}>Nenhuma mensagem cadastrada.</td>
              </tr>
            )}
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.message}</td>
                <td>{message.orderMessage}</td>
                <td>{translateStatus(message.status)}</td>
                <td>
                  {message.origem_loja ||
                    allStores.find((store) => store.id === message.store_id)
                      ?.name}
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
