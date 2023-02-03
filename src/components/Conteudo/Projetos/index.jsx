import styles from "./Projetos.module.scss";

async function conectaApiGithub() {
  const conexao = await fetch(
    "https://api.github.com/users/ericksantos2/repos"
  );
  return conexao.json();
}

let projetos = await conectaApiGithub();
projetos = projetos.sort(
  (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
);
if (projetos.length > 5) {
  projetos = projetos.slice(0, 5);
}

function ultimaAtualização(textoData) {
  const data = new Date(textoData);
  let texto = `${data.toLocaleDateString()}, às ${data.toLocaleTimeString()}`;
  return texto;
}

export default function Projetos() {
  return (
    <section className={styles.conteudo__projetos}>
      <h1 className={styles.conteudo__projetos__titulo} onClick={() => {}}>
        Últimos Projetos
      </h1>
      <div className={styles.conteudo__projetos__itens}>
        {projetos.map((projeto, index) => (
          <a
            href={projeto.html_url}
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
