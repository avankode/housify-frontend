"use client";

import React, { useState, useRef } from 'react';
import {getCookie} from "../utils.js";

const JoinHouse = ({ showDashboardView }: { showDashboardView: () => void; }) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            alert('Please enter a complete 6-digit code.');
            return;
        }
        // ... API call logic will go here
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-black p-8 text-center shadow-xl text-white">
            <div className="flex justify-center mb-6"><img src="/lock_icon.png" alt="Lock Icon" className="w-16 h-16" /></div>
            <h1 className="mb-2 text-3xl font-bold">Enter your Verification Code</h1>
            <p className="mb-8 text-gray-400">Ask your House admin for the code!</p>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={el => inputRefs.current[index] = el}
                            className="w-12 h-14 text-3xl text-center rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 caret-transparent"
                            inputMode="numeric"
                        />
                    ))}
                </div>
                <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={showDashboardView} className="w-full rounded-md bg-gray-700 px-6 py-3 font-semibold text-white">Cancel</button>
                    <button type="submit" className="w-full rounded-md bg-green-600 px-6 py-3 font-semibold text-white">Verify</button>
                </div>
            </form>
        </div>
    );
};

export default JoinHouse;