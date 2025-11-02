"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const next = searchParams.get('next');

        if (token) {
            localStorage.setItem('apiToken', token);
            router.push(next || '/home'); 
        } else {
            router.push('/');
        }
    }, [router, searchParams]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-green-50">
            <p className="text-lg text-gray-700">Finalizing login...</p>
        </main>
    );
}