"use client";

import React from 'react';

// Define the data types
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

interface Props {
    item: QueueItem;
    onDelete: (id: number) => void;
}

export default function QueueItemTile({ item, onDelete }: Props) {
    const itemTotal = (parseFloat(item.inventory_item.price) * item.quantity).toFixed(2);

    return (
        <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-3">
            <img
                src={item.inventory_item.image_url}
                alt={item.inventory_item.name}
                className="w-16 h-16 object-contain rounded-md"
            />
            <div className="flex-1 mx-4">
                <h3 className="text-lg font-bold">{item.inventory_item.name}</h3>
                <p className="text-sm text-gray-600">
                    {item.quantity} x ₹{item.inventory_item.price} = <span className="font-semibold">₹{itemTotal}</span>
                </p>
                <p className="text-xs text-gray-500">
                    Added by: {item.added_by} | Provider: {item.provider}
                </p>
            </div>
            <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700 font-medium"
            >
                Delete
            </button>
        </div>
    );
}