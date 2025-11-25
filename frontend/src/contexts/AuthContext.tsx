import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse, TokenResponse } from '../types/auth';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
    updateTokens: (tokens: TokenResponse) => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (authResponse: AuthResponse) => {
        const { tokens, ...userData } = authResponse;
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setUser(userData);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateTokens = (tokens: TokenResponse) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        updateTokens,
        updateUser,
        isAuthenticated: !!accessToken && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
