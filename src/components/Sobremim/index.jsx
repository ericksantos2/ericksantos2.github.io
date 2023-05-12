import styles from "./Sobremim.module.scss";
import * as Icones from "react-icons/si";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sobremim() {
  const [habilidades, setHabilidades] = useState([]);

  async function conectaApiHabilidades() {
    const resposta = await axios.get('https://raw.githubusercontent.com/ericksantos2/ericksantos2.github.io/master/src/components/Sobremim/habilidades.json');
    setHabilidades(resposta.data);
  }

  useEffect(() => {
    conectaApiHabilidades()
  }, [])

  return (
    <div className={styles.sobremim} id="sobremim">
      <div className={styles.sobremim__resumo}>
        <h1 className={styles.sobremim__resumo__titulo}>Sobre Mim</h1>
        <p className={styles.sobremim__resumo__texto}>
          Desde que conheci o mundo da programação em agosto de 2022, me tornei um apaixonado por programação front-end e desde então venho sempre tentando melhorar as minhas habilidades em programação em busca da minha primeira oportunidade.
        </p>
      </div>
      <div className={styles.sobremim__habilidades}>
        <h1 className={styles.sobremim__habilidades__titulo}>
          Habilidades/Conhecimentos
        </h1>
        <p className={styles.sobremim__habilidades__itens}>
          {habilidades.map((habilidade) => {
            const Icone = Icones[habilidade.icon];
            return (
              <span
                key={habilidade.id}
                className={styles.sobremim__habilidades__item}
              >
                <Icone />
                {habilidade.nome}
              </span>
            );
          })}
        </p>
      </div>
      <div className={styles.sobremim__contato}>
        <h1 className={styles.sobremim__contato__titulo}>Contato</h1>
        <p className={styles.sobremim__contato__email}>
          Email: <a href="mailto:erick.s.g.barros@gmail.com">erick.s.g.barros@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
