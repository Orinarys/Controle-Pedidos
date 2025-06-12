import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';

// Importar ícones se estiver usando uma biblioteca de ícones como Lucide React ou React-Icons
// Exemplo: import { CheckCircle, XCircle, Trash2, Repeat2, Download } from 'lucide-react';
// Para fins de demonstração, usaremos emojis simples.

function PedidoApp() {
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('pedidos');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado dos campos de entrada
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [peso, setPeso] = useState('');
  const [status, setStatus] = useState(false);
  const [valor, setValor] = useState('');

  // Estado dos filtros e busca
  const [filtro, setFiltro] = useState(''); // '' para todos, 'finalizado', 'nao-finalizado'
  const [busca, setBusca] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [comissao, setComissao] = useState('');

  // Estado de validação
  const [nomeErro, setNomeErro] = useState(false);
  const [valorErro, setValorErro] = useState(false);

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  const adicionarPedido = () => {
    let hasError = false;

    if (!nome.trim()) {
      setNomeErro(true);
      hasError = true;
    } else {
      setNomeErro(false);
    }

    if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      setValorErro(true);
      hasError = true;
    } else {
      setValorErro(false);
    }

    if (hasError) {
      return;
    }

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
        data: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      },
    ]);
    // Limpar os campos após adicionar
    setNome('');
    setDescricao('');
    setPeso('');
    setValor('');
    setStatus(false);
  };

  const atualizarStatus = (id) => {
    setPedidos(pedidos.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const excluirPedido = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      setPedidos(pedidos.filter(p => p.id !== id));
    }
  };

  const exportarCSV = () => {
    const headers = ['Numero', 'Nome', 'Peso', 'Valor', 'Data', 'Status'];
    const csvContent = [
      headers.join(','),
      ...pedidosFiltrados.map(p =>
        `${p.numero},"${p.nome}",${p.peso},${p.valor.toFixed(2)},${p.data},${p.status ? 'Finalizado' : 'Nao finalizado'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pedidos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pedidosFiltrados = pedidos.filter(p =>
    (filtro === '' || (filtro === 'finalizado' && p.status) || (filtro === 'nao-finalizado' && !p.status)) &&
    p.nome.toLowerCase().includes(busca.toLowerCase()) &&
    (!filtroDataInicio || new Date(p.data) >= new Date(filtroDataInicio)) &&
    (!filtroDataFim || new Date(p.data) <= new Date(filtroDataFim))
  );

  const total = pedidosFiltrados.reduce((acc, p) => acc + (p.valor || 0), 0);
  const comissaoValor = comissao && !isNaN(parseFloat(comissao)) ? (parseFloat(comissao) / 100) * total : 0;

  return (
    <div className='min-h-screen bg-gray-50 p-6 font-sans antialiased'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>
          Controle de Pedidos
        </h1>

        {/* Seção de Adicionar Pedido */}
        <Card className='p-8 mb-8 shadow-xl bg-white rounded-xl border border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
            Adicionar Novo Pedido
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6'>
            <div>
              <label htmlFor='nome' className='block text-sm font-medium text-gray-700 mb-2'>Nome do Cliente</label>
              <Input
                id='nome'
                placeholder='Ex: João da Silva'
                value={nome}
                onChange={e => setNome(e.target.value)}
                className={`w-full p-2 border ${nomeErro ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
              />
              {nomeErro && <p className='text-red-500 text-xs mt-1'>Nome do cliente é obrigatório.</p>}
            </div>
            <div>
              <label htmlFor='valor' className='block text-sm font-medium text-gray-700 mb-2'>Valor do Pedido (R$)</label>
              <Input
                id='valor'
                type='number'
                placeholder='Ex: 150.75'
                value={valor}
                onChange={e => setValor(e.target.value)}
                className={`w-full p-2 border ${valorErro ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
              />
              {valorErro && <p className='text-red-500 text-xs mt-1'>Valor inválido.</p>}
            </div>
            <div>
              <label htmlFor='peso' className='block text-sm font-medium text-gray-700 mb-2'>Peso do Pedido (kg)</label>
              <Input
                id='peso'
                type='number'
                placeholder='Ex: 2.5'
                value={peso}
                onChange={e => setPeso(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>
            <div>
              <label htmlFor='descricao' className='block text-sm font-medium text-gray-700 mb-2'>Descrição (opcional)</label>
              <Input
                id='descricao'
                placeholder='Detalhes do pedido...'
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>
            <div className='flex items-center space-x-2 mt-2 md:col-span-2'>
              <Checkbox
                id='status'
                checked={status}
                onCheckedChange={setStatus}
                className='h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <label htmlFor='status' className='text-base font-medium text-gray-700 cursor-pointer select-none'>
                Marcar como finalizado
              </label>
            </div>
          </div>
          <Button
            onClick={adicionarPedido}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out'
          >
            Adicionar Pedido
          </Button>
        </Card>

        {/* Seção de Filtros e Resumo */}
        <Card className='p-8 mb-8 shadow-xl bg-white rounded-xl border border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
            Filtros e Resumo
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6'>
            <div className='col-span-full sm:col-span-2'>
              <label htmlFor='busca' className='block text-sm font-medium text-gray-700 mb-2'>Buscar por Nome</label>
              <Input
                id='busca'
                type='text'
                placeholder='Buscar cliente...'
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>
            <div>
              <label htmlFor='filtroStatus' className='block text-sm font-medium text-gray-700 mb-2'>Filtrar por Status</label>
              <select
                id='filtroStatus'
                className='w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150'
                onChange={e => setFiltro(e.target.value)}
                value={filtro}
              >
                <option value=''>Todos</option>
                <option value='finalizado'>Finalizados</option>
                <option value='nao-finalizado'>Não finalizados</option>
              </select>
            </div>
            <div>
              <label htmlFor='dataInicio' className='block text-sm font-medium text-gray-700 mb-2'>Data Início</label>
              <Input
                id='dataInicio'
                type='date'
                value={filtroDataInicio}
                onChange={e => setFiltroDataInicio(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>
            <div>
              <label htmlFor='dataFim' className='block text-sm font-medium text-gray-700 mb-2'>Data Fim</label>
              <Input
                id='dataFim'
                type='date'
                value={filtroDataFim}
                onChange={e => setFiltroDataFim(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>
            <div className='col-span-full sm:col-span-1 flex items-end'>
              <Button onClick={exportarCSV} className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-md shadow-sm hover:shadow-md transition duration-200 ease-in-out'>
                {/* <Download className="inline-block mr-2" size={20} /> */}
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <p className='text-xl font-semibold text-gray-800 mb-4'>
              Total dos Pedidos Filtrados: <span className='text-blue-600'>R$ {total.toFixed(2)}</span>
            </p>
            <div className='flex items-center gap-4'>
              <label htmlFor='comissao' className='text-md font-medium text-gray-700'>Comissão (%)</label>
              <Input
                id='comissao'
                type='number'
                placeholder='Ex: 5'
                value={comissao}
                onChange={e => setComissao(e.target.value)}
                className='w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
              <p className='text-md font-medium text-gray-800'>
                Valor da Comissão: <span className='text-orange-500'>R$ {comissaoValor.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Lista de Pedidos */}
        <h2 className='text-3xl font-semibold text-gray-800 mb-6'>Meus Pedidos</h2>
        {pedidosFiltrados.length === 0 ? (
          <p className='text-center text-gray-500 text-xl py-12'>
            Nenhum pedido encontrado com os filtros aplicados. 😔
          </p>
        ) : (
          <div className='grid gap-4'>
            {pedidosFiltrados.map(p => (
              <Card key={p.id} className='p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out border border-gray-100'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                  <div className='mb-4 sm:mb-0'>
                    <p className='font-bold text-xl text-gray-900'>
                      #{p.numero} - {p.nome} {p.peso ? `- ${p.peso}kg` : ''}
                    </p>
                    <p className='text-sm text-gray-600 mt-1'>
                      Data: {p.data} - <span className='font-semibold text-blue-700'>R$ {p.valor.toFixed(2)}</span>
                    </p>
                    {p.descricao && <p className='text-sm text-gray-700 mt-2'>Descrição: {p.descricao}</p>}
                    <p className='mt-2 text-md font-medium'>
                      Status:
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs ${p.status ? 'bg-green-500' : 'bg-red-500'}`}>
                        {p.status ? 'Finalizado ✅' : 'Pendente ⏳'}
                      </span>
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <Button
                      onClick={() => atualizarStatus(p.id)}
                      className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition duration-200 ease-in-out'
                    >
                      {/* <Repeat2 className="inline-block mr-2" size={16} /> */}
                      Alternar Status
                    </Button>
                    <Button
                      onClick={() => excluirPedido(p.id)}
                      className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition duration-200 ease-in-out'
                    >
                      {/* <Trash2 className="inline-block mr-2" size={16} /> */}
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PedidoApp;