"use client";

import React from 'react';
import Link from 'next/link';

const Layout = ({ children, houseName, onLogout }: {
    children: React.ReactNode;
    houseName: string;
    onLogout?: () => void;
}) => {
    return (
        <div className="min-h-screen w-full bg-green-50">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-4 py-2">
                    {/* NEW: Using a 3-column grid for alignment */}
                    <div className="grid grid-cols-3 items-center">

                        <div className="justify-self-start">
                            <Link href="/home?new=true">
                                <img
                                    src="/logo.png"
                                    alt="Housify Logo"
                                    className="h-16 w-15 cursor-pointer" // Added cursor-pointer for better UX
                                />
                            </Link>
                        </div>

                        {/* 2. Center Column: House Name */}
                        <div className="text-center">
                            <h1 className="text-xl font text-gray-800">
                                {houseName}
                            </h1>
                        </div>

                        {/* 3. Right Column: Sign Out Button */}
                        <div className="justify-self-end">
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
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
};

export default Layout;
