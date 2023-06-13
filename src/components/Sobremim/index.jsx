import styles from "./Sobremim.module.scss";
import * as Icones from "react-icons/si";
import React, { useEffect, useState } from "react";
import axios from "axios";

const sobreMimInitialState = {
  textoSobremim: '',
  emailContato: ''
}

export default function Sobremim() {
  const [habilidades, setHabilidades] = useState([]);
  const [sobreMim, setSobreMim] = useState(sobreMimInitialState);

  async function conectaApiHabilidades() {
    const { data: resposta } = await axios.get('https://raw.githubusercontent.com/ericksantos2/ericksantos2.github.io/master/src/components/Sobremim/habilidades.json');
    setHabilidades(resposta);
  }

  async function conectaApiSobreMim() {
    const { data: resposta } = await axios.get('https://raw.githubusercontent.com/ericksantos2/ericksantos2.github.io/master/src/components/Sobremim/sobremim.json');
    setSobreMim(resposta);
  }

  useEffect(() => {
    conectaApiHabilidades()
    conectaApiSobreMim()
  }, [])

  return (
    <div className={styles.sobremim} id="sobremim">
      <div className={styles.sobremim__resumo}>
        <h1 className={styles.sobremim__resumo__titulo}>Sobre Mim</h1>
        <p className={styles.sobremim__resumo__texto}>
          {sobreMim.textoSobremim}
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
          Email: <a href={`mailto:${sobreMim.emailContato}`}>{sobreMim.emailContato}</a>
        </p>
      </div>
    </div>
  );
}
