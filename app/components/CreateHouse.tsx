// frontend/app/components/CreateHouse.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { getCookie } from '../utils'; // Import from utils

const CreateHouse = ({ showDashboardView }: { showDashboardView: () => void; }) => {
    const [houseName, setHouseName] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState(false);

    useEffect(() => {
        if (houseName.length < 3) {
            setSuggestions([]);
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
                    if (!res.ok) throw new Error('Backend responded with an error');
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
                                    <div key={index} onClick={() => handleSuggestionClick(s)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">{s}</div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={showDashboardView} className="w-full rounded-md bg-gray-200 px-6 py-3 font-semibold">Cancel</button>
                    <button type="submit" className="w-full rounded-md bg-black px-6 py-3 font-semibold text-white">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateHouse;