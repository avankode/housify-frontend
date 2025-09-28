// frontend/app/components/Layout.tsx

"use client";

import React from 'react';

// The Layout component accepts 'children' and 'houseName' as props.
// 'children' will be the specific content of whatever page is using the layout.
const Layout = ({ children, houseName }: { children: React.ReactNode; houseName: string; }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Housify Logo */}
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Housify Logo" className="h-25 w-45 mr-1" />
                            {/*<span className="text-2xl font-bold text-gray-    800">Housify</span>*/}
                        </div>
                        {/* House Name */}
                        <div className="text-xl font-semibold text-gray-700">
                            {houseName}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            {/* The page-specific content (passed in as 'children') will be rendered here */}
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;