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
//                     src="/logo.png"
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

//BELOW IS FUNCTIONING OLD CODE

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
// // --- Helper function to get the CSRF token from cookies ---
// // Django requires this for secure POST requests.
// const getCookie = (name: string) => {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }
//
// // --- Dashboard Component ---
// // This is the view for a logged-in user.
// const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
//     const [confirmingLogout, setConfirmingLogout] = useState(false);
//
//     const handleLogoutConfirm = async () => {
//         try {
//             const response = await fetch('http://localhost:8000/api/logout/', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken') || '',
//                 },
//             });
//
//             if (response.ok) {
//                 onLogout(); // This will update the state in the parent component
//             } else {
//                 console.error("Logout failed on the backend.");
//             }
//         } catch (error) {
//             console.error("Error during logout:", error);
//         }
//     };
//
//     return (
//         <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
//             <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-300">
//                 {confirmingLogout ? (
//                     // --- Logout Confirmation View ---
//                     <div>
//                         <h2 className="mb-4 text-xl font-bold text-gray-800">Sign Out</h2>
//                         <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>
//                         <div className="flex justify-center space-x-4">
//                             <button
//                                 onClick={() => setConfirmingLogout(false)}
//                                 className="rounded-md bg-gray-200 px-6 py-2 font-semibold text-black transition hover:bg-gray-300"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleLogoutConfirm}
//                                 className="rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
//                             >
//                                 Sign Out
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     // --- Default Dashboard View ---
//                     <div>
//                         <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome to Housify!</h1>
//                         <p className="mb-6 text-lg text-gray-600">
//                             You are logged in as <span className="font-semibold text-green-600">{user.username}</span>.
//                         </p>
//                         <div className="mt-8 space-y-4">
//                             <button className="w-full rounded-md bg-black px-6 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105">
//                                 Create a House
//                             </button>
//                             <button className="w-full rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-105">
//                                 Join a House
//                             </button>
//                         </div>
//                         <button
//                             onClick={() => setConfirmingLogout(true)}
//                             className="mt-8 inline-block text-sm font-medium text-gray-500 hover:text-black"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </main>
//     );
// };
//
//
// // --- Main Page Component ---
// export default function Home() {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/user/', {
//                     credentials: 'include',
//                 });
//                 if (response.ok) {
//                     setUser(await response.json());
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
//     if (loading) {
//         return (
//             <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
//                 <p className="text-2xl font-semibold text-gray-700">Loading...</p>
//             </main>
//         );
//     }
//
//     if (user) {
//         return <Dashboard user={user} onLogout={() => setUser(null)} />;
//     }
//
//     return (
//         <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4">
//             <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-2xl">
//                 <img
//                     src="/logo.png"
//                     alt="Housify Logo"
//                     width={200}
//                     height={200}
//                     className="mx-auto"
//                 />
//                 <h1 className="-mt-4 mb-2 text-3xl font-bold text-gray-900">
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

//new friend

"use client";

import React, { useState, useEffect, useRef ,useCallback } from 'react';

// --- Helper Types & Functions ---
interface User {
    username: string;
    email: string;
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
}

// --- Child Components ---

