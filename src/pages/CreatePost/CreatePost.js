import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");

  const {insertDocument, response} = useInsertDocument("posts")

  const navigate = useNavigate()

  const {user} = useAuthValue()

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("")

    try {
      new URL(image)
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.")
    } 

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    if(!title || !body || !tags || !body) {
      setFormError("Por favor, insira todos os campos!")
    }

    //serve como uma barreira condicional, caso seja true o if será executado, mas nenhuma linha abaixo será lida.
    if(formError) {
      return
    }

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    })

    navigate("/")
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            id=""
            required
            placeholder="Pense um título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>URL da imagem:</span>
          <input
            type="text"
            name="imagem"
            id=""
            required
            placeholder="Insira uma image que reprensenta o seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            id=""
            required
            placeholder="Insira as tags separadas por vírgulas"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {!response.loading && <button className="btn">Cadastrar</button>}
        {response.loading && <button className="btn" disabled>Aguarde...</button>}
        {response.error && <p className="error">{response.error}</p>}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
