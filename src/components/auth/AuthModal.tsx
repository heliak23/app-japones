import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Sparkles, Database } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'recovery'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: 'login' | 'register' | 'recovery') => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const translateAuthError = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
      return 'E-mail ou senha incorretos. Por favor, tente novamente.';
    }
    if (lower.includes('user already registered') || lower.includes('already registered')) {
      return 'Este e-mail já está cadastrado. Tente fazer login.';
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

    // Validações básicas
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, digite um e-mail válido.');
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
      setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem.');
        return;
      }

      setLoading(true);
      try {
        const { error } = await signUpWithEmail(email.trim(), password, displayName.trim());
        if (error) {
          setErrorMessage(translateAuthError(error.message));
        } else {
          setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
          setTimeout(() => {
            setActiveTab('login');
            setPassword('');
            setConfirmPassword('');
            setSuccessMessage('Conta criada com sucesso! Agora digite sua senha para entrar.');
          }, 1200);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Falha ao realizar cadastro.');
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
          setSuccessMessage('Login efetuado com sucesso!');
          setTimeout(() => {
            handleClose();
          }, 800);
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Falha ao autenticar.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 flex flex-col md:h-[600px] min-h-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo Decorativo com Gradiente Japonês */}
        <div className="relative bg-gradient-to-r from-brand-600 via-rose-500 to-indigo-600 p-6 text-white text-center select-none overflow-hidden">
          <div className="absolute -right-6 -bottom-8 text-8xl font-black font-jp opacity-10 pointer-events-none">
            日本語
          </div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NihonGo! Cloud Pass</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {activeTab === 'login' && 'Bem-vindo de volta!'}
            {activeTab === 'register' && 'Crie sua conta'}
            {activeTab === 'recovery' && 'Recuperar Senha'}
          </h2>

          <p className="text-white/85 text-xs mt-1 max-w-xs mx-auto">
            {activeTab === 'login' && 'Acesse seus dados e continue seus estudos de Hiragana & Katakana.'}
            {activeTab === 'register' && 'Sincronize seu progresso na nuvem e estude em qualquer lugar.'}
            {activeTab === 'recovery' && 'Enviaremos instruções de redefinição para o seu e-mail.'}
          </p>
        </div>

        {/* Abas Alternadoras (Login / Cadastro) */}
        {activeTab !== 'recovery' && (
          <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0c121e]">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-[#111927]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>Entrar</span>
              <span className="font-jp text-[11px] font-normal opacity-70">ログイン</span>
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
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

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Alertas de Erro e Sucesso */}
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

            {/* Campo Nome de Exibição (Apenas no Cadastro) */}
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
                      onClick={() => handleTabChange('recovery')}
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
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmar Senha (Apenas no Cadastro) */}
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

            {/* Informação na aba Login para equilíbrio visual */}
            {activeTab === 'login' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-center gap-2 select-none">
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Seu progresso, ofensiva diária e pontuação são sincronizados de forma segura no banco de dados.</span>
              </div>
            )}
          </div>

          {/* Ações Inferiores (Botão e Rodapé) */}
          <div className="pt-4 space-y-3">
            {/* Botão de Ação Principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>
                    {activeTab === 'login' && 'Entrar na Conta'}
                    {activeTab === 'register' && 'Cadastrar Gratuitamente'}
                    {activeTab === 'recovery' && 'Enviar E-mail de Recuperação'}
                  </span>
                </>
              )}
            </button>

            {/* Voltar para login se estiver em recuperação */}
            {activeTab === 'recovery' && (
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="w-full py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                ← Voltar para o Login
              </button>
            )}

            {/* Rodapé do Modal com Informações do Banco */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Autenticação segura via <strong>Banco de Dados</strong></span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
