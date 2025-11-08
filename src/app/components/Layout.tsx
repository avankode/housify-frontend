"use client";

import React , { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
const Layout = ({ children, houseName, onLogout }: {
    children: React.ReactNode;
    houseName: string;
    onLogout?: () => void;
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return (
        <div className="min-h-screen w-full bg-green-50">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-4 py-2">
                    <div className="grid grid-cols-3 items-center">

                        {/* 1. Left Column: Logo */}
                        <div className="justify-self-start">
                            <Link href="/home">
                                <img
                                    src="/logo.png"
                                    alt="Housify Logo"
                                    className="h-16 w-15 cursor-pointer"
                                />
                            </Link>
                        </div>

                        {/* 2. Center Column: House Name */}
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {houseName}
                            </h1>
                        </div>

                        {/* 3. Right Column: Drawer Button */}
                        {/* THIS IS THE FIX: Replaced flexbox classes with grid alignment */}
                        <div className="justify-self-end">
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                aria-label="Open menu"
                            >
                                <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </nav>
            </header>

            <main >
                {children}
            </main>

            {/* Backdrop for Drawer */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsDrawerOpen(false)}
            ></div>

            {/* Drawer Content */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Menu</h2>
                    <nav className="flex flex-col space-y-4">
                        <Link href="/profile" onClick={() => setIsDrawerOpen(false)} className="flex items-center text-lg text-gray-700 hover:text-green-600 py-2 rounded-md hover:bg-gray-100">
                            <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </Link>

                        <Link href="/settings" onClick={() => setIsDrawerOpen(false)} className="flex items-center text-lg text-gray-700 hover:text-green-600 py-2 rounded-md hover:bg-gray-100">
                            <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </Link>

                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="flex items-center text-lg text-gray-700 hover:text-green-600 w-full text-left py-2 rounded-md hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Layout;