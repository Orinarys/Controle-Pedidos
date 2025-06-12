import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';

// Ícones para demonstração (você pode substituir por uma biblioteca de ícones)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
    <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="M4.93 4.93l1.41 1.41"></path>
    <path d="M17.66 17.66l1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="M4.93 19.07l1.41-1.41"></path>
    <path d="M17.66 6.34l1.41-1.41"></path>
  </svg>
);

function PedidoApp() {
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('pedidos');
    return saved ? JSON.parse(saved) : [];
  });

  const [numeroPedido, setNumeroPedido] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [peso, setPeso] = useState(''); // Peso em KG
  const [status, setStatus] = useState(false);
  const [valor, setValor] = useState('');

  const [filtro, setFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [comissao, setComissao] = useState('');

  const [numeroPedidoErro, setNumeroPedidoErro] = useState(false);
  const [nomeErro, setNomeErro] = useState(false);
  const [valorErro, setValorErro] = useState(false);
  const [pesoErro, setPesoErro] = useState(false);

  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const adicionarPedido = () => {
    let hasError = false;

    if (!numeroPedido.trim() || isNaN(parseInt(numeroPedido)) || parseInt(numeroPedido) <= 0) {
      setNumeroPedidoErro(true);
      hasError = true;
    } else {
      if (pedidos.some(p => p.numero === parseInt(numeroPedido))) {
        setNumeroPedidoErro(true);
        alert('Erro: Número do pedido já existe. Por favor, insira um número único.');
        hasError = true;
      } else {
        setNumeroPedidoErro(false);
      }
    }

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

    if (peso && (isNaN(parseFloat(peso)) || parseFloat(peso) < 0)) {
        setPesoErro(true);
        hasError = true;
    } else {
        setPesoErro(false);
    }

    if (hasError) {
      return;
    }

    const newPedido = {
      id: Date.now(),
      numero: parseInt(numeroPedido),
      nome,
      descricao,
      peso: peso ? parseFloat(peso) : null,
      status,
      valor: parseFloat(valor),
      data: new Date().toISOString().split('T')[0],
    };

    setPedidos([...pedidos, newPedido]);
    setNumeroPedido('');
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

  const formatarPeso = (pesoKg) => {
    if (pesoKg === null || isNaN(pesoKg)) return 'N/A';
    if (pesoKg >= 1000) {
      return `${(pesoKg / 1000).toFixed(2)} Ton`;
    }
    return `${pesoKg.toFixed(2)} Kg`;
  };

  const exportarCSV = () => {
    const headers = ['Numero', 'Nome', 'Peso (Kg)', 'Valor', 'Data', 'Status'];
    const csvContent = [
      headers.join(','),
      ...pedidosFiltrados.map(p =>
        `${p.numero},"${p.nome}",${p.peso !== null ? p.peso.toFixed(2) : ''},${p.valor.toFixed(2)},${p.data},${p.status ? 'Finalizado' : 'Nao finalizado'}`
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
    (!filtroDataInicio || new Date(p.data + 'T00:00:00') >= new Date(filtroDataInicio + 'T00:00:00')) &&
    (!filtroDataFim || new Date(p.data + 'T00:00:00') <= new Date(filtroDataFim + 'T00:00:00'))
  ).sort((a, b) => b.numero - a.numero);

  const totalValor = pedidosFiltrados.reduce((acc, p) => acc + (p.valor || 0), 0);
  const totalPeso = pedidosFiltrados.reduce((acc, p) => acc + (p.peso || 0), 0);
  const comissaoValor = comissao && !isNaN(parseFloat(comissao)) ? (parseFloat(comissao) / 100) * totalValor : 0;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-black p-6 font-sans antialiased transition-colors duration-300'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>
            Controle de Pedidos
          </h1>
          <Button
            onClick={toggleTheme}
            className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300'
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </div>

        {/* Seção de Adicionar Pedido */}
        <Card className='p-8 mb-8 shadow-xl bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
          <h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6'>
            Adicionar Novo Pedido
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6'>
            <div>
              <label htmlFor='numeroPedido' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Número do Pedido</label>
              <Input
                id='numeroPedido'
                type='number'
                placeholder='Ex: 1001'
                value={numeroPedido}
                onChange={e => setNumeroPedido(e.target.value)}
                className={`w-full p-2 border ${numeroPedidoErro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150`}
              />
              {numeroPedidoErro && <p className='text-red-500 text-xs mt-1'>Número do pedido inválido ou já existente.</p>}
            </div>

            <div>
              <label htmlFor='nome' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Nome do Cliente</label>
              <Input
                id='nome'
                placeholder='Ex: João da Silva'
                value={nome}
                onChange={e => setNome(e.target.value)}
                className={`w-full p-2 border ${nomeErro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150`}
              />
              {nomeErro && <p className='text-red-500 text-xs mt-1'>Nome do cliente é obrigatório.</p>}
            </div>
            <div>
              <label htmlFor='valor' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Valor do Pedido (R$)</label>
              <Input
                id='valor'
                type='number'
                placeholder='Ex: 150.75'
                value={valor}
                onChange={e => setValor(e.target.value)}
                className={`w-full p-2 border ${valorErro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150`}
              />
              {valorErro && <p className='text-red-500 text-xs mt-1'>Valor inválido.</p>}
            </div>
            <div>
              <label htmlFor='peso' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Peso do Pedido (Kg)</label>
              <Input
                id='peso'
                type='number'
                placeholder='Ex: 2.5 (para 2.5kg)'
                value={peso}
                onChange={e => setPeso(e.target.value)}
                className={`w-full p-2 border ${pesoErro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150`}
              />
              {pesoErro && <p className='text-red-500 text-xs mt-1'>Peso inválido.</p>}
            </div>
            <div className='md:col-span-2'>
              <label htmlFor='descricao' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Descrição (opcional)</label>
              <Input
                id='descricao'
                placeholder='Detalhes do pedido...'
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150'
              />
            </div>
            <div className='flex items-center space-x-2 mt-2 md:col-span-2'>
              <Checkbox
                id='status'
                checked={status}
                onCheckedChange={setStatus}
                className='h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500'
              />
              <label htmlFor='status' className='text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none'>
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
        <Card className='p-8 mb-8 shadow-xl bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
          <h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6'>
            Filtros e Resumo
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6'>
            <div className='col-span-full sm:col-span-2'>
              <label htmlFor='busca' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Buscar por Nome</label>
              <Input
                id='busca'
                type='text'
                placeholder='Buscar cliente...'
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150'
              />
            </div>
            <div>
              <label htmlFor='filtroStatus' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Filtrar por Status</label>
              <select
                id='filtroStatus'
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-black focus:ring-blue-500 focus:border-blue-500 transition duration-150'
                onChange={e => setFiltro(e.target.value)}
                value={filtro}
              >
                <option value=''>Todos</option>
                <option value='finalizado'>Finalizados</option>
                <option value='nao-finalizado'>Não finalizados</option>
              </select>
            </div>
            <div>
              <label htmlFor='dataInicio' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Data Início</label>
              <Input
                id='dataInicio'
                type='date'
                value={filtroDataInicio}
                onChange={e => setFiltroDataInicio(e.target.value)}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150'
              />
            </div>
            <div>
              <label htmlFor='dataFim' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Data Fim</label>
              <Input
                id='dataFim'
                type='date'
                value={filtroDataFim}
                onChange={e => setFiltroDataFim(e.target.value)}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150'
              />
            </div>
            <div className='col-span-full sm:col-span-1 flex items-end'>
              <Button onClick={exportarCSV} className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-md shadow-sm hover:shadow-md transition duration-200 ease-in-out'>
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4'>
              Total dos Pedidos Filtrados: <span className='text-blue-600 dark:text-blue-400'>R$ {totalValor.toFixed(2)}</span>
            </p>
            <p className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4'>
              Peso Total dos Pedidos Filtrados: <span className='text-purple-600 dark:text-purple-400'>{formatarPeso(totalPeso)}</span>
            </p>
            <div className='flex items-center gap-4'>
              <label htmlFor='comissao' className='text-md font-medium text-gray-700 dark:text-gray-300'>Comissão (%)</label>
              <Input
                id='comissao'
                type='number'
                placeholder='Ex: 5'
                value={comissao}
                onChange={e => setComissao(e.target.value)}
                className='w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-black transition duration-150'
              />
              <p className='text-md font-medium text-gray-800 dark:text-gray-100'>
                Valor da Comissão: <span className='text-orange-500 dark:text-orange-400'>R$ {comissaoValor.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Lista de Pedidos */}
        <h2 className='text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6'>Meus Pedidos</h2>
        {pedidosFiltrados.length === 0 ? (
          <p className='text-center text-gray-500 dark:text-gray-400 text-xl py-12'>
            Nenhum pedido encontrado com os filtros aplicados. 😔
          </p>
        ) : (
          <div className='grid gap-4'>
            {pedidosFiltrados.map(p => (
              <Card key={p.id} className='p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition duration-200 ease-in-out border border-gray-100 dark:border-gray-700'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                  <div className='mb-4 sm:mb-0'>
                    <p className='font-bold text-xl text-black dark:text-black'>
                      Pedido #{p.numero} - {p.nome} - {formatarPeso(p.peso)}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                      Data: {p.data} - <span className='font-semibold text-blue-700 dark:text-blue-400'>R$ {p.valor.toFixed(2)}</span>
                    </p>
                    {p.descricao && <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>Descrição: {p.descricao}</p>}
                    <p className='mt-2 text-md font-medium'>
                      Status:
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-white text-sm ${p.status ? 'bg-green-500' : 'bg-red-500'}`}>
                        {p.status ? 'Finalizado ✅' : 'Pendente ⏳'}
                      </span>
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <Button
                      onClick={() => atualizarStatus(p.id)}
                      className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition duration-200 ease-in-out'
                    >
                      Alternar Status
                    </Button>
                    <Button
                      onClick={() => excluirPedido(p.id)}
                      className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow-sm hover:shadow-md transition duration-200 ease-in-out'
                    >
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