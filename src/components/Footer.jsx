import { Link } from 'react-router'

export default function Footer({
  clientes,
  clienteAtualId,
  onTrocarCliente,
  modoLojista,
  onAbrirPainelLojista,
  onFecharPainelLojista,
}) {
  return (
    <footer className="footer">
      <div className="footer-conteudo">
        <div className="footer-marca">
          <p className="logo logo-pequeno">
            tech<span>store</span>
          </p>
          <p>Tecnologia, moda e casa com entrega para todo o Brasil.</p>
        </div>

        <div className="footer-coluna">
          <p className="footer-titulo">Atendimento</p>
          <p>Seg. a sex., das 9h às 18h</p>
          <p>atendimento@techstore.com.br</p>
        </div>

        <div className="footer-coluna">
          <p className="footer-titulo">Área interna</p>
          <Link to="/estoque">Estoque</Link>
          {modoLojista ? (
            <button type="button" className="botao-link" onClick={onFecharPainelLojista}>
              Sair do painel do lojista
            </button>
          ) : (
            <button type="button" className="botao-link" onClick={onAbrirPainelLojista}>
              Painel do lojista
            </button>
          )}
        </div>
      </div>

      <div className="footer-base">
        <p>TechStore © 2026</p>

        {/* Ambiente de testes: simula qual cliente está navegando na loja */}
        <label className="cliente-simulado">
          Cliente de teste
          <select
            value={clienteAtualId || ''}
            onChange={(evento) => onTrocarCliente(evento.target.value)}
          >
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
    </footer>
  )
}
