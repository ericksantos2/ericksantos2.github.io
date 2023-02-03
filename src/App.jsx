import Conteudo from "./components/Conteudo";
import Navbar from "./components/Navbar/";
import Rodape from "./components/Rodape";
import Sobremim from "./components/Sobremim";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Conteudo />
        <Sobremim />
      </main>
      <Rodape />
    </>
  );
}

export default App;
