"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import AddItemModal from './components/AddItemModal';
import InventoryCarousel from "./components/InventoryCarousel";
import QueueSection from './components/QueueSection';
interface InventoryItem {
    id: number;
    name: string;
    price: number;
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
const GCHAT_WEBHOOK_URL = 'https://chat.googleapis.com/v1/spaces/AAQAWmRZiB0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=h0XZcVNAJl3PbWEyIrgWOBO9no9Q0AH8Sa38AALFEQE';
export default function QueuesPage(){
    const { user, isLoading: isUserLoading } = useUser()
    const router = useRouter();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        if (!isUserLoading && user && user.house){

            const fetchData = async () => {
                try {
                    // Fetch both endpoints at the same time
                    const [inventoryRes, queueRes] = await Promise.all([
                        fetch('http://localhost:8000/api/inventory/', {credentials: 'include'}),
                        fetch('http://localhost:8000/api/queues/', {credentials: 'include'})
                    ]);

                    if (!inventoryRes.ok || !queueRes.ok) {
                        throw new Error('Failed to fetch data');
                    }

                    const inventoryData = await inventoryRes.json();
                    const queueData = await queueRes.json();

                    setInventory(inventoryData);
                    setQueue(queueData);
                } catch (error) {
                console.error("Erorr in side queues page , while trying to fetch inventory HERE IT IS ::::::",error);
                // lets add a toast error and handle the error here
                } finally {
                    setIsDataLoading(false);
                }
            };
            fetchData();
        }
    } ,[isUserLoading , user]);

    if (isUserLoading || (isDataLoading && inventory.length === 0)) {
        return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading Queues...</p></main>;
    }
    if (!user) {
        router.push('/error-session');
        return null;
    }
    if (!user.house) {
        router.push('/error-session');
        return null;
    }
    const handleItemClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };
    const handleDeleteItem = (id: number) => {
        console.log("Deleting item (this will be a WebSocket message):", id);
        // --- TODO: This will be replaced by a WebSocket send ---
        setQueue(prevQueue => prevQueue.filter(item => item.id !== id));
    };

    const handleAddItemToQueue = (item: InventoryItem, quantity: number, provider: string) => {
        console.log("Adding item (this will be a WebSocket message):", item.name, quantity, provider);
        // --- TODO ---
        // This is where we will send the WebSocket message in the next step.
        // For now, let's optimistically add it to the local state to see it work.
        const optimisticQueueItem: QueueItem = {
            id: Math.random(), // Temporary ID
            inventory_item: item,
            added_by: user.display_name, // Use the current user's email
            quantity: quantity,
            provider: provider,
            added_at: new Date().toISOString()
        };
        // Add new item to the *top* of the stack
        setQueue(prevQueue => [optimisticQueueItem, ...prevQueue]);
    };

    // --- Derived State (for filtering) ---
    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    const isCarouselPaused = isModalOpen || searchTerm.length > 0;

    return (
        <Layout houseName={"Queify"}>
            <div className="w-full h-full p-4">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Queues</h1>
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search for items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Placeholder for Inventory Carousel */}
                {/*<div className="mb-8 p-4 bg-white rounded-lg shadow">*/}
                {/*    <h2 className="text-xl font-semibold mb-2">Inventory (Carousel will go here)</h2>*/}
                {/*    <pre className="bg-gray-100 p-2 rounded overflow-auto">*/}
                {/*        {JSON.stringify(inventory, null, 2)}*/}
                {/*    </pre>*/}
                {/*</div>*/}

                {/* Inventory Carousel */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow">
                    <InventoryCarousel
                        inventory={filteredInventory}
                        onItemClick={handleItemClick}
                        isPaused={isCarouselPaused}
                    />
                </div>
                {/* Placeholder for Queue List */}
                <QueueSection
                    queue={queue}
                    onDeleteItem={handleDeleteItem}
                    googleChatWebhook={GCHAT_WEBHOOK_URL}
                />

                <AddItemModal
                    item={selectedItem}
                    onClose={handleCloseModal}
                    onAddItem={handleAddItemToQueue}
                />

            </div>
        </Layout>
    )

}