'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation, useQuery } from '@apollo/client';

interface User {
  id: string;
  email: string;
  companyName: string;
  businessType: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        companyName
        businessType
        firstName
        lastName
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        companyName
        businessType
        firstName
        lastName
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      companyName
      businessType
      firstName
      lastName
    }
  }
`;

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const { loading, error, data } = useQuery(ME_QUERY, {
    skip: typeof window !== 'undefined' && !localStorage.getItem('token'),
  });

  useEffect(() => {
    if (data?.me) {
      setAuthState({
        user: data.me,
        loading: false,
        error: null,
      });
    } else if (error) {
      setAuthState({
        user: null,
        loading: false,
        error,
      });
    } else if (!loading) {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  }, [data, loading, error]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        setAuthState({
          user: data.login.user,
          loading: false,
          error: null,
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error,
      });
      throw error;
    }
  };

  const register = async (registerData: any) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: registerData,
        },
      });

      if (data.register.token) {
        localStorage.setItem('token', data.register.token);
        setAuthState({
          user: data.register.user,
          loading: false,
          error: null,
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
    router.push('/');
  };

  const contextValue = {
    ...authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 