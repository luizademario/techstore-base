import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera, onAdicionarListaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagemAviso, setMensagemAviso] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        item.estoque > 0
    )
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    const nome = formulario.nome.trim()
    const email = formulario.email.trim()

    if (!nome || !email) {
      setMensagemAviso('Preencha nome e e-mail para receber o aviso.')
      return
    }

    const jaNaLista = (listaEspera[produto.id] ?? []).some(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    )

    if (jaNaLista) {
      setMensagemAviso('Você já está na lista de espera para este produto.')
      return
    }

    onAdicionarListaEspera(produto.id, { nome, email })
    setMensagemAviso('Você foi adicionado à lista de espera. Te avisaremos quando o produto voltar!')
    setFormulario({ nome: '', email: '' })
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>

          {produto.estoque === 0 ? (
            <div className="aviso-produto-esgotado">
              <p className="detalhe-estoque detalhe-estoque-esgotado">Produto esgotado</p>
              <p className="detalhe-descricao">
                Este item está fora de estoque no momento. Deixe seu e-mail e nome abaixo e
                avisaremos quando ele voltar.
              </p>

              <form className="form-aviso" onSubmit={enviarAviso}>
                <label>
                  Nome
                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(evento) =>
                      setFormulario((estado) => ({ ...estado, nome: evento.target.value }))
                    }
                    placeholder="Seu nome"
                  />
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    value={formulario.email}
                    onChange={(evento) =>
                      setFormulario((estado) => ({ ...estado, email: evento.target.value }))
                    }
                    placeholder="seu@email.com"
                  />
                </label>

                <button type="submit" className="botao botao-grande">
                  Avisar quando voltar
                </button>
              </form>

              {mensagemAviso && <p className="mensagem-cupom">{mensagemAviso}</p>}
            </div>
          ) : (
            <>
              <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

              <button
                className="botao botao-grande"
                onClick={() => onAdicionar(produto)}
                disabled={produto.estoque === 0}
              >
                Adicionar ao carrinho
              </button>
            </>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.length > 0 ? (
          relacionados.map((item) => (
            <article key={item.id} className="card">
              <Link to={`/produto/${item.id}`} className="card-link">
                <div className="card-imagem-moldura">
                  <img src={item.image} alt={item.title} className="card-imagem" />
                </div>
                <h3 className="card-titulo">{item.title}</h3>
              </Link>
              <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
              <button className="botao" onClick={() => onAdicionar(item)}>
                Adicionar ao carrinho
              </button>
            </article>
          ))
        ) : (
          <p className="aviso">Não há produtos relacionados disponíveis no momento.</p>
        )}
      </div>
    </section>
  )
}
