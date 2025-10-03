

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import {getCookie} from "@/src/app/utils";


// Interface definitions remain the same
interface House {
    id: number;
    name: string;
}
interface UserWithHouse {
    username: string;
    email: string;
    house: House | null;
}

export default function HomePage() {
    const [userData, setUserData] = useState<UserWithHouse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('hidden');

    const searchParams = useSearchParams();
    const router = useRouter();

    // The login bug from your original code is also fixed here.
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    if (searchParams.get('new') === 'true') {
                        setShowAnimation(true);
                    }
                } else {
                    // This correctly redirects only if the user isn't logged in
                    router.push('/');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [router, searchParams]);


    // Animation effect remains the same
    useEffect(() => {
        if (showAnimation) {
            const visibleTimer = setTimeout(() => setAnimationPhase('visible'), 100);
            const fadeTimer = setTimeout(() => setAnimationPhase('fading'), 3000);
            const hideTimer = setTimeout(() => setShowAnimation(false), 4000);

            return () => {
                clearTimeout(visibleTimer);
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [showAnimation]);

    // Redirect effect remains the same
    useEffect(() => {
        if (!loading && userData && !userData.house) {
            router.push('/error-session');
        }
    }, [loading, userData, router]);

    // NEW: Function to handle user sign-out
    const handleLogout = async () => {
        try {
            // Call your backend logout endpoint. Adjust the URL if it's different.
            await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include', // Important to send the session cookie
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') || '' },
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            router.push('/login');
        }
    };

    if (loading) {
        return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100"><p>Loading...</p></main>;
    }

    // Guard clause to prevent rendering while redirecting
    if (!userData || !userData.house) {
        return null;
    }

    return (
        // UPDATED: Pass the handleLogout function as a prop
        <Layout houseName={userData.house.name} onLogout={handleLogout}>
            {showAnimation && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-100 bg-opacity-100">
                    <h1 className={`text-4xl font-bold text-gray-800 transition-all duration-1000 ${
                        animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                    }`}
                    >
                        Hey, {userData.username}! Welcome to {userData.house.name}!
                    </h1>
                </div>
            )}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">
                    Main Dashboard
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    This is where we will build the tabs for Queues, Laundry, and Expenses.
                </p>
            </div>
        </Layout>
    );
}