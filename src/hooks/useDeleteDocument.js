import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
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

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection) => {
  //response: valor final
  //dispatch: o que será entregue a função insertReducer
  //initialState: valor inicial
  const [response, dispatch] = useReducer(deleteReducer, initialState); 

  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) { 
      dispatch(action);
    }
  };

  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch({ //vai disparar a
      type: "LOADING",
    });

    try {
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      checkCancelBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { deleteDocument, response };
};
