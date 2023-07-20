import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { useState, useEffect } from "react";
import { useAuthentication } from "./hooks/useAuthentication";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home/Home.js";
import About from "./pages/About/About.js";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreatePost from "./pages/CreatePost/CreatePost";
import Dashboard from "./pages/Dashboard/Dashboard";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  /*
  onAuthStateChanged: Essa função é usada para ouvir as alterações no estado de 
  autenticação do usuário.
  */
  useEffect(() => {
    onAuthStateChanged(auth, (_user) => {
      setUser(_user);
      // veja o que tem é armazenado no setUser para ser passado ao user:
      console.log("Este é o user: " + JSON.stringify(_user));
    });
  }, [auth]); //será invocado sempre que ocorrer mudança no estado

  /*
  Se o user for undefined (não definido ainda).
  Isso garante que o estado do usuário será carregado antes do usuario
  navegar na página
  */
  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        {" "}
        {/*Isso garante o acesso ao "user" aos children*/}
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search/>} />
              <Route path="/posts/:id" element={<Post/>}/>
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
              />
              <Route
                path="/post/create"
                element={user ? <CreatePost /> : <Navigate to="/" />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
