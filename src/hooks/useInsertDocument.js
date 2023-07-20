import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
/*
No geral, o addDoc é usado para adicionar um novo documento a uma coleção 
específica, enquanto o collection é usado para criar uma referência a uma 
coleção no Firestore, para que você possa realizar operações nela, como 
adicionar, atualizar ou excluir documentos.
*/

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
    //response: valor final
    //dispatch: o que será entregue a função insertReducer
    //initialState: valor inicial
  const [response, dispatch] = useReducer(insertReducer, initialState);

  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };
      const insertedDocument = await addDoc( //1º Arg = referência a coleção; 2º Arg = um objeto contendo os dados do documento 
        collection(db, docCollection), //db = representa a instância do Firestore; docCollection = string que especifica o nome da coleção 
        newDocument
      );

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument, //"payload" se refere à parte de uma mensagem ou requisição que contém os dados relevantes,
      });
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return {insertDocument, response}
};


