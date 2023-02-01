import styles from "./Conteudo.module.scss";
import Projetos from "./Projetos";

export default function Conteudo() {
  return (
    <>
      <section id="conteudo" className={styles.conteudo}>
        <div className={styles.conteudo__perfil}>
          <img
            src="/img/perfil-linkedin.jpg"
            alt="foto de mim"
            className={styles.conteudo__perfil__foto}
          />
          <div className={styles.conteudo__perfil__textos}>
            <p className={styles.conteudo__perfil__nome}>Erick Santos</p>
            <p>Carapicuíba - São Paulo, Brasil</p>
          </div>
        </div>
        <Projetos />
      </section>
    </>
  );
}
