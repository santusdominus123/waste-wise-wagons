import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | 'driver';

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isDriver: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  localSignIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getAllUsers: () => UserData[];
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ error: any }>;
  toggleUserStatus: (userId: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock database for user management (in production, this would be in a real database)
  const [usersDb, setUsersDb] = useState<UserData[]>([
    {
      id: 'local-admin',
      email: 'admin@local.dev',
      fullName: 'Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'local-user',
      email: 'user@local.dev',
      fullName: 'Regular User',
      role: 'user',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'local-driver',
      email: 'driver@local.dev',
      fullName: 'Driver User',
      role: 'driver',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ]);

  const isAdmin = userData?.role === 'admin';
  const isUser = userData?.role === 'user';
  const isDriver = userData?.role === 'driver';

  useEffect(() => {
    // Check for local session first
    const localSession = localStorage.getItem('local-auth-session');
    if (localSession) {
      try {
        const parsedSession = JSON.parse(localSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
        
        // For local sessions, the user data should be stored with the session
        if (parsedSession.userData) {
          setUserData(parsedSession.userData);
        } else {
          // Fallback: try to find user data based on session user id
          const userInfo = usersDb.find(u => u.id === parsedSession.user.id);
          setUserData(userInfo || null);
        }
        
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('local-auth-session');
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // For Supabase users, create default user data
          const defaultUserData: UserData = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || 'User',
            role: 'user',
            createdAt: session.user.created_at,
            isActive: true
          };
          setUserData(defaultUserData);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const defaultUserData: UserData = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || 'User',
          role: 'user',
          createdAt: session.user.created_at,
          isActive: true
        };
        setUserData(defaultUserData);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [usersDb]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const localSignIn = async (username: string, password: string) => {
    console.log('Attempting login with:', { username, password }); // Debug log
    
    // Local credentials for development/testing purposes
    const localUsers = [
      { username: 'admin', password: 'admin123', fullName: 'Administrator', email: 'admin@local.dev', role: 'admin' as UserRole },
      { username: 'user', password: 'user123', fullName: 'Regular User', email: 'user@local.dev', role: 'user' as UserRole },
      { username: 'driver', password: 'driver123', fullName: 'Driver User', email: 'driver@local.dev', role: 'driver' as UserRole }
    ];
    
    console.log('Available users:', localUsers); // Debug log
    
    const foundUser = localUsers.find(u => u.username === username && u.password === password);
    
    console.log('Found user:', foundUser); // Debug log
    
    if (!foundUser) {
      console.log('No user found with provided credentials'); // Debug log
      return { error: { message: 'Invalid credentials. Please check username and password.' } };
    }
    
    // Create a mock session for local login
    const mockUser = {
      id: `local-${username}`,
      email: foundUser.email,
      user_metadata: { full_name: foundUser.fullName },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated'
    } as User;
    
    const mockSession = {
      access_token: `mock-token-${username}`,
      refresh_token: `mock-refresh-${username}`,
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser
    } as Session;
    
    // Create corresponding user data
    const userInfo: UserData = {
      id: mockUser.id,
      email: foundUser.email,
      fullName: foundUser.fullName,
      role: foundUser.role,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    // Create session object with user data included
    const sessionWithUserData = {
      ...mockSession,
      userData: userInfo
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('local-auth-session', JSON.stringify(sessionWithUserData));
    
    setSession(mockSession);
    setUser(mockUser);
    setUserData(userInfo);
    
    return { error: null };
  };

  const signOut = async () => {
    // Clear local session if exists
    localStorage.removeItem('local-auth-session');
    setUserData(null);
    await supabase.auth.signOut();
  };

  // Admin functions for user management
  const getAllUsers = () => {
    return usersDb;
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setUsersDb(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // If updating current user's role, update userData
      if (userData?.id === userId) {
        setUserData(prev => prev ? { ...prev, role: newRole } : null);
      }
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update user role' } };
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      setUsersDb(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
      
      // If deactivating current user, sign them out
      const targetUser = usersDb.find(u => u.id === userId);
      if (targetUser && !targetUser.isActive && userData?.id === userId) {
        await signOut();
      }
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to toggle user status' } };
    }
  };

  const value = {
    user,
    session,
    userData,
    loading,
    isAdmin,
    isUser,
    isDriver,
    signIn,
    signUp,
    localSignIn,
    signOut,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};