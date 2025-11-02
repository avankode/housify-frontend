"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter ,usePathname } from 'next/navigation';
import { UserWithHouse } from '../utils';
import { API_BASE } from '@/utils/apiBase';

// Define the shape of our context data
interface UserContextType {
    user: UserWithHouse | null;
    isLoading: boolean;
    logout: () => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/', '/login', '/login/success']; 
const ONBOARDING_PATHS = ['/onboarding-user', '/onboarding-house'];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserWithHouse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('apiToken');
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/user/`, {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
                localStorage.removeItem('apiToken');
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!PUBLIC_PATHS.includes(pathname)) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [pathname, fetchUser]);

    useEffect(() => {
        if (isLoading) {
            return; 
        }

        const isPublic = PUBLIC_PATHS.includes(pathname);
        const isOnboarding = ONBOARDING_PATHS.includes(pathname);

        if (!user) {
            if (!isPublic) {
                router.push('/');
            }
            return;
        }

        if (user.profile && !user.profile.display_name) {
            if (pathname !== '/onboarding-user') {
                router.push('/onboarding-user');
            }
            return;
        }

        if (!user.house) {
            if (pathname !== '/onboarding-house') {
                router.push('/onboarding-house');
            }
            return;
        }

        if (isPublic || isOnboarding) {
            router.push('/home');
        }

    }, [user, isLoading, router, pathname]);

    const logout = async () => {
        const token = localStorage.getItem('apiToken');
        if (token) {
            try {
                await fetch(`${API_BASE}/api/logout/`, {
                    method: 'POST',
                    credentials: 'omit',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            } catch (error) {
                console.error("Error during backend logout:", error);
            }
        }
        localStorage.removeItem('apiToken');
        setUser(null);
    };

    const value = { user, isLoading, logout };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};