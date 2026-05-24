'use client';

import React from 'react';
import { 
  PlusCircle, MinusCircle, DollarSign, Wallet, Calendar, X, 
  Filter, User, LogOut, Download, Edit, Trash2 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

import { useTransactions } from '../hooks/useTransactions';

export default function Dashboard() {
  const {
    isModalOpen, setIsModalOpen,
    tipoTransacao,
    transacaoEmEdicao,
    isExportModalOpen, setIsExportModalOpen,
    exportType, setExportType,
    entradas, saidas, saldo, transacoes, socioLogado,
    periodoFiltro, setPeriodoFiltro,
    exportPeriodo, setExportPeriodo,
    salvarTransacao, deletarTransacao, fazerLogout, 
    abrirModalNovo, abrirModalEdicao, exportarParaExcel
  } = useTransactions();

  // Helpers
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarDataBr = (dataStr: string) => {
    if (!dataStr) return '-';
    const dataLimpa = dataStr.split('T')[0]; 
    const [ano, mes, dia] = dataLimpa.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Chart Data Preparation
  const despesas = transacoes.filter(t => t.type === 'EXPENSE');
  const dadosRoscaMap = despesas.reduce((acc, curr) => {
    const categoria = curr.category || 'Outros';
    acc[categoria] = (acc[categoria] || 0) + Number(curr.amount);
    return acc;
  }, {} as Record<string, number>);
  
  const dadosRosca = Object.keys(dadosRoscaMap).map(key => ({ 
    name: key, 
    value: dadosRoscaMap[key] 
  }));
  
  const CORES_PIZZA = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  const dadosBarras = [{ name: 'Resumo do Período', Entradas: entradas, Saídas: saidas }];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4 md:p-8">
      
      {/* --- Header & Controls --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 max-w-6xl mx-auto">
        <div className="w-full md:w-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sua Empresa Aqui</h1>
            <div className="flex items-center gap-4 mt-0.5">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <User size={14} /> Bem-vindo, 
                <span className="font-bold text-blue-600 dark:text-blue-400 truncate max-w-[120px] sm:max-w-none">
                  {socioLogado?.nome || socioLogado?.email}
                </span>
              </p>
              <button 
                onClick={fazerLogout} 
                className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
              >
                <LogOut size={12} /> Sair
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsExportModalOpen(true)} 
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-2 rounded-lg font-medium transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm border border-gray-300 dark:border-gray-600"
            >
              <Download size={16} /> <span className="hidden sm:inline">Exportar</span>
            </button>
            
            <div className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <Filter size={16} className="text-gray-400" />
              <input 
                type="month" 
                value={periodoFiltro} 
                onChange={(e) => setPeriodoFiltro(e.target.value)} 
                className="bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium outline-none cursor-pointer w-full"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => abrirModalNovo('EXPENSE')} 
              className="flex-1 justify-center flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition dark:bg-red-900/30 dark:text-red-400 text-sm whitespace-nowrap"
            >
              <MinusCircle size={18} /> <span>Despesa</span>
            </button>
            
            <button 
              onClick={() => abrirModalNovo('INCOME')} 
              className="flex-1 justify-center flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap"
            >
              <PlusCircle size={18} /> <span>Receita</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        
        {/* --- Summary Cards --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo no Período</h2>
              <Wallet className="text-blue-500" size={20} />
            </div>
            <p className={`text-3xl font-bold truncate ${saldo >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`}>
              {formatarMoeda(saldo)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Entradas</h2>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 truncate">
              {formatarMoeda(entradas)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saídas</h2>
              <DollarSign className="text-red-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 truncate">
              {formatarMoeda(saidas)}
            </p>
          </div>
        </section>

        {/* --- Charts --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[350px] flex flex-col overflow-hidden">
            <h3 className="font-semibold mb-4 text-lg">Distribuição por Categoria</h3>
            <div className="flex-1 w-full min-h-[250px]">
              {dadosRosca.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosRosca} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {dadosRosca.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatarMoeda(Number(value))} />
                    <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : ( 
                <div className="flex h-full items-center justify-center text-sm text-gray-400 text-center">
                  Nenhuma despesa neste período.
                </div> 
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[350px] flex flex-col overflow-hidden">
            <h3 className="font-semibold mb-4 text-lg">Entradas vs Saídas</h3>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarras}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(value: any) => formatarMoeda(Number(value))} />
                  <Bar dataKey="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* --- Transaction History Table --- */}
        <section className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-amber-500"/> Histórico de Transações
          </h3>
          
          {/* Container com scroll horizontal em telas pequenas */}
          <div className="overflow-x-auto pb-4">
            {/* Tabela com largura mínima garantida (min-w-[800px]) para as colunas não esmagarem */}
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-medium whitespace-nowrap">Data</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Categoria</th>
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Forma</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Registrado por</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Tipo</th>
                  <th className="pb-3 font-medium whitespace-nowrap text-right">Valor</th>
                  <th className="pb-3 font-medium whitespace-nowrap text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transacoes.length === 0 ? ( 
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">Nenhuma transação neste período.</td>
                  </tr> 
                ) : (
                  transacoes.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition group">
                      <td className="py-4 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                        {formatarDataBr(item.transaction_date)}
                      </td>
                      <td className="py-4 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{item.category || 'Outros'}</span>
                      </td>
                      <td className="py-4 font-medium min-w-[150px]">{item.description}</td>
                      <td className="py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{item.payment_method || 'Não Informado'}</td>
                      <td className="py-4 text-xs text-gray-500 whitespace-nowrap">{item.registered_by || 'Sistema'}</td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {item.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`py-4 font-bold whitespace-nowrap text-right ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(item.amount)}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => abrirModalEdicao(item)} 
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition" 
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deletarTransacao(item.id)} 
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition" 
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- Transaction Modal (Create / Edit) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* max-h-[90vh] e overflow-y-auto impedem o formulário de vazar se a tela for pequena */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-gray-700 p-1 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 pr-8">
              {transacaoEmEdicao 
                ? '✏️ Editar Transação' 
                : (tipoTransacao === 'INCOME' ? '🟢 Registrar Receita' : '🔴 Registrar Despesa')}
            </h2>
            
            <form onSubmit={salvarTransacao} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input 
                  type="date" 
                  name="transaction_date" 
                  required 
                  defaultValue={transacaoEmEdicao ? transacaoEmEdicao.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0]} 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                <input 
                  type="number" 
                  name="amount" 
                  step="0.01" 
                  required 
                  defaultValue={transacaoEmEdicao?.amount} 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="0.00" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select 
                  name="category" 
                  required 
                  defaultValue={transacaoEmEdicao?.category || (tipoTransacao === 'EXPENSE' ? 'Operacional' : 'Vendas')} 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {tipoTransacao === 'EXPENSE' ? ( 
                    <>
                      <option value="Operacional">⚙️ Operacional</option>
                      <option value="Equipe">👥 Salários e Equipe</option>
                      <option value="Marketing">📢 Marketing e Vendas</option>
                      <option value="Impostos">📄 Impostos e Taxas</option>
                      <option value="Infraestrutura">🏢 Infraestrutura / Aluguel</option>
                      <option value="Software">💻 Softwares e Ferramentas</option>
                      <option value="Outros">🔄 Outros</option>
                    </> 
                  ) : ( 
                    <>
                      <option value="Vendas">💰 Vendas / Serviços</option>
                      <option value="Contratos">📄 Contratos Recorrentes</option>
                      <option value="Adiantamento">⏳ Adiantamento</option>
                      <option value="Rendimento">📈 Rendimentos / Investimentos</option>
                      <option value="Outros">🔄 Outros</option>
                    </> 
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                <select 
                  name="payment_method" 
                  required 
                  defaultValue={transacaoEmEdicao?.payment_method || 'Pix'} 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Pix">📸 Pix</option>
                  <option value="Dinheiro">💵 Dinheiro</option>
                  <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                  <option value="Cartão de Débito">🪪 Cartão de Débito</option>
                  <option value="Cheque">✍️ Cheque</option>
                  <option value="Boleto">📄 Boleto</option>
                  <option value="Depósito">🪪 Depósito</option>
                  <option value="Transferência">📄 Transferência</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descrição Breve</label>
                <input 
                  type="text" 
                  name="description" 
                  required 
                  defaultValue={transacaoEmEdicao?.description} 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: Material de escritório" 
                />
              </div>
              
              <button 
                type="submit" 
                className={`w-full py-3 rounded-lg font-bold text-white transition-colors mt-6 ${
                  transacaoEmEdicao 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : (tipoTransacao === 'INCOME' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')
                }`}
              >
                {transacaoEmEdicao ? 'Salvar Alterações' : 'Salvar Transação'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Export Modal --- */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsExportModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-gray-700 p-1 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 pr-8">
              <Download size={24} className="text-blue-500" /> Exportar Relatório
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Gere um arquivo CSV para abrir no Excel.
            </p>
            
            <form onSubmit={exportarParaExcel} className="space-y-5">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition dark:border-gray-700">
                  <input 
                    type="radio" 
                    name="exportOption" 
                    value="MONTH" 
                    checked={exportType === 'MONTH'} 
                    onChange={() => setExportType('MONTH')} 
                    className="w-4 h-4 text-blue-600" 
                  />
                  <span className="font-medium text-sm sm:text-base">Exportar um mês específico</span>
                </label>
                
                {exportType === 'MONTH' && (
                  <div className="flex gap-2 pl-8">
                    <input 
                      type="month" 
                      value={exportPeriodo} 
                      onChange={(e) => setExportPeriodo(e.target.value)} 
                      className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-sm rounded-lg outline-none px-3 py-2 cursor-pointer w-full" 
                    />
                  </div>
                )}
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition dark:border-gray-700">
                  <input 
                    type="radio" 
                    name="exportOption" 
                    value="ALL" 
                    checked={exportType === 'ALL'} 
                    onChange={() => setExportType('ALL')} 
                    className="w-4 h-4 text-blue-600" 
                  />
                  <span className="font-medium text-sm sm:text-base">Exportar todo o histórico</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 mt-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Baixar Planilha
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}