// #1: The Dashboard Component (Unchanged)
const Dashboard = ({ user, showCreateHouseView, showJoinHouseView ,onLogout}: { user: User; showCreateHouseView: () => void; showJoinHouseView: () => void;  onLogout: () => void;}) => {
    // NEW: State to manage the logout confirmation view
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    // NEW: Function to handle the final logout action
    const handleLogoutConfirm = async () => {
        console.log("Attempting to log out...");
        try {
            const response = await fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRFToken': getCookie('csrftoken') || '' },
            });
            if (response.ok) {
                console.log("Logout successful on backend.");
                onLogout(); // This calls the function in the parent Home component
            } else {
                console.error("Logout failed on the backend.");
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            {/* NEW: Conditional rendering for the logout confirmation */}
            {confirmingLogout ? (
                <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-800">Sign Out</h2>
                    <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setConfirmingLogout(false)}
                            className="w-full rounded-md bg-gray-200 px-6 py-2 font-semibold text-black transition hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogoutConfirm}
                            className="w-full rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome, {user.username}!</h1>
                    <p className="mb-8 text-gray-600">You're not part of a house yet.</p>
                    <div className="space-y-4">
                        <button
                            onClick={showCreateHouseView}
                            className="w-full rounded-md bg-black px-6 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105">
                            Create a House
                        </button>
                        <button
                            onClick={showJoinHouseView}
                            className="w-full rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-black transition-transform duration-200 hover:scale-105">
                            Join a House
                        </button>
                    </div>
                    {/* NEW: Logout button */}
                    <button
                        onClick={() => setConfirmingLogout(true)}
                        className="mt-8 text-sm font-medium text-gray-500 hover:text-red-600"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};


// #2: The Create House Form Component (Updated)
const CreateHouse = ({ showDashboardView }: { showDashboardView: () => void; }) => {
    const [houseName, setHouseName] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState(false);
    // useEffect for debounced API call (logic is unchanged)
    useEffect(() => {
        if (houseName.length < 3) {
            setSuggestions([]);
            setIsSuggesting(false); // Ensure loading is off for short text
            return;
        }
        setIsSuggesting(true);
        setSuggestionError(false);
        const handler = setTimeout(() => {
            fetch('http://localhost:8000/api/houses/suggest-name/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') || '' },
                body: JSON.stringify({ name: houseName }),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Backend responded with an error');
                    }
                    return res.json();
                })
                .then(data => setSuggestions(data.suggestions || []))
                .catch(error => {
                    console.error("Error fetching suggestions:", error);
                    setSuggestions([]);
                    setSuggestionError(true);
                })
                .finally(() => setIsSuggesting(false));
        }, 700);
        return () => clearTimeout(handler);
    }, [houseName]);

    const handleSuggestionClick = (suggestion: string) => {
        setHouseName(suggestion);
        setSuggestions([]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Creating house with name: ${houseName}`);
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">Create a New House</h1>
            <p className="mb-6 text-gray-600">Give your new home a name.</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="relative">
                    <input
                        type="text"
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                        placeholder="e.g., The Burrow"
                        className="w-full rounded-md border border-gray-300 px-4 py-3 text-lg"
                        required
                        autoComplete="off"
                    />
                    {houseName.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                            {suggestionError ? (
                                <p className="px-4 py-2 text-sm text-red-500">No suggestions at the moment</p>
                            ) : houseName.length < 3 ? (
                                <p className="px-4 py-2 text-sm text-gray-500">No suggestions</p>
                            ) : isSuggesting ? (
                                <p className="px-4 py-2 text-sm text-gray-500">Getting AI suggestions...</p>
                            ) : (
                                suggestions.map((s, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(s)}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                    >
                                        {s}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/*    /!* --- UPDATED Suggestions Dropdown Logic --- *!/*/}
                {/*    {houseName.length > 0 && (*/}
                {/*        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">*/}
                {/*            /!* Condition 1: Input is too short *!/*/}
                {/*            {houseName.length < 3 && (*/}
                {/*                <p className="px-4 py-2 text-sm text-gray-500">No suggestions</p>*/}
                {/*            )}*/}
                {/*            /!* Condition 2: Input is long enough and we are fetching *!/*/}
                {/*            {houseName.length >= 3 && isSuggesting && (*/}
                {/*                <p className="px-4 py-2 text-sm text-gray-500">Getting AI suggestions...</p>*/}
                {/*            )}*/}
                {/*            /!* Condition 3: We are done fetching and have suggestions *!/*/}
                {/*            {houseName.length >= 3 && !isSuggesting && suggestions.map((s, index) => (*/}
                {/*                <div*/}
                {/*                    key={index}*/}
                {/*                    onClick={() => handleSuggestionClick(s)}*/}
                {/*                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"*/}
                {/*                >*/}
                {/*                    {s}*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={showDashboardView} className="w-full rounded-md bg-gray-200 px-6 py-3 font-semibold">Cancel</button>
                    <button type="submit" className="w-full rounded-md bg-black px-6 py-3 font-semibold text-white">Create</button>
                </div>
            </form>
        </div>
    );
};

// #3: The Join House Form Component (Unchanged)
// #3: The Join House Form Component (UPDATED with 6-digit input)
const JoinHouse = ({ showDashboardView }: { showDashboardView: () => void; }) => {
    // NEW: State to hold an array of 6 empty strings for each digit
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    // NEW: An array of refs to easily access each input box
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // NEW: Function to handle input change for each digit box
    const handleChange = (element: HTMLInputElement, index: number) => {
        // Ensure only single digit is entered and it's a number
        if (isNaN(Number(element.value))) return;

        // Update the OTP array at the specific index
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus to the next input box if a digit was entered
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // NEW: Function to handle backspace/delete key presses
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // If backspace/delete on an empty box, move to previous box
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fullOtp = otp.join(''); // Combine the digits into a single string

        if (fullOtp.length !== 6) {
            alert('Please enter a complete 6-digit code.');
            return;
        }

        console.log("Attempting to join house with code:", fullOtp);

        try {
            const response = await fetch('http://localhost:8000/api/houses/use-invite/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({ code: fullOtp }), // Send the combined OTP
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.ok) {
                alert(`Successfully joined house: ${data.name}`);
                showDashboardView(); // Go back to the dashboard
            } else {
                alert(`Error: ${data.error || 'Failed to join house'}`);
            }
        } catch (error) {
            console.error("Error joining house:", error);
            alert("An error occurred. Please check the console.");
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl text-white"> {/* Changed background to black and text to white for design */}
            <div className="flex justify-center mb-6">
                <img src="/lock_icon.png" alt="Lock Icon" className="w-16 h-16" /> {/* Placeholder for lock icon */}
            </div>
            <h1 className="mb-2 text-3xl font-bold">Enter your Verification Code</h1>
            {/* You can replace this with actual phone number if passed as prop */}
            <p className="mb-8 text-gray-400">We sent a verification code.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center space-x-2"> {/* Container for OTP boxes */}
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text" // Use text to allow backspace correctly
                            maxLength={1} // Only one character per box
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            // NEW: Assign ref to each input for easy access
                            ref={el => inputRefs.current[index] = el}
                            className="w-12 h-14 text-3xl text-center rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 caret-transparent" // Styling for boxes
                            inputMode="numeric" // Suggest numeric keyboard on mobile
                        />
                    ))}
                </div>
                <p className="text-gray-400 text-sm">
                    Ask your House admin for the code! {/* Resend button */}
                </p>
                <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={showDashboardView} className="w-full rounded-md bg-gray-700 px-6 py-3 font-semibold text-white">Cancel</button>
                    <button type="submit" className="w-full rounded-md bg-green-600 px-6 py-3 font-semibold text-white">Verify</button>
                </div>
            </form>
        </div>
    );
};


// --- The Main Parent Component ---
export default function Home() {
    // State to hold the user data, loading status, and current view
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('DASHBOARD');

    // This useEffect runs once when the component first loads
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Check with the backend if a user is logged in
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
                setLoading(false); // Stop loading once the check is complete
            }
        };
        fetchUser();
    }, []); // The empty array [] ensures this runs only once

    // Helper function to decide which logged-in view to show
    const renderView = () => {
        if (!user) return null; // Safety check

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

    // First check: If we are still loading, show a loading message.
    if (loading) {
        return <main className="flex min-h-screen flex-col items-center justify-center bg-green-50"><p>Loading...</p></main>;
    }

    // Second check: If loading is done AND we have a user, show the logged-in experience.
    if (user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
                {renderView()}
            </main>
        );
    }

    // Final case: If not loading and no user, show the Sign-In page.
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
                        {/* Google Icon SVG Paths */}
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