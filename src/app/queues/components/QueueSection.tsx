"use client";

import React, { useState, useEffect } from 'react';
import QueueItemTile from './QueueItemTile';

// --- Type Definitions ---
interface InventoryItem {
    id: number;
    name: string;
    price: string;
    image_url: string;
}
interface QueueItem {
    id: number;
    inventory_item: InventoryItem;
    added_by: string;
    quantity: number;
    provider: string;
    added_at: string;
}
// --- End Type Definitions ---
interface SimpleQueueItem {
    houseId: string;
    itemId: string; // This is the unique ID of the *queue entry*
    inventoryItemId: number; // This is the ID of the *product*
    quantity: number;
    provider: string;
    addedBy: string;
}
interface Props {
    queue: QueueItem[];
    onDeleteItem: (id: number) => void;
    googleChatWebhook: string; // We'll get this from the user (or .env)
}

// --- Helper Function ---
// Calculates totals for each provider
const calculateTotals = (queue: QueueItem[]) => {
    const totals = {
        Blinkit: 0,
        Swiggy: 0,
        Zepto: 0,
        overall: 0,
    };

    queue.forEach(item => {
        const itemTotal = parseFloat(item.inventory_item.price) * item.quantity;
        totals.overall += itemTotal;
        if (item.provider === 'Blinkit') totals.Blinkit += itemTotal;
        if (item.provider === 'Swiggy') totals.Swiggy += itemTotal;
        if (item.provider === 'Zepto') totals.Zepto += itemTotal;
    });

    return totals;
};

// --- Main Component ---
export default function QueueSection({ queue, onDeleteItem, googleChatWebhook }: Props) {
    const [buttonState, setButtonState] = useState({ text: 'Queue Ready', color: 'bg-gray-400', disabled: true });

    const totals = calculateTotals(queue);
    const readyProviders: string[] = [];

    if (totals.Blinkit > 150) readyProviders.push('Blinkit');
    if (totals.Swiggy > 150) readyProviders.push('Swiggy');
    if (totals.Zepto > 150) readyProviders.push('Zepto');

    // --- Button Logic Effect ---
    useEffect(() => {
        if (readyProviders.length === 0) {
            setButtonState({ text: 'Queue Ready', color: 'bg-gray-400', disabled: true });
        } else if (readyProviders.length === 1) {
            const provider = readyProviders[0];
            if (provider === 'Blinkit') setButtonState({ text: 'BLINKIT IT!', color: 'bg-yellow-500 hover:bg-yellow-600', disabled: false });
            if (provider === 'Swiggy') setButtonState({ text: 'SWIGGY IT!', color: 'bg-orange-500 hover:bg-orange-600', disabled: false });
            if (provider === 'Zepto') setButtonState({ text: 'ZEPTO IT!', color: 'bg-purple-600 hover:bg-purple-700', disabled: false });
        } else {
            setButtonState({ text: 'READY', color: 'bg-black hover:bg-gray-800', disabled: false });
        }
    }, [queue]); // Recalculate whenever the queue changes

    // --- Google Chat Notification Effect ---
    useEffect(() => {
        if (buttonState.disabled) {
            return; // Do nothing if button is not active
        }

        const timer = setTimeout(() => {
            console.log("Sending GChat notification...");
            // We'll send a separate message for each ready provider
            readyProviders.forEach(provider => {
                const itemsForProvider = queue.filter(item => item.provider === provider);
                const message = {
                    "cardsV2": [
                        {
                            "cardId": "queue-ready-card",
                            "card": {
                                "header": {
                                    "title": `${provider.toUpperCase()} IT!`,
                                    "subtitle": "Your Housify order is ready to be placed.",
                                    "imageUrl": "https://i.imgur.com/x0R4sPz.png", // A generic cart icon
                                    "imageType": "CIRCLE"
                                },
                                "sections": [
                                    {
                                        "widgets": itemsForProvider.map(item => ({
                                            "textParagraph": {
                                                "text": `<b>${item.inventory_item.name}</b> (x${item.quantity})`
                                            }
                                        }))
                                    }
                                ]
                            }
                        }
                    ]
                };

                // Send the webhook
                fetch(googleChatWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify(message),
                }).catch(err => console.error(`Failed to send GChat notification for ${provider}:`, err));
            });
        }, 1* 10 * 1000); // 3 minutes

        return () => clearTimeout(timer); // VERY IMPORTANT: Cancel the timer if the queue changes
    }, [buttonState.disabled, googleChatWebhook, queue]); // Re-run if the button state or queue changes

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 & 2: The Queue List */}
            <div className="md:col-span-2 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Current Queue</h2>
                <div className="max-h-[500px] overflow-y-auto pr-2">
                    {queue.length === 0 ? (
                        <p className="text-gray-500 text-center">Your queue is empty. Add items from the list above!</p>
                    ) : (
                        queue.map(item => (
                            <QueueItemTile
                                key={item.id}
                                item={item}
                                onDelete={onDeleteItem}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Column 3: The Checkout Section */}
            <div className="p-4 bg-white rounded-lg shadow self-start">
                <h2 className="text-xl font-semibold mb-4">Total</h2>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Blinkit:</span>
                        <span className="font-medium">₹{totals.Blinkit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Swiggy:</span>
                        <span className="font-medium">₹{totals.Swiggy.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Zepto:</span>
                        <span className="font-medium">₹{totals.Zepto.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Overall Total:</span>
                        <span>₹{totals.overall.toFixed(2)}</span>
                    </div>
                </div>
                <button
                    disabled={buttonState.disabled}
                    className={`w-full p-4 rounded-lg text-white font-bold text-xl transition-all duration-300 ${
                        buttonState.color
                    } ${buttonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {buttonState.text}
                </button>
            </div>
        </div>
    );
}