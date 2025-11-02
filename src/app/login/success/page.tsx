import React, { Suspense } from 'react';
import LoginSuccessClient from './login-success-client'; // Import the component you just renamed

// A simple loading component to show while Suspense is waiting
function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-green-50">
            <p className="text-lg text-gray-700">Loading...</p>
        </main>
    );
}

// This is the new page.
// It wraps your client component in <Suspense>
export default function LoginSuccessPage() {
    return (
        <Suspense fallback={<Loading />}>
            <LoginSuccessClient />
        </Suspense>
    );
}