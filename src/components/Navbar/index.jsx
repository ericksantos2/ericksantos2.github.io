import styles from "./Navbar.module.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className={styles.cabecalho}>
      <a href="#">
        <img id={styles.logo} src="img/logo.svg" alt="logo do site" />
      </a>
      <div className={styles.links}>
        {/* <a href="#" className={styles["links__item--hover"]}>
          Início
        </a>
        <a href="#sobremim" className={styles["links__item--hover"]}>
          Sobre Mim
        </a> */}
        <a href="https://github.com/ericksantos2" target="_blank">
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/erick-santos-16b54b252/"
          target="_blank"
        >
          <FaLinkedin />
        </a>
      </div>
    </header>
  );
}
