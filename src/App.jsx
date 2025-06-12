import React, { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'

function PedidoApp() {
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('pedidos')
    return saved ? JSON.parse(saved) : []
  })
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [peso, setPeso] = useState('')
  const [status, setStatus] = useState(false)
  const [valor, setValor] = useState('')
  const [filtro, setFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')
  const [comissao, setComissao] = useState('')

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos))
  }, [pedidos])

  const adicionarPedido = () => {
    if (!nome.trim() || !valor || isNaN(valor)) return
    setPedidos([
      ...pedidos,
      {
        id: Date.now(),
        numero: pedidos.length + 1,
        nome,
        descricao,
        peso,
        status,
        valor: parseFloat(valor),
        data: new Date().toISOString().split('T')[0],
      },
    ])
    setNome('')
    setDescricao('')
    setPeso('')
    setValor('')
    setStatus(false)
  }

  const atualizarStatus = (id) => {
    setPedidos(pedidos.map(p => p.id === id ? { ...p, status: !p.status } : p))
  }

  const excluirPedido = (id) => {
    setPedidos(pedidos.filter(p => p.id !== id))
  }

  const exportarCSV = () => {
    const csv = pedidos.map(p => `${p.numero},${p.nome},${p.peso},${p.valor},${p.data},${p.status ? 'Finalizado' : 'Não finalizado'}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'pedidos.csv'
    link.click()
  }

  const pedidosFiltrados = pedidos.filter(p =>
    (filtro === '' || p.status === (filtro === 'finalizado')) &&
    p.nome.toLowerCase().includes(busca.toLowerCase()) &&
    (!filtroDataInicio || new Date(p.data) >= new Date(filtroDataInicio)) &&
    (!filtroDataFim || new Date(p.data) <= new Date(filtroDataFim))
  )

  const total = pedidosFiltrados.reduce((acc, p) => acc + (p.valor || 0), 0)
  const comissaoValor = comissao ? (parseFloat(comissao) / 100) * total : 0

  return (
    <div className='min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Controle de Pedidos</h1>
      <Card>
        <div className='grid gap-2 mb-2'>
          <Input placeholder='Nome do cliente' value={nome} onChange={e => setNome(e.target.value)} />
          <Input placeholder='Peso do pedido' value={peso} onChange={e => setPeso(e.target.value)} />
          <Input placeholder='Valor do pedido (R$)' value={valor} onChange={e => setValor(e.target.value)} />
          <Input placeholder='Descrição (opcional)' value={descricao} onChange={e => setDescricao(e.target.value)} />
          <label className='flex items-center'>
            <Checkbox checked={status} onChange={e => setStatus(e.target.checked)} />
            Marcar como finalizado
          </label>
          <Button onClick={adicionarPedido}>Adicionar Pedido</Button>
        </div>
      </Card>

      <div className='flex flex-wrap gap-2 my-4'>
        <Input type='text' placeholder='Buscar por nome' value={busca} onChange={e => setBusca(e.target.value)} />
        <select className='border rounded px-2' onChange={e => setFiltro(e.target.value)} value={filtro}>
          <option value=''>Todos</option>
          <option value='finalizado'>Finalizados</option>
          <option value='nao'>Não finalizados</option>
        </select>
        <Input type='date' value={filtroDataInicio} onChange={e => setFiltroDataInicio(e.target.value)} />
        <Input type='date' value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)} />
        <Button onClick={exportarCSV}>Exportar CSV</Button>
      </div>

      <Card>
        <p className='text-lg font-semibold'>Total dos pedidos filtrados: R$ {total.toFixed(2)}</p>
        <div className='flex items-center gap-2 mt-2'>
          <Input type='number' placeholder='% Comissão' value={comissao} onChange={e => setComissao(e.target.value)} />
          <p>Comissão: R$ {comissaoValor.toFixed(2)}</p>
        </div>
      </Card>

      {pedidosFiltrados.map(p => (
        <Card key={p.id} className='mb-2'>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-semibold'>#{p.numero} - {p.nome} - {p.peso}kg</p>
              <p className='text-sm text-gray-600'>Data: {p.data} - R$ {p.valor.toFixed(2)}</p>
              <p className='text-sm'>{p.descricao}</p>
              <p>Status: <span className={p.status ? 'text-green-600' : 'text-red-600'}>
                {p.status ? 'Finalizado ✅' : 'Não finalizado ❌'}
              </span></p>
            </div>
            <div className='flex gap-2'>
              <Button onClick={() => atualizarStatus(p.id)}>Alternar</Button>
              <Button onClick={() => excluirPedido(p.id)}>Excluir</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default PedidoApp
