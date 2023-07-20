import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection, //ela retorna uma referência à coleção especificada. 1º parâmetro: refêrencia ao banco de dados; 2º: nome da coleção
  query, //filtrar os documentos. Ela recebe a referência à coleção e as opções de consulta para retornar uma consulta configurada de acordo com os parâmetros fornecidos
  orderBy, //especifica a ordenação dos documentos em uma consulta. Ela recebe dois parâmetros: o campo pelo qual deseja ordenar (O "createAt" refere-se a um campo em um documento do Firebase Firestore que representa a data e hora de criação desse documento.) e a direção da ordenação
  onSnapshot,
  where, //Ela registra o callback para ser executado sempre que houver uma alteração nos documentos retornados pela consulta. 1º Param: A consulta a ser ouvida; 2º Um retorno de chamada a ser chamado toda vez que um novo QuerySnapshot estiver disponível.
} from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  /*
Em resumo, o primeiro useEffect é executado na primeira renderização da página, 
enquanto o segundo useEffect é executado logo após a primeira renderização para 
definir cancelled como true e evitar a execução futura do código de busca de dados.
*/
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) {
        return;
      }

      setLoading(true);

      const collectionRef = await collection(db, docCollection);

      try {
        let q;

        if (search) {
          q = await query(
            collectionRef,
            where(
              "tagsArray",
              "array-contains",
              search,
              orderBy("createdAt", "desc")
            )
          );
        } else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid, orderBy("createdAt", "desc"))
          );
        } else {
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);

        setLoading(false);
      }
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};

