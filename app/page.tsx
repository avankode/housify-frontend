"use client";

import React, { useState, useEffect } from 'react';
import { User } from './utils'; // Import from our new utils file
import Dashboard from './components/Dashboard';
import CreateHouse from './components/CreateHouse';
import JoinHouse from './components/JoinHouse';
import LoginPage from './components/LoginPage';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('DASHBOARD');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
                if (response.ok) {
                    setUser(await response.json());
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const renderView = () => {
        if (!user) return null;

        switch (view) {
            case 'CREATE_HOUSE':
                return <CreateHouse showDashboardView={() => setView('DASHBOARD')} />;
            case 'JOIN_HOUSE':
                return <JoinHouse showDashboardView={() => setView('DASHBOARD')} />;
            default:
                return <Dashboard
                    user={user}
                    showCreateHouseView={() => setView('CREATE_HOUSE')}
                    showJoinHouseView={() => setView('JOIN_HOUSE')}
                    onLogout={() => setUser(null)}
                />;
        }
    };

    if (loading) {
        return <main className="flex min-h-screen flex-col items-center justify-center bg-green-50"><p>Loading...</p></main>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
            {user ? renderView() : <LoginPage />}
        </main>
    );
}