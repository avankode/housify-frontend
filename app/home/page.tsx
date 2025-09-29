// frontend/app/home/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams ,useRouter } from 'next/navigation'; // NEW: Import to read URL parameters
import Layout from '../components/Layout';
// ... (Interface definitions remain the same)
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

    // NEW: State variables to control the welcome animation
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('hidden'); // 'hidden', 'visible', 'fading'

    const searchParams = useSearchParams(); // NEW: Hook to access URL parameters
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);

                    // NEW: Check if we should trigger the animation
                    if (searchParams.get('new') === 'true') {
                        setShowAnimation(true);
                    }else {
                        // If the response is not 'ok', the user is not logged in.
                        // Redirect them to the main login page.
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []); // This effect runs only once on page load

    // NEW: A separate effect to manage the animation timing
    useEffect(() => {
        if (showAnimation) {
            // Phase 1: Make the text visible
            const visibleTimer = setTimeout(() => setAnimationPhase('visible'), 100); // 100ms delay to ensure transition applies

            // Phase 2: After 3 seconds, start fading out
            const fadeTimer = setTimeout(() => setAnimationPhase('fading'), 3000);

            // Phase 3: After 4 seconds (fade is complete), hide the animation component
            const hideTimer = setTimeout(() => setShowAnimation(false), 4000);

            // Cleanup function to clear timers if the component unmounts
            return () => {
                clearTimeout(visibleTimer);
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [showAnimation]);

    if (loading) {
        return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100"><p>Loading...</p></main>;
    }
    if (!userData) {
        return null; // Or a loading spinner
    }
    if (!userData.house) {
        // This is now the ONLY place this message can appear, and only for logged-in users.
        return (<main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
            <p>You are not a member of a house yet. Please go back to create or join one.</p>
        </main>
        );
    }
    //if user exsits and has house as well
    return (
        <Layout houseName={userData.house.name}>
            {showAnimation && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-100 bg-opacity-90">
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

