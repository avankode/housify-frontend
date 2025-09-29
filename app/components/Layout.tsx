"use client";

import React from 'react';

const Layout = ({ children, houseName, onLogout }: {
    children: React.ReactNode;
    houseName: string;
    onLogout?: () => void;
}) => {
    return (
        <div className="min-h-screen w-full bg-green-50">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Housify Logo" className="h-12 w-12 mr-3" />
                            <span className="text-2xl font-bold text-gray-800">Housify</span>
                        </div>
                        <div className="flex items-center">
                            <div className="text-2xl font-semibold text-gray-700 mr-6">
                                {houseName}
                            </div>
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
};

export default Layout;