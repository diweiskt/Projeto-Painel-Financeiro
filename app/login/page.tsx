'use client';
import React, { useState } from 'react';
import './login.css';
import { supabase } from '../../lib/supabase'; // Voltando duas pastas para achar a lib
import { useRouter } from 'next/navigation';
import { Eye, Info } from 'lucide-react'; // Adicionado ícone Info para o aviso

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de carregamento separados para uma melhor experiência do usuário (UX)
  const [loading, setLoading] = useState(false);
  const [visitorLoading, setVisitorLoading] = useState(false);
  
  const [error, setError] = useState('');
  const router = useRouter();

  // Função 1: Login oficial para administradores/sócios
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Tenta fazer o login no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError('E-mail ou senha incorretos. Tente novamente.');
      setLoading(false);
    } else {
      // Se deu certo, redireciona o usuário para o Dashboard (tela principal)
      router.push('/');
    }
  };

  // Função 2: Login automático para visitantes/recrutadores
  const loginComoVisitante = async () => {
    setVisitorLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: 'visitante@dw.pro',
      password: 'visitante123',
    });

    if (error) {
      setError('Erro ao conectar. Verifique se o usuário visitante existe no Supabase.');
      setVisitorLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="login-001">
      <div className="login-002">
        
        {/* Logo / Cabeçalho */}
        <div className="login-003">
          <div className="login-004">
            <span className="login-cw-mark" aria-label="CW Studio">CW<span className="login-cw-dot">.</span></span>
          </div>
          <h1 className="login-006">CW Studio</h1>
          <p className="login-007">Acesso exclusivo para sócios</p>
        </div>

        {/* Formulário Principal de Login */}
        <form onSubmit={handleLogin} className="login-008">
          <div>
            <label className="login-009">
              E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-010"
              placeholder="login@dw.pro"
            />
          </div>

          <div>
            <label className="login-009">
              Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-010"
              placeholder="••••••••"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="login-011">
              {error}
            </div>
          )}

          {/* Botão de Login Principal */}
          <button 
            type="submit"
            disabled={loading || visitorLoading}
            className="login-012"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Divisor Visual */}
        <div className="login-013">
          <div className="login-014"></div>
          <span className="login-015">ou</span>
          <div className="login-014"></div>
        </div>

        {/* Botão de Visitante (Secundário) */}
        <button 
          type="button"
          onClick={loginComoVisitante}
          disabled={loading || visitorLoading}
          className="login-016"
        >
          <Eye size={20} />
          {visitorLoading ? 'Acessando...' : 'Entrar como Visitante'}
        </button>

        {/* Caixa de Informação do Visitante */}
        <div className="login-017">
          {/* Ícone centralizado no topo */}
          <Info className="login-018" size={18} />
          
          {/* Mensagem principal explicativa */}
          <p className="login-019">
            O modo visitante disponibiliza apenas a visualização e exportação csv dos dados do painel.
          </p>
          
          {/* Link de contato centralizado embaixo */}
          <a 
            href="mailto:oi@diwei.pro?subject=Acesso%20Administrador%20-%20Painel%20Financeiro&body=Olá%20Diwei,%20gostei%20do%20seu%20web/app%20e%20gostaria%20de%20testá-lo%20como%20administrador." 
            className="login-020"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar acesso completo com permissão de edição →
          </a>
        </div>
      </div>
    </div>
  );
}