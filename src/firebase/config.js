import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/*
O objeto firebaseConfig contém as chaves necessárias para autenticar o
aplicativo Firebase e fornecer informações sobre o projeto
*/
const firebaseConfig = {
  apiKey: "AIzaSyBwjOoummsb70JzxO5SlwMl2sV7a4GU6uM",
  authDomain: "miniblog-b73d3.firebaseapp.com",
  projectId: "miniblog-b73d3",
  storageBucket: "miniblog-b73d3.appspot.com",
  messagingSenderId: "1045308988673",
  appId: "1:1045308988673:web:ac8c1bc2858962c5fbcf00",
};

/*
Isso é necessário para que o Firebase saiba qual projeto usar e quais 
serviços habilitar para o aplicativo.
*/
const app = initializeApp(firebaseConfig);

/*
Essa chamada inicializa o Firestore e retorna uma referência para 
o banco de dados do Firestore.
*/
const db = getFirestore(app);

/*
A instância do Firestore.
Pode ser usado em outras partes do aplicativo para interagir com o 
Firestore e armazenar/recuperar dados em tempo real.
*/
export { db };
