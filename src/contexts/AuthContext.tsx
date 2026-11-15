import React, { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseEphemeralClient } from '../services/supabaseClient';
import type { UserProfile } from '../types/auth';
import { CloudSyncService } from '../services/cloudSyncService';
import { StorageService } from '../services/storageService';
import { AuthContext } from './authContextDef';

const getInitialRecoveryState = (): { isRecovery: boolean; error: string | null } => {
  if (typeof window === 'undefined') {
    return { isRecovery: false, error: null };
  }
  try {
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes('error=') || search.includes('error=')) {
      const rawParams = hash.includes('error=') ? hash.replace(/^#/, '') : search.replace(/^\?/, '');
      const params = new URLSearchParams(rawParams);
      const errorCode = params.get('error_code');
      const errorDesc = params.get('error_description');

      // Limpa os parâmetros de erro da URL para não poluir o navegador
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      if (errorCode === 'otp_expired' || errorDesc?.toLowerCase().includes('expired')) {
        return { isRecovery: false, error: 'O link de recuperação de senha expirou. Por favor, solicite um novo e-mail.' };
      }
      if (errorDesc) {
        return { isRecovery: false, error: decodeURIComponent(errorDesc.replace(/\+/g, ' ')) };
      }
      return { isRecovery: false, error: 'Falha ao validar link de recuperação. Por favor, tente novamente.' };
    }

    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      return { isRecovery: true, error: null };
    }
  } catch (e) {
    console.warn('Erro ao verificar parâmetros de recuperação na URL:', e);
  }

  return { isRecovery: false, error: null };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialRecovery] = useState(getInitialRecoveryState);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(initialRecovery.isRecovery);
  const [recoveryError, setRecoveryError] = useState<string | null>(initialRecovery.error);

  const clearRecoveryError = useCallback(() => {
    setRecoveryError(null);
  }, []);

  // Busca ou cria o perfil no banco de dados do Supabase
  const fetchProfile = useCallback(async (userId: string, email?: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      if (data) {
        return data as UserProfile;
      }

      // Se por algum motivo o trigger não criou o perfil, criamos agora
      const fallbackName = email ? email.split('@')[0] : 'Estudante';
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email || null,
          display_name: fallbackName,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar perfil de fallback:', insertError);
        return null;
      }

      return newProfile as UserProfile;
    } catch (e) {
      console.error('Falha ao obter perfil do usuário:', e);
      return null;
    }
  }, []);

  // Sincroniza progresso de aprendizado ao autenticar
  const syncOnLogin = useCallback(async (userId: string) => {
    try {
      const cloudState = await CloudSyncService.fetchCloudLearningState(userId);
      const localState = StorageService.getState();

      if (cloudState) {
        // Mescla dados locais e nuvem para nunca perder o que foi feito em modo visitante
        const merged = CloudSyncService.mergeStates(localState, cloudState);
        StorageService.saveState(merged);
        await CloudSyncService.saveCloudLearningState(userId, merged);
      } else {
        // Se ainda não tinha nada na nuvem, faz upload do progresso local
        await CloudSyncService.saveCloudLearningState(userId, localState);
      }

      // Dispara evento de storage para os hooks do app atualizarem a UI
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Erro ao sincronizar progresso no login:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user.id, user.email);
      setProfile(p);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Obtém sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email).then((p) => {
          if (mounted) setProfile(p);
        });
        syncOnLogin(session.user.id);
      }
      setLoading(false);
    });

    // Escuta mudanças de autenticação (login, logout, refresh de token, PASSWORD_RECOVERY)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id, newSession.user.email);
        if (mounted) setProfile(p);
        await syncOnLogin(newSession.user.id);
      } else {
        if (mounted) setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, syncOnLogin]);

  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      setIsPasswordRecovery(false);

      // Limpa os parâmetros de hash/query da URL
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      return { error: null };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err : new Error('Falha ao atualizar a senha.'),
      };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    // Usamos o cliente efêmero para registrar a conta sem autenticar automaticamente a sessão
    const { data, error } = await supabaseEphemeralClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });

    if (!error && data?.user) {
      // Garante que o perfil do usuário tenha o display_name caso o trigger precise de complemento
      await supabaseEphemeralClient.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName || email.split('@')[0],
      });
    }

    // Garante que o cliente principal continue deslogado
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);

    return { error, user: data?.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isPasswordRecovery,
        recoveryError,
        setIsPasswordRecovery,
        clearRecoveryError,
        updatePassword,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
