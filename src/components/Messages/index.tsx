"use client";

import React, { useState, useRef, useEffect, type FC } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

import LoadingPopup from "../common/LoadingPopup";
import Header from "../common/Header";

import styles from "./styles.module.css";

interface Message {
  id: number;
  message: string;
  orderMessage: number;
  delay: number | null;
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
  const [delay, setDelay] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [numberTest, setNumberTest] = useState<string>("");
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [productsAll, setProductsAll] = useState<Product[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Multiselect state
  const [selectedStores, setSelectedStores] = useState<any>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<any>([]);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
          // Ordenar por Ordem -> Status -> Loja -> Produto
          if (a.orderMessage !== b.orderMessage) {
            return a.orderMessage - b.orderMessage;
          }
          if (a.status !== b.status) {
            return a.status.localeCompare(b.status);
          }
          const storeA =
            a.origem_loja ||
            allStores.find((store) => store.id === a.store_id)?.name ||
            "";
          const storeB =
            b.origem_loja ||
            allStores.find((store) => store.id === b.store_id)?.name ||
            "";
          if (storeA !== storeB) {
            return storeA.localeCompare(storeB);
          }
          const productA =
            productsAll.find((product) => product.id === a.product_id)
              ?.product_name || "";
          const productB =
            productsAll.find((product) => product.id === b.product_id)
              ?.product_name || "";
          return productA.localeCompare(productB);
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

  useEffect(() => {
    if (selectedStores.length) {
      // Combinar produtos de todas as lojas selecionadas
      const selectedStoreIds = selectedStores.map((store: any) => store.value);
      const filteredProducts = productsAll.filter((product) =>
        selectedStoreIds.includes(product.store_id.toString())
      );
      setProducts(filteredProducts);
    } else {
      setProducts([]);
    }
  }, [selectedStores, productsAll]);

  const handleAddMessage = async (e: any) => {
    e.preventDefault();

    if (!orderMessage || !storeName || selectedStatuses.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsVisible(true);

    try {
      const translatedMessage = storeName
        .replace(/{{nome}}/g, "{{name}}")
        .replace(/{{telefone}}/g, "{{phone}}")
        .replace(/{{email}}/g, "{{email}}")
        .replace(/{{documento}}/g, "{{document}}")
        .replace(/{{pix}}/g, "{{pix}}")
        .replace(/{{pagina}}/g, "{{billet_url}}")
        .replace(/{{ms}}/g, "{{ms}}")
        .replace(/{{checkout}}/g, "{{checkout_url}}");

      const requests = selectedStores.flatMap((store: any) => {
        const availableProducts = productsAll.filter(
          (product) => product.store_id === store.value
        );

        return selectedProducts
          .filter((product: any) =>
            availableProducts.some(
              (availableProduct) =>
                parseInt(`${availableProduct.id}`) === parseInt(product.value)
            )
          )
          .map((product: any) => {
            const data: any = {
              message: translatedMessage,
              orderMessage: parseInt(orderMessage) ?? 1,
              delay: delay ? parseInt(delay) : null,
              status: selectedStatuses
                .map((status: any) => status.value)
                .join(","),
              store_id: store.value,
              origem_loja: null,
              product_id: product.value,
            };

            if (
              store.value.toLowerCase() === "kirvano" ||
              store.value.toLowerCase() === "perfect-pay"
            ) {
              data.store_id = null;
              data.origem_loja = store.value;
            }
            return axios.post<Message>("/api/messages/save", data);
          });
      });

      const responses = await Promise.all(requests);

      const newMessages = [...messages, ...responses.map((res) => res.data)];
      const sortedMessages = newMessages.sort((a, b) => {
        if (a.orderMessage !== b.orderMessage) {
          return a.orderMessage - b.orderMessage;
        }
        if (a.status !== b.status) {
          return a.status.localeCompare(b.status);
        }
        const storeA =
          a.origem_loja ||
          allStores.find((store) => store.id === a.store_id)?.name ||
          "";
        const storeB =
          b.origem_loja ||
          allStores.find((store) => store.id === b.store_id)?.name ||
          "";
        if (storeA !== storeB) {
          return storeA.localeCompare(storeB);
        }
        const productA =
          productsAll.find((product) => product.id === a.product_id)
            ?.product_name || "";
        const productB =
          productsAll.find((product) => product.id === b.product_id)
            ?.product_name || "";
        return productA.localeCompare(productB);
      });

      setMessages(sortedMessages);
      setNumberTest("");
      toast.success("Mensagens cadastradas com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar mensagens");
    } finally {
      setIsVisible(false);
    }

    return;
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

    const translatedMessage = storeName
      .replace(/{{nome}}/g, "{{name}}")
      .replace(/{{telefone}}/g, "{{phone}}")
      .replace(/{{email}}/g, "{{email}}")
      .replace(/{{documento}}/g, "{{document}}")
      .replace(/{{pix}}/g, "{{pix}}")
      .replace(/{{pagina}}/g, "{{billet_url}}")
      .replace(/{{ms}}/g, "{{ms}}")
      .replace(/{{checkout}}/g, "{{checkout_url}}");

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

  const handleClearAll = () => {
    setStoreName("");
    setOrderMessage("");
    setDelay("");
    setSelectedStatuses([]);
    setSelectedStores([]);
    setNumberTest("");
    setSelectedProducts([]);
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  useEffect(() => {
    onGetAllStores();
    onGetAllMessages();
    onGetProducts();
  }, []);

  const filteredMessages = messages.filter((message) => {
    const storeMatch =
      selectedStores.length === 0 ||
      selectedStores.some(
        (store: any) =>
          message.store_id?.toString() === store.value ||
          message.origem_loja?.toLowerCase() === store.value.toLowerCase()
      );
    const statusMatch =
      selectedStatuses.length === 0 ||
      selectedStatuses.some((status: any) => message.status === status.value);
    const productMatch =
      selectedProducts.length === 0 ||
      selectedProducts.some(
        (product: any) => message.product_id?.toString() === product.value
      );

    return storeMatch && statusMatch && productMatch;
  });

  const findProductName = (message: Message) => {
    const storeProducts = productsAll.filter(
      (product) => product.store_id === message.store_id
    );
    const product = storeProducts.find(
      (product) => product.id === message.product_id
    );
    return product ? product.product_name : "#";
  };

  // Opções para o react-select
  const storeOptions = allStores.map((store) => ({
    value: store.id.toString(),
    label: store.name,
  }));

  const statusOptions = [
    { value: "approved", label: "Aprovado" },
    { value: "abandoned_cart", label: "Abandono de Carrinho" },
    { value: "canceled", label: "Cancelado" },
    { value: "paid", label: "Pago" },
    { value: "pending", label: "Pendente" },
    { value: "expired", label: "Pix expirado" },
    { value: "Saldo insuficiente", label: "Saldo insuficiente" },
  ];

  const productOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.product_name,
  }));

  return (
    <>
      <LoadingPopup isVisible={isVisible} />
      <Header />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleAddMessage}>
          <div className={styles.selectContainer}>
            <div className={styles.selectItem}>
              <label htmlFor="storeSelect">Loja</label>
              <Select
                id="storeSelect"
                options={storeOptions}
                value={selectedStores}
                onChange={(selected) => setSelectedStores(selected || [])}
                isMulti
                placeholder="Selecione uma loja"
              />
            </div>

            {selectedStores.length > 0 && (
              <div className={styles.selectItem}>
                <label htmlFor="productSelect">Produto</label>
                <Select
                  id="productSelect"
                  options={productOptions}
                  value={selectedProducts}
                  onChange={(selected) => setSelectedProducts(selected || [])}
                  isMulti
                  placeholder="Selecione um produto"
                />
              </div>
            )}
          </div>
          <div className={styles.selectItem}>
            <label htmlFor="statusSelect">Status</label>
            <Select
              id="statusSelect"
              options={statusOptions}
              value={selectedStatuses}
              onChange={(selected) => setSelectedStatuses(selected || [])}
              isMulti
              placeholder="Selecione um status"
            />
          </div>

          {selectedStores.length > 0 &&
            selectedProducts.length > 0 &&
            selectedStatuses.length > 0 && (
              <>
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
                  <button
                    type="button"
                    onClick={() => insertAtCursor("{{checkout}}")}
                    className={styles.tag}
                  >
                    página checkout
                  </button>
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
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={handleClearAll}
                  >
                    Limpar Tudo
                  </button>
                </div>
              </>
            )}
        </form>
        {selectedStores.length > 0 &&
          selectedProducts.length > 0 &&
          selectedStatuses.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mensagem</th>
                  <th>Ordem</th>
                  <th>Delay</th>
                  <th>Status</th>
                  <th>Loja/Origem</th>
                  <th>Produto</th>
                  <th>Criado</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages?.length <= 0 && (
                  <tr>
                    <td colSpan={9}>Nenhuma mensagem cadastrada.</td>
                  </tr>
                )}
                {filteredMessages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.id}</td>
                    <td>{message.message}</td>
                    <td>{message.orderMessage}</td>
                    <td>{message.delay ?? "#"}</td>
                    <td>{translateStatus(message.status)}</td>
                    <td>
                      {message.origem_loja
                        ? allStores.find(
                            (store) =>
                              store.name.toLowerCase() ===
                              message.origem_loja?.toLowerCase()
                          )?.name || message.origem_loja
                        : allStores.find(
                            (store) =>
                              parseInt(`${store.id}`) ===
                              parseInt(`${message.store_id}`)
                          )?.name || "#"}
                    </td>
                    <td>{findProductName(message)}</td>
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
          )}
      </div>
    </>
  );
};

export default Messages;
