import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export function useTransactions() {
  const router = useRouter();

  // UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Formulário e filtros
  const [tipoTransacao, setTipoTransacao] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState<any>(null); 
  const [exportType, setExportType] = useState<'MONTH' | 'ALL'>('MONTH');
  
  const dataAtual = new Date();
  const periodoAtual = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
  
  const [periodoFiltro, setPeriodoFiltro] = useState(periodoAtual);
  const [exportPeriodo, setExportPeriodo] = useState(periodoAtual);

  // Dados e totalizadores
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [socioLogado, setSocioLogado] = useState<any>(null);

  // Validação de sessão no mount
  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setSocioLogado({ 
          id: session.user.id, 
          email: session.user.email, 
          nome: session.user.user_metadata?.name || session.user.email 
        });
      }
    };
    verificarSessao();
  }, [router]);

  // Atualiza listagem ao alterar filtros
  useEffect(() => {
    if (socioLogado) carregarDados();
  }, [periodoFiltro, socioLogado]);

  const carregarDados = async () => {
    const [ano, mes] = periodoFiltro.split('-');
    const primeiroDia = `${periodoFiltro}-01`;
    
    // CORREÇÃO: Calcula dinamicamente o último dia do mês para a query na tela
    const ultimoDiaObjeto = new Date(Number(ano), Number(mes), 0);
    const diaFinal = String(ultimoDiaObjeto.getDate()).padStart(2, '0');
    const ultimoDia = `${periodoFiltro}-${diaFinal}`; 

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('transaction_date', primeiroDia)
      .lte('transaction_date', ultimoDia)
      .order('transaction_date', { ascending: false });

    if (error) { 
      console.error("Erro ao buscar transações:", error); 
      return; 
    }

    if (data) {
      setTransacoes(data);
      
      let totalEntradas = 0; 
      let totalSaidas = 0;
      
      data.forEach((t) => {
        if (t.type === 'INCOME') totalEntradas += Number(t.amount);
        else if (t.type === 'EXPENSE') totalSaidas += Number(t.amount);
      });
      
      setEntradas(totalEntradas); 
      setSaidas(totalSaidas); 
      setSaldo(totalEntradas - totalSaidas);
    }
  };

  const salvarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const transaction_date = formData.get('transaction_date') as string;
    const payment_method = formData.get('payment_method') as string;
    const category = formData.get('category') as string;

    if (transacaoEmEdicao) {
      const { error } = await supabase
        .from('transactions')
        .update({ amount, description, transaction_date, payment_method, category })
        .eq('id', transacaoEmEdicao.id);
      
      if (error) {
        if (error.message.includes('row-level security')) {
          alert("🔒 Modo Visitante: Permissão apenas para leitura.");
        } else {
          alert("Erro ao atualizar: " + error.message);
        }
      } else { 
        setIsModalOpen(false); 
        carregarDados(); 
      }
    } else {
      const { error } = await supabase
        .from('transactions')
        .insert([{ 
          amount, type: tipoTransacao, status: 'COMPLETED', description, 
          transaction_date, payment_method, category, 
          user_id: socioLogado?.id, registered_by: socioLogado?.nome 
        }]);
      
      if (error) {
        if (error.message.includes('row-level security')) {
          alert("🔒 Modo Visitante: Permissão apenas para leitura.");
        } else {
          alert("Erro ao salvar: " + error.message);
        }
      } else { 
        setIsModalOpen(false); 
        carregarDados(); 
      }
    }
  };

  const deletarTransacao = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este lançamento?")) return;
    
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    
    if (error) {
      if (error.message.includes('row-level security')) {
        alert("🔒 Modo Visitante: Permissão apenas para leitura.");
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    } else {
      carregarDados();
    }
  };

  const fazerLogout = async () => { 
    await supabase.auth.signOut(); 
    router.push('/login'); 
  };

  const abrirModalNovo = (tipo: 'INCOME' | 'EXPENSE') => { 
    setTipoTransacao(tipo); 
    setTransacaoEmEdicao(null); 
    setIsModalOpen(true); 
  };

  const abrirModalEdicao = (transacao: any) => { 
    setTipoTransacao(transacao.type); 
    setTransacaoEmEdicao(transacao); 
    setIsModalOpen(true); 
  };

  const exportarParaExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let query = supabase.from('transactions').select('*').order('transaction_date', { ascending: false });

    if (exportType === 'MONTH') {
      const [anoExp, mesExp] = exportPeriodo.split('-');
      const primeiroDiaExp = `${exportPeriodo}-01`;
      
      // CORREÇÃO: Calcula dinamicamente o último dia do mês para a query do EXCEL
      const ultimoDiaObjetoExp = new Date(Number(anoExp), Number(mesExp), 0);
      const diaFinalExp = String(ultimoDiaObjetoExp.getDate()).padStart(2, '0');
      const ultimoDiaExp = `${exportPeriodo}-${diaFinalExp}`;
      
      query = query.gte('transaction_date', primeiroDiaExp).lte('transaction_date', ultimoDiaExp);
    }

    const { data, error } = await query;
    
    if (error) { 
      alert("Erro ao buscar dados para exportação: " + error.message); 
      return; 
    }
    if (!data || data.length === 0) { 
      alert("Nenhuma transação encontrada no período."); 
      return; 
    }

    const formatarDataBrLocal = (dataStr: string) => {
      if (!dataStr) return '-';
      const [ano, mes, dia] = dataStr.split('T')[0].split('-');
      return `${dia}/${mes}/${ano}`;
    };

    const cabecalho = ['Data', 'Categoria', 'Descrição', 'Forma de Pagamento', 'Registrado por', 'Tipo', 'Valor (R$)'];
    
    const lines = data.map(t => [
      formatarDataBrLocal(t.transaction_date), 
      t.category || 'Outros', 
      `"${t.description}"`, 
      t.payment_method || 'Não Informado', 
      t.registered_by || 'Sistema', 
      t.type === 'INCOME' ? 'Receita' : 'Despesa', 
      t.amount.toString().replace('.', ',')
    ]);
    
    const conteudoCSV = [cabecalho.join(';'), ...lines.map(line => line.join(';'))].join('\n');
    const blob = new Blob(["\uFEFF" + conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Relatorio_Financeiro_${exportType === 'ALL' ? 'Completo' : exportPeriodo}.csv`;
    
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link);
    
    setIsExportModalOpen(false);
  };

  return {
    isModalOpen, setIsModalOpen, 
    tipoTransacao, transacaoEmEdicao, 
    isExportModalOpen, setIsExportModalOpen,
    exportType, setExportType, 
    entradas, saidas, saldo, transacoes, socioLogado,
    periodoFiltro, setPeriodoFiltro, 
    exportPeriodo, setExportPeriodo,
    salvarTransacao, deletarTransacao, 
    fazerLogout, abrirModalNovo, abrirModalEdicao, exportarParaExcel
  };
}