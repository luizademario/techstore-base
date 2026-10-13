import { useEffect, useState } from 'react'
import { Navigate, Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLojista from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [modoLojista, setModoLojista] = useState(false)
  const [listaEspera, setListaEspera] = useState({})

  useEffect(() => {
    const salvoLista = localStorage.getItem('techstore-lista-espera')
    if (salvoLista) {
      try {
        setListaEspera(JSON.parse(salvoLista))
      } catch {
        setListaEspera({})
      }
    }

    const salvoModo = localStorage.getItem('techstore-modo-lojista')
    if (salvoModo === 'true') {
      setModoLojista(true)
    }

    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('techstore-lista-espera', JSON.stringify(listaEspera))
  }, [listaEspera])

  useEffect(() => {
    localStorage.setItem('techstore-modo-lojista', String(modoLojista))
  }, [modoLojista])

  function adicionarAoCarrinho(produto) {
    setCarrinho(carrinho.concat(produto))
  }

  function adicionarNaListaEspera(produtoId, dados) {
    setListaEspera((estadoAnterior) => {
      const listaAtual = estadoAnterior[produtoId] ?? []
      const jaExiste = listaAtual.some(
        (item) => item.email.toLowerCase() === dados.email.toLowerCase()
      )

      if (jaExiste) return estadoAnterior

      return {
        ...estadoAnterior,
        [produtoId]: [...listaAtual, dados],
      }
    })
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  listaEspera={listaEspera}
                  onAdicionarListaEspera={adicionarNaListaEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
            <Route
              path="/painel-lojista"
              element={
                modoLojista ? (
                  <PainelLojista produtos={produtos} listaEspera={listaEspera} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
        modoLojista={modoLojista}
        onAbrirPainelLojista={() => setModoLojista(true)}
        onFecharPainelLojista={() => setModoLojista(false)}
      />
    </div>
  )
}
