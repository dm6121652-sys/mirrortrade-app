import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { authApi } from '../api/auth';
import { useRouter, useSegments } from 'expo-router';

interface User {
  id: string;
  email: string;
  firstName?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<User>;
  signUp: (email: string, firstName: string, pass: string) => Promise<User>;
  markOnboardingComplete: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Load token on startup
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const token = await getItem('auth_token');
        const storedUser = await getItem('user_data');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredSession();
  }, []);

  // Guard routing logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === 'auth';
    const onWelcomeScreen = segments[0] === 'welcome';
    const inOnboarding = segments[0] === 'onboarding';

    } else if (user && inAuthGroup) {
      // Logged in but on auth screen → route based on onboarding status
      if (!user.onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (user && inOnboarding && user.onboardingCompleted) {
      // Onboarding already done → skip to dashboard
      router.replace('/(tabs)');
    }
      // Onboarding already done → skip to dashboard
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const signIn = async (email: string, pass: string) => {
    const data = await authApi.login(email, pass);
    await setItem('auth_token', data.accessToken);
    await setItem('user_data', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signUp = async (email: string, firstName: string, pass: string) => {
    const data = await authApi.register(email, firstName, pass);
    await setItem('auth_token', data.accessToken);
    await setItem('user_data', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    await removeItem('auth_token');
    await removeItem('user_data');
    setUser(null);
  };

  const markOnboardingComplete = async () => {
    if (!user) return;
    const updatedUser = { ...user, onboardingCompleted: true };
    await setItem('user_data', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, markOnboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
