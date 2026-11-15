import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, KeyRound, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false,
}) => {
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        if (error.message.toLowerCase().includes('same_password')) {
          setErrorMessage('A nova senha não pode ser igual à senha anterior.');
        } else {
          setErrorMessage(error.message || 'Falha ao atualizar a senha.');
        }
      } else {
        setSuccessMessage('Senha alterada com sucesso! Você já pode utilizar sua nova senha.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao processar alteração de senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#111927] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-6 bg-gradient-to-r from-brand-600 via-rose-600 to-indigo-600 text-white relative">
          {!isMandatory && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <KeyRound className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            Redefinir Senha
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            {isMandatory 
              ? 'Você acessou o link de recuperação. Digite e confirme sua nova senha para continuar estudando com segurança.'
              : 'Digite sua nova senha abaixo para atualizar suas credenciais de acesso.'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
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

          {/* Campo Nova Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nova Senha (mínimo 6 caracteres)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading || !!successMessage}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Nova Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading || !!successMessage}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c121e] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-rose-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando nova senha...</span>
                </>
              ) : (
                <span>Salvar Nova Senha</span>
              )}
            </button>

            {!isMandatory && (
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
