import type { Session, User } from "@supabase/supabase-js";

export interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => () => void;
  handleDeepLink: (url: string) => Promise<void>;
  signOut: () => Promise<void>;
}