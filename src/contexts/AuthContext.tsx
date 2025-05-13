
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { authAPI, supabase, profilesAPI, Profile } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { profile, error } = await profilesAPI.getProfileById(userId);
      
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      
      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await authAPI.register(email, password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        // Create a profile for the new user
        await profilesAPI.upsertProfile({
          id: data.user.id,
          email: data.user.email!,
          username: email.split('@')[0],
          created_at: new Date().toISOString()
        });
        
        toast.success("Account created successfully! Please check your email for verification.");
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await authAPI.login(email, password);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Login successful!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await authAPI.logout();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
