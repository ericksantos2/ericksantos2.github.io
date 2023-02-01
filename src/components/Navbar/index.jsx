import styles from "./Navbar.module.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className={styles.cabecalho}>
      <img id={styles.logo} src="img/logo.svg" alt="logo do site" />
      <div className={styles.links}>
        <a
          href="https://github.com/ericksantos2"
          target="_blank"
          className={styles.link}
        >
          <FaGithub />
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/erick-santos-16b54b252/"
          target="_blank"
          className={styles.link}
        >
          <FaLinkedin />
          LinkedIn
        </a>
      </div>
    </header>
  );
}
