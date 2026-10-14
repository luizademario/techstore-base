import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = {
    roupas: 'Roupas',
    eletronicos: 'Eletrônicos',
    acessorios: 'Acessórios',
    casa: 'Casa',
}

export default function PainelLojista({ produtos, listaEspera }) {
    const categorias = Object.entries(CATEGORIAS).map(([id, nome]) => {
        const itens = produtos.filter((produto) => produto.category === id)

        const valorEmEstoque = itens.reduce((total, produto) => {
            const valor = Number(produto.price)
            const quantidade = Number(produto.estoque || 0)
            return Number.isFinite(valor) ? total + valor * quantidade : total
        }, 0)

        const esperandoPreco = itens.filter(
            (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
        ).length

        const clientesEsperando = itens.reduce(
            (total, produto) => total + (listaEspera[produto.id]?.length ?? 0),
            0
        )

        const lucroEstimado = itens.reduce((total, produto) => {
            const preco = Number(produto.price)
            const promocional = Number(produto.precoOriginal || produto.price || 0)
            const quantidade = Number(produto.estoque || 0)

            if (!Number.isFinite(preco) || quantidade <= 0) return total

            const margem = Math.max(promocional - preco, 0)
            return total + margem * quantidade
        }, 0)

        return {
            id,
            nome,
            valorEmEstoque,
            esperandoPreco,
            clientesEsperando,
            lucroEstimado,
            totalItens: itens.length,
        }
    })

    const totalEstoque = categorias.reduce((total, categoria) => total + categoria.valorEmEstoque, 0)
    const totalSemPreco = produtos.filter(
        (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
    ).length
    const totalClientesEsperando = Object.values(listaEspera).reduce(
        (total, lista) => total + lista.length,
        0
    )

    return (
        <section>
            <p className="sobretitulo">Painel administrativo</p>
            <h1>Painel do lojista</h1>

            <div className="painel-resumo">
                <div className="painel-card painel-card-destaque">
                    <p className="painel-label">Estoque valorizado</p>
                    <strong>{formatarPreco(totalEstoque)}</strong>
                </div>

                <div className="painel-card painel-card-destaque">
                    <p className="painel-label">Aguardando preço</p>
                    <strong>{totalSemPreco}</strong>
                </div>

                <div className="painel-card painel-card-destaque">
                    <p className="painel-label">Clientes na fila</p>
                    <strong>{totalClientesEsperando}</strong>
                </div>
            </div>

            <div className="painel-grid">
                {categorias.map((categoria) => (
                    <article key={categoria.id} className="painel-card painel-card-categoria">
                        <h2>{categoria.nome}</h2>

                        <ul className="painel-lista">
                            <li>
                                <span>Estoque valorizado</span>
                                <strong>{formatarPreco(categoria.valorEmEstoque)}</strong>
                            </li>
                            <li>
                                <span>Itens esperando preço</span>
                                <strong>{categoria.esperandoPreco}</strong>
                            </li>
                            <li>
                                <span>Clientes esperando</span>
                                <strong>{categoria.clientesEsperando}</strong>
                            </li>
                            <li>
                                <span>Lucro estimado</span>
                                <strong>
                                    {categoria.totalItens > 0
                                        ? formatarPreco(categoria.lucroEstimado)
                                        : 'R$ 0,00'}
                                </strong>
                            </li>
                        </ul>
                    </article>
                ))}
            </div>

            <div className="painel-card painel-card-lista">
                <h2>Produtos aguardando preço</h2>

                {produtos.filter(
                    (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
                ).length > 0 ? (
                    <ul className="lista-espera painel-lista-externa">
                        {produtos
                            .filter(
                                (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price) <= 0
                            )
                            .map((produto) => (
                                <li key={produto.id}>
                                    <span>{produto.title}</span>
                                    <strong>{CATEGORIAS[produto.category] || produto.category}</strong>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="aviso">Nenhum produto está esperando definição de preço.</p>
                )}
            </div>
        </section>
    )
}
