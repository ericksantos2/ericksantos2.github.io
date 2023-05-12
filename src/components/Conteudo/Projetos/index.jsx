import axios from "axios";
import styles from "./Projetos.module.scss";
import { useEffect } from "react";
import { useState } from "react";

function ultimaAtualização(textoData) {
  const data = new Date(textoData);
  let texto = `${data.toLocaleDateString()}, às ${data.toLocaleTimeString()}`;
  return texto;
}

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);

  async function conectaApiGithub() {
    const { data } = await axios.get('https://api.github.com/users/ericksantos2/repos');
    let resposta = data;
    resposta = resposta.sort(
      (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
    )
    if (resposta.length > 5) {
      resposta = resposta.slice(0, 5);
    }
    setProjetos(resposta);
  }

  useEffect(() => {
    conectaApiGithub();
  }, [])

  return (
    <section className={styles.conteudo__projetos}>
      <h1 className={styles.conteudo__projetos__titulo} onClick={() => {}}>
        Últimos Projetos
      </h1>
      <div className={styles.conteudo__projetos__itens}>
        {projetos.map((projeto, index) => (
          <a
            href={projeto.has_pages === true ? (projeto.name === 'ericksantos2.github.io' ? projeto.html_url : `https://ericksantos2.github.io/${projeto.name}/`) : projeto.html_url}
            target="_blank"
            className={styles.conteudo__projetos__item}
            key={index}
          >
            <p>Nome: {projeto.name}</p>
            <p>
              Descrição:{" "}
              {projeto.description ? projeto.description : "Sem descrição"}
            </p>
            <p>
              Ultima atualização do projeto em{" "}
              {ultimaAtualização(projeto.pushed_at)}.
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
