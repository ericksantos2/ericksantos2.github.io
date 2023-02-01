import styles from "./Rodape.module.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <a
        href="https://github.com/ericksantos2/ericksantos2.github.io"
        target="_blank"
        className={styles.rodape__texto}
      >
        Feito e projetado por Erick Santos
      </a>
      <div className={styles.rodape__links}>
        <a
          href="https://github.com/ericksantos2"
          target="_blank"
          className={styles.rodape__link}
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/erick-santos-16b54b252/"
          target="_blank"
          className={styles.rodape__link}
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
}
