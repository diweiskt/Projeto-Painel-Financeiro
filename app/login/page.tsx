'use client';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Voltando duas pastas para achar a lib
import { useRouter } from 'next/navigation';
import { Paintbrush } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

        {/* Formulário de Login */}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-70 mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

      </div>
    </div>
  );
}