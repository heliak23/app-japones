import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  recoveryError: string | null;
  setIsPasswordRecovery: (isRecovery: boolean) => void;
  clearRecoveryError: () => void;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null; user?: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
