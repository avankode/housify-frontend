// "use client";
//
// import React, { useState, useEffect } from 'react';
// import { UserWithHouse, House } from './utils';
// import Dashboard from './components/Dashboard';
// import CreateHouse from './components/CreateHouse';
// import JoinHouse from './components/JoinHouse';
// import LoginPage from './components/LoginPage';
// import MainApp from './components/MainApp';
//
// export default function Home() {
//     const [user, setUser] = useState<UserWithHouse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [view, setView] = useState('DASHBOARD');
//     const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setUser(data);
//                     if (data.house) {
//                         setShowWelcomeAnimation(true);
//                     }
//                 } else {
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch user:", error);
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, []);
//
//     const handleHouseSuccess = (newHouseData: House) => {
//         // Set the flag to trigger the animation first
//         setShowWelcomeAnimation(true);
//         // Then, update the user object. This order is more reliable for React's state updates.
//         setUser(prevUser => prevUser ? { ...prevUser, house: newHouseData } : null);
//     };
//
//     const renderPreHouseView = () => {
//         if (!user) return null;
//         switch (view) {
//             case 'CREATE_HOUSE':
//                 return <CreateHouse showDashboardView={() => setView('DASHBOARD')} onSuccess={handleHouseSuccess} />;
//             case 'JOIN_HOUSE':
//                 return <JoinHouse showDashboardView={() => setView('DASHBOARD')} onSuccess={handleHouseSuccess} />;
//             default:
//                 return <Dashboard
//                     user={user}
//                     showCreateHouseView={() => setView('CREATE_HOUSE')}
//                     showJoinHouseView={() => setView('JOIN_HOUSE')}
//                     onLogout={() => setUser(null)}
//                 />;
//         }
//     };
//
//     if (loading) {
//         return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading...</p></main>;
//     }
//
//     return (
//         <div className="min-h-screen bg-green-50">
//             {
//                 !user ? <LoginPage /> :
//                     user.house ? <MainApp
//                             userData={user}
//                             onLogout={() => setUser(null)}
//                             showAnimation={showWelcomeAnimation}
//                         /> :
//                         <div className="flex min-h-screen items-center justify-center p-8">{renderPreHouseView()}</div>
//             }
//         </div>
//     );
// }

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- Helper Types & Functions ---
interface House {
    id: number;
    name: string;
}

interface UserWithHouse {
    username: string;
    email: string;
    house: House | null;
}

const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// --- Child Component: LoginPage ---
const LoginPage = () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-2xl">
            <img src="/logo.png" alt="Housify Logo" width={200} height={200} className="mx-auto" />
            <h1 className="-mt-4 mb-2 text-3xl font-bold text-gray-900">Welcome to <span className="text-green-600">Housify</span></h1>
            <p className="mb-8 text-gray-600">Your shared home, simplified.</p>
            <a href="http://localhost:8000/accounts/google/login/" className="group inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105">
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.127-8.481l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.856 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                Sign In with Google
            </a>
        </div>
    </div>
);

// --- Child Component: Layout ---
const Layout = ({ children, houseName, onLogout }: {
    children: React.ReactNode;
    houseName: string;
    onLogout?: () => void;
}) => (
    <div className="min-h-screen w-full bg-green-50">
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">

                    {/* Column 1: Logo */}
                    <div className="w-1/3">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Housify Logo" className="h-25 w-45" />
                            {/* The "Housify" text span has been removed from here */}
                        </div>
                    </div>

                    {/* Column 2: House Name (centered) */}
                    <div className="w-1/3 text-center">
                        <div className="text-2xl font-semibold text-gray-700 mt-4">
                            {houseName}
                        </div>
                    </div>

                    {/* Column 3: Sign Out Button (right-aligned) */}
                    <div className="w-1/3 flex justify-end">
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-300"
                            >
                                Sign Out
                            </button>
                        )}
                    </div>

                </div>
            </nav>
        </header>

        <main className="container mx-auto px-6 py-8">
            {children}
        </main>
    </div>
);
// --- Child Component: MainApp ---
const MainApp = ({ userData, onLogout, showAnimation }: { userData: UserWithHouse; onLogout: () => void; showAnimation: boolean; }) => {
    const [animationPhase, setAnimationPhase] = useState('hidden');
    const [isAnimationVisible, setIsAnimationVisible] = useState(false);

    useEffect(() => {
        let visibleTimer: NodeJS.Timeout;
        let fadeTimer: NodeJS.Timeout;
        let hideTimer: NodeJS.Timeout;

        if (showAnimation) {
            setIsAnimationVisible(true);
            visibleTimer = setTimeout(() => setAnimationPhase('visible'), 100);
            fadeTimer = setTimeout(() => setAnimationPhase('fading'), 3000);
            hideTimer = setTimeout(() => setIsAnimationVisible(false), 4000);
            return () => {
                clearTimeout(visibleTimer);
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [showAnimation]);

    if (!userData.house) return null;

    return (
        <Layout houseName={userData.house.name} onLogout={onLogout}>
            {isAnimationVisible && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-green-50 bg-opacity-90 backdrop-blur-sm">
                    <h1 className={`text-5xl font-bold text-gray-800 transition-all duration-1000 ${animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                        Hey {userData.username}, Welcome to {userData.house.name}!
                    </h1>
                </div>
            )}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Main Dashboard</h1>
                <p className="mt-4 text-lg text-gray-600">This is where we will build the tabs for Queues, Laundry, and Expenses.</p>
            </div>
        </Layout>
    );
};

// --- Main Controller Component ---
export default function Home() {
    const [user, setUser] = useState<UserWithHouse | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('DASHBOARD');
    const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    if (data.house) {
                        setShowWelcomeAnimation(true);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) { console.error("Failed to fetch user:", error); setUser(null); }
            finally { setLoading(false); }
        };
        fetchUser();
    }, []);

    const handleHouseSuccess = (newHouseData: House) => {
        setShowWelcomeAnimation(true);
        setUser(prevUser => prevUser ? { ...prevUser, house: newHouseData } : null);
    };

    const renderPreHouseView = () => {
        // Placeholder for brevity. You would have your full CreateHouse and JoinHouse components defined here.
        if (!user) return null;
        return <div>Pre-house dashboard for {user.username}</div>;
    };

    if (loading) {
        return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading...</p></main>;
    }

    return (
        <div className="min-h-screen bg-green-50">
            {
                !user ? <LoginPage /> :
                    user.house ? <MainApp userData={user} onLogout={() => setUser(null)} showAnimation={showWelcomeAnimation} /> :
                        <div className="flex min-h-screen items-center justify-center p-8">{renderPreHouseView()}</div>
            }
        </div>
    );
}