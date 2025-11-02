"use client";

import React, { useState, useEffect ,useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import AddItemModal from './components/AddItemModal';
import InventoryCarousel from "./components/InventoryCarousel";
import QueueSection from './components/QueueSection';
import { getCookie } from '../utils';
import { InventoryItem, QueueItem } from "./../types"
import { API_BASE } from '@/utils/apiBase';

// const WEBSOCKET_URL =  "wss://b97d2i3ahb.execute-api.eu-north-1.amazonaws.com/prod/"
const GCHAT_WEBHOOK_URL = 'https://chat.googleapis.com/v1/spaces/AAQAWmRZiB0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=h0XZcVNAJl3PbWEyIrgWOBO9no9Q0AH8Sa38AALFEQE';
export default function QueuesPage(){
    const { user, isLoading: isUserLoading } = useUser()
    const router = useRouter();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // const [ws, setWs] = useState<WebSocket | null>(null);
    // const [presenceCount, setPresenceCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const fetchQueue = useCallback(async () => {
        if (!user || !user.house) return; // Don't fetch if no user/house
        try {
            const queueRes = await fetch(`${API_BASE}/api/queues/`, { credentials: 'include' });
            if (!queueRes.ok) throw new Error('Failed to fetch queue');
            const queueData = await queueRes.json();
            setQueue(queueData);
        } catch (error) {
            console.error("Error fetching queue:", error);
        }
    }, [user]); // It depends on the 'user' object

    useEffect(() => {
        if (!isUserLoading && user && user.house) {
            const fetchData = async () => {
                setIsDataLoading(true);
                try {
                    // Fetch inventory only once
                    const inventoryRes = await fetch(`${API_BASE}/api/inventory/`, { credentials: 'include' });
                    if (!inventoryRes.ok) throw new Error('Failed to fetch inventory');
                    const inventoryData = await inventoryRes.json();
                    setInventory(inventoryData);

                    // Fetch the initial queue
                    await fetchQueue();

                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setIsDataLoading(false);
                }
            };
            fetchData();
        }
    }, [isUserLoading, user, fetchQueue]); // fetchQueue is now a dependency

    useEffect(() => {
        // Start polling only after the initial load is done
        if (!isDataLoading && user && user.house) {
            console.log("Starting 30-second poll for queue...");
            const intervalId = setInterval(() => {
                console.log("Polling for queue updates...");
                fetchQueue();
            }, 30000); // 30,000 milliseconds = 30 seconds

            // Cleanup function to stop polling when the user leaves the page
            return () => {
                console.log("Stopping poll.");
                clearInterval(intervalId);
            };
        }
    }, [isDataLoading, user, fetchQueue]);

    // useEffect(() => {
    //     if (!isUserLoading && user && user.house) {
    //
    //         // 1. Fetch the initial data (inventory + current queue)
    //         const fetchData = async () => {
    //             try {
    //                 const [inventoryRes, queueRes] = await Promise.all([
    //                     fetch(`${API_BASE}/api/inventory/`, { credentials: 'include' }),
    //                     fetch(`${API_BASE}/api/queues/`, { credentials: 'include' })
    //                 ]);
    //                 if (!inventoryRes.ok || !queueRes.ok) throw new Error('Failed to fetch data');
    //
    //                 const inventoryData = await inventoryRes.json();
    //                 const queueData = await queueRes.json(); // This is from Django REST, not Lambda
    //
    //                 setInventory(inventoryData);
    //                 // Note: This initial queueData from Django might be a different format.
    //                 // For now, we assume it's empty and let the WebSocket populate it.
    //                 // A more robust solution would be to use the AWS queue data from the start.
    //                 // Let's just fetch inventory.
    //                 setQueue([]); // Start with an empty queue, let WebSocket populate
    //             } catch (error) {
    //                 console.error("Error fetching inventory data:", error);
    //             } finally {
    //                 setIsDataLoading(false);
    //             }
    //         };
    //         fetchData(); // Fetch the inventory
    //
    //         // 2. Establish the WebSocket connection
    //         const socketUrl = `${WEBSOCKET_URL}?houseId=${user.house.id}`;
    //         const socket = new WebSocket(socketUrl);
    //
    //         socket.onopen = () => {
    //             console.log("WebSocket connected!");
    //             setWs(socket);
    //             socket.send(JSON.stringify({ action: 'getQueue' }));
    //         };
    //
    //         // 3. This is the main listener
    //         socket.onmessage = (event) => {
    //             const data = JSON.parse(event.data);
    //
    //             if (data.action === 'queueUpdate') {
    //                 console.log("Received new queue from server!");
    //                 setQueue(data.queue); // Server sends the full new queue
    //             }
    //
    //             if (data.action === 'presenceUpdate') {
    //                 console.log("Presence updated:", data.count);
    //                 setPresenceCount(data.count);
    //             }
    //         };
    //
    //         socket.onclose = () => {
    //             console.log("WebSocket disconnected.");
    //             setWs(null);
    //             // We could add auto-reconnect logic here
    //         };
    //
    //         socket.onerror = (err) => {
    //             console.error("WebSocket Error:", err);
    //         };
    //
    //         // 4. Clean up the connection when the component unmounts
    //         return () => {
    //             console.log("Closing WebSocket connection...");
    //             socket.close();
    //         };
    //     }
    // }, [isUserLoading, user]); // Only runs when user is loaded
    if (isUserLoading || isDataLoading) {
        return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading Queues...</p></main>;
    }
    // if (isUserLoading || (isDataLoading && inventory.length === 0)) {
    //     return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading Queues...</p></main>;
    // }


    // useEffect(() => {
    //     if (!isUserLoading && user && user.house){
    //
    //         const fetchData = async () => {
    //             try {
    //                 // Fetch both endpoints at the same time
    //                 const [inventoryRes, queueRes] = await Promise.all([
    //                     fetch(`${API_BASE}/api/inventory/`, {credentials: 'include'}),
    //                     fetch(`${API_BASE}/api/queues/`, {credentials: 'include'})
    //                 ]);
    //
    //                 if (!inventoryRes.ok || !queueRes.ok) {
    //                     throw new Error('Failed to fetch data');
    //                 }
    //
    //                 const inventoryData = await inventoryRes.json();
    //                 const queueData = await queueRes.json();
    //
    //                 setInventory(inventoryData);
    //                 setQueue(queueData);
    //             } catch (error) {
    //             console.error("Erorr in side queues page , while trying to fetch inventory HERE IT IS ::::::",error);
    //             // lets add a toast error and handle the error here
    //             } finally {
    //                 setIsDataLoading(false);
    //             }
    //         };
    //         fetchData();
    //     }
    // } ,[isUserLoading , user]);

    // if (isUserLoading || (isDataLoading && inventory.length === 0)) {
    //     return <main className="flex min-h-screen items-center justify-center bg-green-50"><p>Loading Queues...</p></main>;
    // }
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

    const handleAddItemToQueue = async (item: InventoryItem, quantity: number, provider: string) => {
        console.log("Adding item via API:", item.name, quantity, provider);
        try {
            const response = await fetch(`${API_BASE}/api/queues/add/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({
                    inventory_item_id: item.id, // Backend expects 'inventory_item_id'
                    quantity: quantity,
                    provider: provider
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add item');
            }
            // SUCCESS: Immediately re-fetch the queue to show the update
            await fetchQueue();
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item. Please try again.");
        }
    };

    // --- UPDATED: handleDeleteItem now uses fetch DELETE ---
    const handleDeleteItem = async (id: number) => { // The ID is now a number
        console.log("Deleting item via API:", id);
        try {
            const response = await fetch(`${API_BASE}/api/queues/${id}/delete/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            // SUCCESS: Immediately re-fetch the queue to show the update
            await fetchQueue();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item. Please try again.");
        }
    };
    const handleClearQueue = async () => {
        console.log("Clearing queue via API...");
        try {
            const response = await fetch(`${API_BASE}/api/queues/clear/`, {
                method: 'POST', // Or 'DELETE' if you prefer, backend handles POST
                credentials: 'include',
                headers: {
                    // No Content-Type needed for empty body, but CSRF is crucial
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                // No body is needed for this request
            });

            if (!response.ok && response.status !== 204) { // 204 is success (No Content)
                throw new Error(`Failed to clear queue, status: ${response.status}`);
            }

            // SUCCESS: Immediately re-fetch the queue to show the empty list
            console.log("Queue cleared successfully, fetching updated list.");
            await fetchQueue();

        } catch (error) {
            console.error("Error clearing queue:", error);
            alert("Failed to clear the queue. Please try again.");
        }
    };

    // const handleAddItemToQueue = (item: InventoryItem, quantity: number, provider: string) => {
    //     // Send the message over the WebSocket instead of setting local state
    //     if (ws) {
    //         ws.send(JSON.stringify({
    //             action: 'addItem',
    //             item_id: item.id, // This is the inventoryItemId
    //             quantity: quantity,
    //             provider: provider
    //             // We pass the other details needed by the Lambda
    //         }));
    //     } else {
    //         console.error("WebSocket is not connected.");
    //     }
    // };
    //
    // const handleDeleteItem = (itemId: string) => { // 'itemId' is the unique queue ID
    //     // Send the delete message
    //     if (ws) {
    //         ws.send(JSON.stringify({
    //             action: 'deleteItem',
    //             item_id: itemId
    //         }));
    //     } else {
    //         console.error("WebSocket is not connected.");
    //     }
    // };
    //
    // const handleClearQueue = () => {
    //     console.log("Sending clearQueue message...");
    //     if (ws) {
    //         ws.send(JSON.stringify({
    //             action: 'clearQueue'
    //         }));
    //     } else {
    //         console.error("WebSocket is not connected.");
    //     }
    // };

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
                    onClearQueue={handleClearQueue}
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