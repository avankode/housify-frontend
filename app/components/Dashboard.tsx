"use client";

import React from 'react';

// Define a type for the user data we expect from the backend
interface User {
    username: string;
    email: string;
}

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    // Add a defensive check to prevent rendering if the user prop is not available
    if (!user) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome to Housify!</h1>
                <p className="mb-6 text-lg text-gray-600">
                    You are logged in as <span className="font-semibold text-green-600">{user.username}</span>.
                </p>
                <a
                    href="http://localhost:8000/accounts/logout/"
                    className="inline-block rounded-md bg-black px-6 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105"
                >
                    Logout
                </a>
            </div>
        </main>
    );
};

export default Dashboard;