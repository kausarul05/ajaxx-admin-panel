"use client";

import { useState, useEffect } from "react";
import { CircleCheck, CircleX, Pencil, Plus, Trash } from "lucide-react";
import { apiRequest } from '@/app/lib/api';

interface Feature {
    id: number;
    description: string;
}

interface Subscription {
    id: number;
    title: string;
    Description: string;
    price: string;
    billing_cycle: string;
    features: Feature[];
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Subscription[];
}

export default function PlansManagement() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);

    // Fetch subscriptions from API
    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response: ApiResponse = await apiRequest("GET", "/payment/subscriptions", null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (response.success) {
                setSubscriptions(response.data);
            } else {
                console.error('Failed to fetch subscriptions:', response.message);
                setSubscriptions([]);
            }
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleEdit = (subscription: Subscription) => {
        setSelectedPlan(subscription);
        setShowEditModal(true);
    };

    const handleDelete = async (subscriptionId: number) => {
        if (!confirm('Are you sure you want to delete this subscription?')) {
            return;
        }

        try {
            // Assuming your delete API endpoint - adjust if different
            await apiRequest("DELETE", `/payment/subscriptions/${subscriptionId}/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            // Remove subscription from local state immediately
            setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
            
            alert('Subscription deleted successfully');
            
        } catch (error: any) {
            console.error('Failed to delete subscription:', error);
            alert(error?.error || 'Failed to delete subscription');
        }
    };

    // Map API data to your feature structure
    const getFeaturesList = (subscription: Subscription) => {
        // You can customize this mapping based on your needs
        const defaultFeatures = [
        ];

        // Map API features to your structure
        const apiFeatures = subscription.features.map(feature => ({
            text: feature.description,
            available: true
        }));

        // Combine with default features (you can adjust this logic as needed)
        return [...apiFeatures, ...defaultFeatures.slice(apiFeatures.length)];
    };

    // Get display duration
    const getDisplayDuration = (billingCycle: string) => {
        return billingCycle === 'monthly' ? 'month' : 'year';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A2131] text-white px-6 py-8">
                <div className="bg-[#0D314B] rounded-lg p-6 h-screen flex items-center justify-center">
                    <div className="text-white">Loading subscriptions...</div>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-[#0A2131] text-white px-6 py-8">
            <div className="bg-[#0D314B] rounded-lg p-6 h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#1b3b56] pb-4">
                    <h1 className="text-lg font-semibold">Plans Management</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center cursor-pointer gap-2 bg-[#007ED6] hover:bg-[#006bb3] text-white px-4 py-2 rounded-lg font-medium"
                    >
                        <Plus size={18} /> Create New Subscriptions
                    </button>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {subscriptions.map((subscription) => {
                        const features = getFeaturesList(subscription);
                        return (
                            <div
                                key={subscription.id}
                                className="bg-[#0A2131] border border-[#1b4b70] rounded-xl p-6 relative"
                            >
                                <h2 className="text-lg font-semibold mb-2 text-[#00aaff]">
                                    {subscription.title}
                                </h2>
                                <p className="text-sm text-gray-300 mb-4">{subscription.Description}</p>

                                <p className="text-3xl font-bold mb-4">
                                    ${subscription.price}
                                    <span className="text-base font-medium text-gray-400">
                                        /{getDisplayDuration(subscription.billing_cycle)}
                                    </span>
                                </p>

                                <ul className="space-y-2 text-sm mb-4">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            {feature.available ? (
                                                <CircleCheck size={14} className="text-[#007ED6]" />
                                            ) : (
                                                <CircleX size={14} className="text-[#EB4335]" />
                                            )}
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => handleEdit(subscription)}
                                        className="p-2 rounded-full border border-[#007ED6] hover:bg-[#12446a]"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(subscription.id)}
                                        className="p-2 rounded-full border border-[#EB4335] hover:bg-[#12446a]"
                                    >
                                        <Trash size={16} className="text-[#EB4335]" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-[#0e304a] border border-[#1b4b70] rounded-lg p-6 w-[90%] max-w-2xl text-white">
                            <h2 className="text-xl font-semibold mb-6">
                                Create Subscriptions
                            </h2>

                            {/* Plan Name & Price Row */}
                            <div className="grid gap-6 mb-6">
                                <div className="w-full">
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Plan name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter plan name"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Price</label>
                                            <input
                                                type="text"
                                                placeholder="Enter price"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Limit & Visibility Type Row */}
                            <div className="mb-6">
                                <div>
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Limit</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Limit"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Visibility Type</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Visibility Type"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    placeholder="Type here..."
                                    rows={4}
                                    className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-[#1b4b70]">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-8 py-3 bg-transparent border cursor-pointer border-gray-500 hover:bg-gray-500/20 text-sm rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-8 py-3 bg-[#007ED6] cursor-pointer hover:bg-[#006bb3] rounded-lg font-semibold text-sm transition-colors"
                                >
                                    Confirm Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedPlan && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-[#0e304a] border border-[#1b4b70] rounded-lg p-6 w-[90%] max-w-2xl text-white">
                            <h2 className="text-xl font-semibold mb-6">
                                Edit Subscriptions
                            </h2>

                            {/* Plan Name & Price Row */}
                            <div className="grid gap-6 mb-6">
                                <div className="w-full">
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Plan name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter plan name"
                                                defaultValue={selectedPlan.title}
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Price</label>
                                            <input
                                                type="text"
                                                placeholder="Enter price"
                                                defaultValue={selectedPlan.price}
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Limit & Visibility Type Row */}
                            <div className="mb-6">
                                <div>
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Limit</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Limit"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Visibility Type</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Visibility Type"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    placeholder="Type here..."
                                    rows={4}
                                    defaultValue={selectedPlan.Description}
                                    className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-[#1b4b70]">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-8 py-3 bg-transparent border cursor-pointer border-gray-500 hover:bg-gray-500/20 text-sm rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-8 py-3 bg-[#007ED6] cursor-pointer hover:bg-[#006bb3] rounded-lg font-semibold text-sm transition-colors"
                                >
                                    Confirm Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}