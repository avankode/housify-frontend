"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from './utils'; // Import from our new utils file
import Dashboard from './components/Dashboard';
import CreateHouse from './components/CreateHouse';
import JoinHouse from './components/JoinHouse';
import LoginPage from './components/LoginPage';


interface House {
    id: number;
    name: string;
}
interface UserWithHouse {
    username: string;
    email: string;
    house: House | null;
}


export default function Home() {
    // const [user, setUser] = useState<User | null>(null);
    const [user, setUser] = useState<UserWithHouse | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('DASHBOARD');
    const router = useRouter();

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

    useEffect(() => {
        // If we have a user and that user is already in a house...
        if (user && user.house.name) {
            // ...redirect them straight to the main dashboard.
            router.push('/home');
        }
    }, [user]); // This effect runs whenever the 'user' object changes

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

// frontend/app/home/page.tsx

// "use client";
//
// import React, { useState, useEffect } from 'react';
// import Layout from './components/Layout'; // NEW: Import the Layout component
// import { useSearchParams, useRouter } from 'next/navigation';
// // ... (Interface definitions remain the same)
// interface House {
//     id: number;
//     name: string;
// }
// interface UserWithHouse {
//     username: string;
//     email: string;
//     house: House | null;
// }
//
// export default function HomePage() {
//     const [userData, setUserData] = useState<UserWithHouse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [showAnimation, setShowAnimation] = useState(false);
//     const [animationPhase, setAnimationPhase] = useState('hidden');
//
//     const searchParams = useSearchParams();
//     const router = useRouter();
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setUserData(data);
//                     if (searchParams.get('new') === 'true') {
//                         setShowAnimation(true);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//                 router.push('/error-session' +
//                     '');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUserData();
//     }, []);
//
//     useEffect(() => {
//         if (showAnimation) {
//             const visibleTimer = setTimeout(() => setAnimationPhase('visible'), 100);
//             const fadeTimer = setTimeout(() => setAnimationPhase('fading'), 3000);
//             const hideTimer = setTimeout(() => setShowAnimation(false), 4000);
//             return () => {
//                 clearTimeout(visibleTimer);
//                 clearTimeout(fadeTimer);
//                 clearTimeout(hideTimer);
//             };
//         }
//     }, [showAnimation]);
//
//     if (loading) {
//         return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100"><p>Loading...</p></main>;
//     }
//
//     if (!userData || !userData.house) {
//         return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100"><p>You are not a member of a house yet.</p></main>;
//     }
//
//     // The entire page is now wrapped in our new Layout component
//     return (
//         <Layout houseName={userData.house.name}>
//             {/* The animation layer */}
//             {showAnimation && (
//                 <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-100 bg-opacity-90">
//                     <h1 className={`text-4xl font-bold text-gray-800 transition-all duration-1000 ${
//                         animationPhase === 'visible' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
//                     }`}
//                     >
//                         Hey, {userData.username}! Welcome to {userData.house.name}!
//                     </h1>
//                 </div>
//             )}
//
//             {/* The page-specific content goes here */}
//             <div className="text-center">
//                 <h1 className="text-4xl font-bold text-gray-800">
//                     Main Dashboard
//                 </h1>
//                 <p className="mt-4 text-lg text-gray-600">
//                     This is where we will build the tabs for Queues, Laundry, and Expenses.
//                 </p>
//             </div>
//         </Layout>
//     );
// }