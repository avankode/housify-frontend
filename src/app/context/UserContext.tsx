"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserWithHouse } from '../utils';

interface UserContextType {
    user: UserWithHouse | null;
    isLoading: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/', '/login']; 
const ONBOARDING_PATHS = ['/onboarding-user', '/onboarding-house'];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserWithHouse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUserAndRedirect = useCallback(async () => {
        setIsLoading(true); // Start loading
        const isPublic = PUBLIC_PATHS.includes(pathname);
        const isOnboarding = ONBOARDING_PATHS.includes(pathname);

        // 1. If we are on a PUBLIC page, we don't need to fetch a user.
        if (isPublic) {
            setUser(null);
            setIsLoading(false);
            return; // Stop here. This prevents the loop.
        }

        // 2. We are on a PRIVATE or ONBOARDING page. We MUST fetch the user.
        let currentUser: UserWithHouse | null = null;
        try {
            const response = await fetch('http://localhost:8000/api/user', {
                method: 'GET',
                credentials: 'include', 
            });
            
            if (response.ok) {
                currentUser = await response.json();
                setUser(currentUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Fetch user error:", error);
            setUser(null);
        }

        // 3. --- REDIRECT LOGIC (runs after fetch) ---
        // (This part will now work because the backend is fixed)
        


        if (currentUser?.profile && !currentUser?.display_name) {
            if (pathname !== '/onboarding-user') {
                router.push('/onboarding-user');
            }
            return;
        }

        if (!currentUser?.house) {
            if (pathname !== '/onboarding-house') {
                router.push('/onboarding-house');
            }
            return;
        }

        if (isOnboarding) {
            router.push('/home');
        }
        
        setIsLoading(false); // Stop loading

    }, [pathname, router]);

    // This re-runs on every path change
    useEffect(() => {
        fetchUserAndRedirect();
    }, [fetchUserAndRedirect]);


    const logout = async () => {
        // ... (logout logic is correct)
        try {
            await fetch('http://localhost:8000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error("Error during backend logout:", error);
        } finally {
            setUser(null);
            router.push('/');
        }
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