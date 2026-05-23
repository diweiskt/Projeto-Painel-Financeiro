import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export function useTransactions() {
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState<any>(null); 
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'MONTH' | 'ALL'>('MONTH');
  
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [socioLogado, setSocioLogado] = useState<any>(null);

  // NOVO FILTRO ÚNICO (Formato: YYYY-MM)
  const dataAtual = new Date();
  const periodoAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
  
  const [periodoFiltro, setPeriodoFiltro] = useState(periodoAtual);
  const [exportPeriodo, setExportPeriodo] = useState(periodoAtual);

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else setSocioLogado({ id: session.user.id, email: session.user.email, nome: session.user.user_metadata?.name || session.user.email });
    };
    verificarSessao();
  }, [router]);

  const carregarDados = async () => {
    // Agora usamos diretamente o periodoFiltro (ex: "2026-05-01")
    const primeiroDia = `${periodoFiltro}-01`;
    const ultimoDia = `${periodoFiltro}-31`; 

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('transaction_date', primeiroDia)
      .lte('transaction_date', ultimoDia)
      .order('transaction_date', { ascending: false });

    if (error) { console.error("Erro ao buscar dados:", error); return; }

    if (data) {
      setTransacoes(data);
      let totalEntradas = 0; let totalSaidas = 0;
      data.forEach((t) => {
        if (t.type === 'INCOME') totalEntradas += Number(t.amount);
        else if (t.type === 'EXPENSE') totalSaidas += Number(t.amount);
      });
      setEntradas(totalEntradas); setSaidas(totalSaidas); setSaldo(totalEntradas - totalSaidas);
    }
  };

  useEffect(() => {
    if (socioLogado) carregarDados();
  }, [periodoFiltro, socioLogado]);

  const salvarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const transaction_date = formData.get('transaction_date') as string;
    const payment_method = formData.get('payment_method') as string;
    const category = formData.get('category') as string;

    if (transacaoEmEdicao) {
      const { error } = await supabase.from('transactions').update({ amount, description, transaction_date, payment_method, category }).eq('id', transacaoEmEdicao.id);
      if (error) alert("Erro ao atualizar: " + error.message); else { setIsModalOpen(false); carregarDados(); }
    } else {
      const { error } = await supabase.from('transactions').insert([{ amount, type: tipoTransacao, status: 'COMPLETED', description, transaction_date, payment_method, category, user_id: socioLogado?.id, registered_by: socioLogado?.nome }]);
      if (error) alert("Erro ao salvar: " + error.message); else { setIsModalOpen(false); carregarDados(); }
    }
  };

  const deletarTransacao = async (id: string) => {
    if (!window.confirm("Tem a certeza que deseja excluir este lançamento?")) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) alert("Erro ao excluir: " + error.message); else carregarDados();
  };

  const fazerLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };
  const abrirModalNovo = (tipo: 'INCOME' | 'EXPENSE') => { setTipoTransacao(tipo); setTransacaoEmEdicao(null); setIsModalOpen(true); };
  const abrirModalEdicao = (transacao: any) => { setTipoTransacao(transacao.type); setTransacaoEmEdicao(transacao); setIsModalOpen(true); };

  const exportarParaExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    let query = supabase.from('transactions').select('*').order('transaction_date', { ascending: false });

    if (exportType === 'MONTH') {
      const primeiroDia = `${exportPeriodo}-01`;
      const ultimoDia = `${exportPeriodo}-31`;
      query = query.gte('transaction_date', primeiroDia).lte('transaction_date', ultimoDia);
    }

    const { data, error } = await query;
    if (error) { alert("Erro ao buscar dados: " + error.message); return; }
    if (!data || data.length === 0) { alert("Nenhuma transação encontrada."); return; }

    const formatarDataBrLocal = (dataStr: string) => {
      if (!dataStr) return '-';
      const [ano, mes, dia] = dataStr.split('T')[0].split('-');
      return `${dia}/${mes}/${ano}`;
    };

    const cabecalho = ['Data', 'Categoria', 'Descrição', 'Forma de Pagamento', 'Registrado por', 'Tipo', 'Valor (R$)'];
    const lines = data.map(t => [formatarDataBrLocal(t.transaction_date), t.category || 'Outros', `"${t.description}"`, t.payment_method || 'Não Informado', t.registered_by || 'Sistema', t.type === 'INCOME' ? 'Receita' : 'Despesa', t.amount.toString().replace('.', ',')]);
    
    const conteudoCSV = [cabecalho.join(';'), ...lines.map(line => line.join(';'))].join('\n');
    const blob = new Blob(["\uFEFF" + conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Relatorio_Financeiro_${exportType === 'ALL' ? 'Completo' : exportPeriodo}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  return {
    isModalOpen, setIsModalOpen, tipoTransacao, transacaoEmEdicao, isExportModalOpen, setIsExportModalOpen,
    exportType, setExportType, entradas, saidas, saldo, transacoes, socioLogado,
    periodoFiltro, setPeriodoFiltro, exportPeriodo, setExportPeriodo, // Variáveis novas e limpas!
    salvarTransacao, deletarTransacao, fazerLogout, abrirModalNovo, abrirModalEdicao, exportarParaExcel
  };
}