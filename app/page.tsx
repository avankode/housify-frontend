// "use client"; // This must be a client component to use hooks
//
// import React, { useState, useEffect } from 'react';
//
// // Define a type for the user data we expect from the backend
// interface User {
//     username: string;
//     email: string;
// }
//
// // --- Dashboard Component ---
// // This is the view for a logged-in user.
// const Dashboard = ({ user }: { user: User }) => {
//     return (
//         <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
//             <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
//                 <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome to Housify!</h1>
//                 <p className="mb-6 text-lg text-gray-600">
//                     You are logged in as <span className="font-semibold text-green-600">{user.username}</span>.
//                 </p>
//                 <div className="mt-8 space-y-4">
//                     <button className="w-full rounded-md bg-black px-6 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105">
//                         Create a House
//                     </button>
//                     <button className="w-full rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-105">
//                         Join a House
//                     </button>
//                 </div>
//                 <a
//                     href="http://localhost:8000/accounts/logout/"
//                     className="mt-8 inline-block text-sm font-medium text-gray-500 hover:text-black"
//                 >
//                     Logout
//                 </a>
//             </div>
//         </main>
//     );
// };
//
//
// // --- Main Page Component ---
// // This component decides whether to show the Login page or the Dashboard.
// export default function Home() {
//     // State to hold the user data and loading status
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     // useEffect runs when the component mounts to check the user's login status
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/user/', {
//                     credentials: 'include', // IMPORTANT: This sends the session cookie
//                 });
//
//                 if (response.ok) {
//                     const userData = await response.json();
//                     setUser(userData);
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
//
//         fetchUser();
//     }, []); // The empty array ensures this runs only once
//
//     // --- Conditional Rendering Logic ---
//
//     if (loading) {
//         return (
//             <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
//                 <p className="text-2xl font-semibold text-gray-700">Loading...</p>
//             </main>
//         );
//     }
//
//     if (user) {
//         return <Dashboard user={user} />;
//     }
//
//     return (
//         <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
//             <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-2xl">
//                 <img
//                     src="/housifylogo.png"
//                     alt="Housify Logo"
//                     width={250}
//                     height={250}
//                     className="mx-auto"
//                 />
//                 <h1 className="mb-2 text-3xl font-bold text-gray-900">
//                     Welcome to <span className="text-green-600">Housify</span>
//                 </h1>
//                 <p className="mb-8 text-gray-600">Your shared home, simplified.</p>
//
//                 <a
//                     href="http://localhost:8000/accounts/google/login/"
//                     className="group inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105"
//                 >
//                     <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
//                         <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
//                         <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
//                         <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.127-8.481l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
//                         <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.856 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
//                     </svg>
//                     Sign In with Google
//                 </a>
//             </div>
//         </main>
//     );
// }
//

"use client"; // This must be a client component to use hooks

import React, { useState, useEffect } from 'react';

// Define a type for the user data we expect from the backend
interface User {
    username: string;
    email: string;
}

// --- Helper function to get the CSRF token from cookies ---
// Django requires this for secure POST requests.
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
}

// --- Dashboard Component ---
// This is the view for a logged-in user.
const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const handleLogoutConfirm = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
            });

            if (response.ok) {
                onLogout(); // This will update the state in the parent component
            } else {
                console.error("Logout failed on the backend.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-300">
                {confirmingLogout ? (
                    // --- Logout Confirmation View ---
                    <div>
                        <h2 className="mb-4 text-xl font-bold text-gray-800">Sign Out</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setConfirmingLogout(false)}
                                className="rounded-md bg-gray-200 px-6 py-2 font-semibold text-black transition hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                className="rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- Default Dashboard View ---
                    <div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome to Housify!</h1>
                        <p className="mb-6 text-lg text-gray-600">
                            You are logged in as <span className="font-semibold text-green-600">{user.username}</span>.
                        </p>
                        <div className="mt-8 space-y-4">
                            <button className="w-full rounded-md bg-black px-6 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105">
                                Create a House
                            </button>
                            <button className="w-full rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-105">
                                Join a House
                            </button>
                        </div>
                        <button
                            onClick={() => setConfirmingLogout(true)}
                            className="mt-8 inline-block text-sm font-medium text-gray-500 hover:text-black"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};


// --- Main Page Component ---
export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/', {
                    credentials: 'include',
                });
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

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
                <p className="text-2xl font-semibold text-gray-700">Loading...</p>
            </main>
        );
    }

    if (user) {
        return <Dashboard user={user} onLogout={() => setUser(null)} />;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-2xl">
                <img
                    src="/logo.png"
                    alt="Housify Logo"
                    width={200}
                    height={200}
                    className="mx-auto"
                />
                <h1 className="-mt-4 mb-2 text-3xl font-bold text-gray-900">
                    Welcome to <span className="text-green-600">Housify</span>
                </h1>
                <p className="mb-8 text-gray-600">Your shared home, simplified.</p>

                <a
                    href="http://localhost:8000/accounts/google/login/"
                    className="group inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105"
                >
                    <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.127-8.481l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.856 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                    Sign In with Google
                </a>
            </div>
        </main>
    );
}

