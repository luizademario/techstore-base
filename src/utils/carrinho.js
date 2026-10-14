// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

function valorNumerico(preco) {
  const numero = Number(preco)
  return Number.isFinite(numero) ? numero : 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => total + valorNumerico(produto?.price), 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
