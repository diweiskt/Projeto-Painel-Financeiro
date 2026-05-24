'use client';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Voltando duas pastas para achar a lib
import { useRouter } from 'next/navigation';
import { Paintbrush, Eye } from 'lucide-react'; // Adicionado ícone Eye para o visitante

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Logo / Cabeçalho */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
            <Paintbrush className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sua Empresa Aqui</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acesso exclusivo para sócios</p>
        </div>

        {/* Formulário Principal de Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              placeholder="socio@pintura.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Botão de Login Principal */}
          <button 
            type="submit"
            disabled={loading || visitorLoading}
            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-70 mt-2 flex justify-center items-center"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Divisor Visual */}
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-sm text-gray-400 dark:text-gray-500">ou</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        {/* Botão de Visitante (Secundário) */}
        <button 
          type="button"
          onClick={loginComoVisitante}
          disabled={loading || visitorLoading}
          className="w-full py-3 rounded-xl font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition disabled:opacity-70 flex justify-center items-center gap-2"
        >
          <Eye size={20} />
          {visitorLoading ? 'Acessando...' : 'Entrar como Visitante'}
        </button>

      </div>
    </div>
  );
}