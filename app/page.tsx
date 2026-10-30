'use client';

import React from 'react';
import './dashboard.css';
import { 
  PlusCircle, MinusCircle, DollarSign, Wallet, Calendar, X, 
  Filter, User, LogOut, Download, Edit, Trash2, LayoutDashboard, Activity, ArrowUpRight, ArrowDownRight, TrendingUp, ShieldCheck, CircleHelp 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend, CartesianGrid 
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
  
  const CORES_PIZZA = ['#5ce1e6', '#8276fa', '#ffba70', '#45cda5', '#f67ca5', '#7daddf'];
  const dadosBarras = [{ name: 'Resumo do Período', Entradas: entradas, Saídas: saidas }];

  const percentualSaidas = entradas > 0 ? Math.min((saidas / entradas) * 100, 100) : 0;
  const nomePeriodo = periodoFiltro ? new Date(`${periodoFiltro}-01T12:00:00`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Visão geral';

  return (
    <div className="dash-001 dashboard-shell">
      <aside className="app-sidebar" aria-label="Menu do painel">
        <div className="sidebar-brand"><div className="brand-symbol"><Activity size={22} strokeWidth={2.5}/></div><div><strong>CW<span>Studio</span></strong><small>FINANCE SYSTEM</small></div></div>
        <div className="sidebar-category">WORKSPACE</div>
        <div className="side-nav-active"><LayoutDashboard size={18}/><span>Visão geral</span><span className="active-indicator"/></div>
        <div className="sidebar-category sidebar-category-second">SEU PAINEL</div>
        <div className="side-nav-static"><Activity size={18}/><span>Dados financeiros</span></div>
        <div className="side-nav-static"><ShieldCheck size={18}/><span>Ambiente seguro</span></div>
        <div className="sidebar-spacer"/>
        <div className="sidebar-assistance"><CircleHelp size={19}/><div><strong>Controle financeiro</strong><span>Seu negócio, em tempo real.</span></div></div>
        <div className="sidebar-profile"><div className="profile-avatar"><User size={18}/></div><div className="sidebar-profile-text"><strong>{socioLogado?.nome || 'Usuário'}</strong><span>{socioLogado?.email || 'Conta conectada'}</span></div><button type="button" title="Sair da conta" aria-label="Sair da conta" onClick={fazerLogout}><LogOut size={17}/></button></div>
      </aside>
      <div className="dashboard-content">
      
      <div className="dashboard-topbar"><div className="topbar-location"><span className="topbar-dot"/> PAINEL / <strong>VISÃO GERAL</strong></div><div className="topbar-status"><span/> Sistema operacional</div></div>
      {/* --- Header & Controls --- */}
      <header className="dash-002">
        <div className="dash-003">
          <div>
            <div className="header-kicker">FINANCIAL OVERVIEW <span> / 01</span></div><h1 className="dash-004">Visão geral <span>financeira.</span></h1><p className="header-subheading">Acompanhe os números do seu negócio em um só lugar.</p>
            <div className="dash-005">
              <p className="dash-006">
                <User size={14} /> Bem-vindo, 
                <span className="dash-007">
                  {socioLogado?.nome || socioLogado?.email}
                </span>
              </p>
              <button 
                onClick={fazerLogout} 
                className="dash-008"
              >
                <LogOut size={12} /> Sair
              </button>
            </div>
          </div>
        </div>
        
        <div className="dash-009">
          <div className="dash-010">
            <button 
              onClick={() => setIsExportModalOpen(true)} 
              className="dash-011"
            >
              <Download size={16} /> <span className="dash-012">Exportar</span>
            </button>
            
            <div className="dash-013">
              <Filter size={16} className="dash-014" />
              <input 
                type="month" 
                value={periodoFiltro} 
                onChange={(e) => setPeriodoFiltro(e.target.value)} 
                className="dash-015"
              />
            </div>
          </div>

          <div className="dash-010">
            <button 
              onClick={() => abrirModalNovo('EXPENSE')} 
              className="dash-016"
            >
              <MinusCircle size={18} /> <span>Despesa</span>
            </button>
            
            <button 
              onClick={() => abrirModalNovo('INCOME')} 
              className="dash-017"
            >
              <PlusCircle size={18} /> <span>Receita</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dash-018">
        <div className="overview-strip"><div><span className="live-bullet"/> RESUMO FINANCEIRO <span className="strip-separator">/</span> {nomePeriodo}</div><div>{transacoes.length} transações registradas <ArrowUpRight size={14}/></div></div>
        
        {/* --- Summary Cards --- */}
        <section className="dash-019">
          <div className="dash-020 summary-balance">
            <div className="dash-021">
              <h2 className="dash-022">SALDO DISPONÍVEL <span className="card-index">01 / BALANCE</span></h2>
              <Wallet className="dash-023" size={20} />
            </div>
            <p className={`dash-077 ${saldo >= 0 ? 'dash-084' : 'dash-088'}`}>
              {formatarMoeda(saldo)}
            </p>
            <div className="card-bottom-note"><span className="mini-live"/> Resultado líquido do período <TrendingUp size={16}/></div>
          </div>
          
          <div className="dash-020 summary-income">
            <div className="dash-021">
              <h2 className="dash-022">TOTAL DE ENTRADAS</h2>
              <DollarSign className="dash-024" size={20} />
            </div>
            <p className="dash-025">
              {formatarMoeda(entradas)}
            </p>
            <div className="card-bottom-note"><ArrowUpRight size={15}/> Receitas registradas no período</div>
          </div>
          
          <div className="dash-026 summary-expense">
            <div className="dash-021">
              <h2 className="dash-022">TOTAL DE SAÍDAS</h2>
              <DollarSign className="dash-027" size={20} />
            </div>
            <p className="dash-028">
              {formatarMoeda(saidas)}
            </p>
            <div className="expense-meter"><span style={{ width: `${percentualSaidas}%` }}/></div><div className="card-bottom-note"><ArrowDownRight size={15}/> Despesas em relação às entradas</div>
          </div>
        </section>

        {/* --- Charts --- */}
        <section className="dash-029">
          <div className="dash-030">
            <div className="chart-header"><div><span className="section-overline">ANÁLISE DE GASTOS</span><h3 className="dash-031">Despesas por categoria</h3><p>Distribuição dos seus gastos no período</p></div><span className="chart-tag">CATEGORIAS</span></div>
            <div className="dash-032">
              {dadosRosca.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosRosca} cx="50%" cy="50%" innerRadius="62%" outerRadius="83%" paddingAngle={4} cornerRadius={6} dataKey="value" stroke="none">
                      {dadosRosca.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111d31', border: '1px solid #33425c', borderRadius: 12, color: '#eaf2ff' }} formatter={(value: any) => formatarMoeda(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : ( 
                <div className="dash-033">
                  Nenhuma despesa neste período.
                </div> 
              )}
            </div>
            {dadosRosca.length > 0 && <div className="category-legend">{dadosRosca.map((item, index) => <div key={item.name} className="category-legend-item"><span className="legend-swatch" style={{backgroundColor: CORES_PIZZA[index % CORES_PIZZA.length]}}/><span className="legend-name">{item.name}</span><strong>{formatarMoeda(item.value)}</strong></div>)}</div>}
          </div>
          
          <div className="dash-030">
            <div className="chart-header"><div><span className="section-overline">FLUXO DE CAIXA</span><h3 className="dash-031">Entradas & saídas</h3><p>Comparativo financeiro do período</p></div><span className="chart-tag">COMPARATIVO</span></div>
            <div className="dash-032">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarras} margin={{ top: 15, right: 15, left: 0, bottom: 5 }} barGap={16}>
                  <defs><linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5ce1d7"/><stop offset="100%" stopColor="#259f9e"/></linearGradient><linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9384ff"/><stop offset="100%" stopColor="#5543a0"/></linearGradient></defs>
                  <CartesianGrid stroke="#26334a" strokeDasharray="4 6" vertical={false}/>
                  <XAxis dataKey="name" stroke="#71819d" fontSize={11} tickLine={false} axisLine={false} tickMargin={14} />
                  <YAxis stroke="#71819d" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} width={85} />
                  <Tooltip cursor={{fill: '#ffffff06'}} contentStyle={{background: '#111d31', border: '1px solid #33425c', borderRadius: 12, color: '#eaf2ff'}} formatter={(value: any) => formatarMoeda(Number(value))} />
                  <Bar dataKey="Entradas" fill="url(#incomeGradient)" radius={[9, 9, 3, 3]} maxBarSize={64} />
                  <Bar dataKey="Saídas" fill="url(#expenseGradient)" radius={[9, 9, 3, 3]} maxBarSize={64} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bar-custom-legend"><span><i className="bar-color-income"/> Entradas</span><span><i className="bar-color-expense"/> Saídas</span></div>
          </div>
        </section>

        {/* --- Transaction History Table --- */}
        <section className="dash-034">
          <div className="transactions-heading"><div><span className="section-overline">REGISTROS RECENTES</span><h3 className="dash-035"><Calendar size={20} className="dash-036"/> Histórico de transações</h3><p>Movimentações financeiras do período selecionado.</p></div><span className="transaction-count">{transacoes.length} registros</span></div>
          
          {/* Container com scroll horizontal em telas pequenas */}
          <div className="dash-037">
            {/* Tabela com largura mínima garantida (min-w-[800px]) para as colunas não esmagarem */}
            <table className="dash-038">
              <thead>
                <tr className="dash-039">
                  <th className="dash-040">Data</th>
                  <th className="dash-040">Categoria</th>
                  <th className="dash-041">Descrição</th>
                  <th className="dash-040">Forma</th>
                  <th className="dash-040">Registrado por</th>
                  <th className="dash-040">Tipo</th>
                  <th className="dash-042">Valor</th>
                  <th className="dash-043">Ações</th>
                </tr>
              </thead>
              <tbody className="dash-044">
                {transacoes.length === 0 ? ( 
                  <tr>
                    <td colSpan={8} className="dash-045">Nenhuma transação neste período.</td>
                  </tr> 
                ) : (
                  transacoes.map((item) => (
                    <tr key={item.id} className="group dash-046">
                      <td className="dash-047">
                        {formatarDataBr(item.transaction_date)}
                      </td>
                      <td className="dash-048">
                        <span className="dash-049">{item.category || 'Outros'}</span>
                      </td>
                      <td className="dash-050">{item.description}</td>
                      <td className="dash-051">{item.payment_method || 'Não Informado'}</td>
                      <td className="dash-052">{item.registered_by || 'Sistema'}</td>
                      <td className="dash-053">
                        <span className={`dash-078 ${item.type === 'INCOME' ? 'dash-081' : 'dash-082'}`}>
                          {item.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`dash-079 ${item.type === 'INCOME' ? 'dash-087' : 'dash-088'}`}>
                        {formatarMoeda(item.amount)}
                      </td>
                      <td className="dash-054">
                        <div className="dash-055">
                          <button 
                            onClick={() => abrirModalEdicao(item)} 
                            className="dash-056" 
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deletarTransacao(item.id)} 
                            className="dash-057" 
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
      <footer className="dashboard-footer"><span>CW Studio<b>•</b> FINANCIAL INTELLIGENCE</span><span>Visão consolidada de suas finanças.</span></footer>
      </div>

      {/* --- Transaction Modal (Create / Edit) --- */}
      {isModalOpen && (
        <div className="dash-058">
          {/* max-h-[90vh] e overflow-y-auto impedem o formulário de vazar se a tela for pequena */}
          <div className="dash-059">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="dash-060"
            >
              <X size={20} />
            </button>
            
            <h2 className="dash-061">
              {transacaoEmEdicao 
                ? '✏️ Editar Transação' 
                : (tipoTransacao === 'INCOME' ? '🟢 Registrar Receita' : '🔴 Registrar Despesa')}
            </h2>
            
            <form onSubmit={salvarTransacao} className="dash-062">
              <div>
                <label className="dash-063">Data</label>
                <input 
                  type="date" 
                  name="transaction_date" 
                  required 
                  defaultValue={transacaoEmEdicao ? transacaoEmEdicao.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0]} 
                  className="dash-064"
                />
              </div>
              
              <div>
                <label className="dash-063">Valor (R$)</label>
                <input 
                  type="number" 
                  name="amount" 
                  step="0.01" 
                  required 
                  defaultValue={transacaoEmEdicao?.amount} 
                  className="dash-065" 
                  placeholder="0.00" 
                />
              </div>
              
              <div>
                <label className="dash-063">Categoria</label>
                <select 
                  name="category" 
                  required 
                  defaultValue={transacaoEmEdicao?.category || (tipoTransacao === 'EXPENSE' ? 'Operacional' : 'Vendas')} 
                  className="dash-066"
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
                <label className="dash-063">Forma de Pagamento</label>
                <select 
                  name="payment_method" 
                  required 
                  defaultValue={transacaoEmEdicao?.payment_method || 'Pix'} 
                  className="dash-066"
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
                <label className="dash-063">Descrição Breve</label>
                <input 
                  type="text" 
                  name="description" 
                  required 
                  defaultValue={transacaoEmEdicao?.description} 
                  className="dash-065" 
                  placeholder="Ex: Material de escritório" 
                />
              </div>
              
              <button 
                type="submit" 
                className={`dash-080 ${
                  transacaoEmEdicao 
                    ? 'dash-085' 
                    : (tipoTransacao === 'INCOME' ? 'dash-083' : 'dash-086')
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
        <div className="dash-058">
          <div className="dash-059">
            <button 
              onClick={() => setIsExportModalOpen(false)} 
              className="dash-060"
            >
              <X size={20} />
            </button>
            
            <h2 className="dash-067">
              <Download size={24} className="dash-023" /> Exportar Relatório
            </h2>
            <p className="dash-068">
              Gere um arquivo CSV para abrir no Excel.
            </p>
            
            <form onSubmit={exportarParaExcel} className="dash-069">
              <div className="dash-070">
                <label className="dash-071">
                  <input 
                    type="radio" 
                    name="exportOption" 
                    value="MONTH" 
                    checked={exportType === 'MONTH'} 
                    onChange={() => setExportType('MONTH')} 
                    className="dash-072" 
                  />
                  <span className="dash-073">Exportar um mês específico</span>
                </label>
                
                {exportType === 'MONTH' && (
                  <div className="dash-074">
                    <input 
                      type="month" 
                      value={exportPeriodo} 
                      onChange={(e) => setExportPeriodo(e.target.value)} 
                      className="dash-075" 
                    />
                  </div>
                )}
                
                <label className="dash-071">
                  <input 
                    type="radio" 
                    name="exportOption" 
                    value="ALL" 
                    checked={exportType === 'ALL'} 
                    onChange={() => setExportType('ALL')} 
                    className="dash-072" 
                  />
                  <span className="dash-073">Exportar todo o histórico</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="dash-076"
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