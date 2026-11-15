import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Sparkles, Database, BookOpen, Volume2, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';
import { ThemeToggle } from '../common/ThemeToggle';

export const AuthPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, recoveryError } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'recovery'>(
    recoveryError ? 'recovery' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(recoveryError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const translateAuthError = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
      return 'E-mail ou senha incorretos. Por favor, tente novamente.';
    }
    if (lower.includes('user already registered') || lower.includes('already registered')) {
      return 'Este e-mail já está cadastrado. Alterne para a aba de Login.';
    }
    if (lower.includes('password should be at least')) {
      return 'A senha deve conter no mínimo 6 caracteres.';
    }
    if (lower.includes('valid email')) {
      return 'Por favor, insira um endereço de e-mail válido.';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }

    if (activeTab === 'recovery') {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else {
          setSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Erro ao solicitar recuperação.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('As senhas digitadas não coincidem.');
        return;
      }

      setLoading(true);
      try {
        const { error } = await signUpWithEmail(email.trim(), password, displayName.trim());
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else {
          setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
          // Redireciona para a aba de login após exibir a confirmação
          setTimeout(() => {
            setActiveTab('login');
            setPassword('');
            setConfirmPassword('');
            setSuccessMessage('Conta criada com sucesso! Agora digite sua senha para entrar no sistema.');
          }, 1200);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Falha ao criar conta.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      setLoading(true);
      try {
        const { error } = await signInWithEmail(email.trim(), password);
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else {
          setSuccessMessage('Login efetuado com sucesso! Redirecionando...');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Falha ao autenticar.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900/50 transition-colors duration-200">
      
      {/* Barra de Topo Simplificada */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
            あ
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">
              <span>NihonGo!</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
                PT-BR
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Aprenda Hiragana & Katakana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Conteúdo Principal com Split Screen */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Coluna da Esquerda: Apresentação e Benefícios */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Acesso ao Sistema NihonGo!</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Aprenda os alfabetos japoneses com{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-rose-500 to-indigo-600">
                progresso salvo na nuvem
              </span>.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              Faça login ou crie sua conta gratuita para acessar o ambiente completo de aprendizado, memorização e exercícios práticos.
            </p>

            {/* Lista de Recursos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">142 Caracteres</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hiragana & Katakana completos com fonética em PT-BR.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Áudios Nativos</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pronúncia falada nativa com controle de velocidade.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">5 Tipos de Exercícios</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Digitação, múltipla escolha, conversão e revisão.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Banco Supabase</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Histórico e acertos salvos com segurança em nuvem.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Autenticação */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-[#111927] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
              
              {/* Header do Card */}
              <div className="p-6 bg-gradient-to-r from-brand-600 via-rose-600 to-indigo-600 text-white text-center select-none relative overflow-hidden">
                <div className="absolute -right-4 -bottom-6 text-7xl font-black font-jp opacity-10 pointer-events-none">
                  日本語
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  {activeTab === 'login' && 'Entrar no NihonGo!'}
                  {activeTab === 'register' && 'Cadastre-se Gratuitamente'}
                  {activeTab === 'recovery' && 'Recuperar Senha'}
                </h2>
                <p className="text-white/80 text-xs mt-1">
                  {activeTab === 'login' && 'Informe suas credenciais para acessar seus estudos'}
                  {activeTab === 'register' && 'Leva menos de 30 segundos para criar sua conta'}
                  {activeTab === 'recovery' && 'Digite seu e-mail cadastrado'}
                </p>
              </div>

              {/* Abas Alternadoras */}
              {activeTab !== 'recovery' && (
                <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0c121e]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'login'
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-[#111927]'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>Entrar</span>
                    <span className="font-jp text-[11px] font-normal opacity-70">ログイン</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'register'
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-[#111927]'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>Criar Conta</span>
                    <span className="font-jp text-[11px] font-normal opacity-70">登録</span>
                  </button>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
                
                {/* Mensagens de Feedback */}
                {errorMessage && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Campo Nome de Exibição */}
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Seu Nome ou Apelido
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Ex: Tanaka, Carlos..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Campo E-mail */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                {activeTab !== 'recovery' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Senha
                      </label>
                      {activeTab === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('recovery');
                            setErrorMessage(null);
                            setSuccessMessage(null);
                          }}
                          className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmar Senha (apenas no Cadastro) */}
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-rose-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {activeTab === 'login' && 'Entrar no Sistema'}
                        {activeTab === 'register' && 'Criar Conta e Entrar'}
                        {activeTab === 'recovery' && 'Enviar E-mail de Recuperação'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Voltar para login se estiver em recuperação */}
                {activeTab === 'recovery' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    ← Voltar para a tela de Login
                  </button>
                )}

                {/* Informação do Banco Supabase */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Autenticação segura via <strong>Supabase PostgreSQL</strong></span>
                  </div>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Rodapé Simples */}
      <footer className="max-w-7xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/50 dark:border-slate-800/50">
        NihonGo! • Sistema de Aprendizado de Hiragana & Katakana com Supabase
      </footer>

    </div>
  );
};
