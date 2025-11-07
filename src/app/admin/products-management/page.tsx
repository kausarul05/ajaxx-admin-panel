"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Pencil, Plus, Trash } from "lucide-react";

const plans = [
    {
        name: "Norton AntiVirus Plus",
        oldPrice: "US$ 29.99",
        discount: "US$ 10 OFF*",
        price: "US$24.99",
        duration: "month",
        features: [
            "10 PCs, Macs, tablets, or phones",
            "Antivirus, malware, ransomware, and hacking protection",
            "100% Virus Protection Promise²",
            "100GB Cloud Backup‡,4",
            "Password Manager",
            "VPN private internet connection",
            "Dark Web Monitoring§",
            "Parental Control‡",
        ],
    },
    {
        name: "Norton AntiVirus Plus",
        oldPrice: "US$ 29.99",
        discount: "US$ 10 OFF*",
        price: "US$24.99",
        duration: "month",
        features: [
            "10 PCs, Macs, tablets, or phones",
            "Antivirus, malware, ransomware, and hacking protection",
            "100% Virus Protection Promise²",
            "100GB Cloud Backup‡,4",
            "Password Manager",
            "VPN private internet connection",
            "Dark Web Monitoring§",
            "Parental Control‡",
        ],
    },
    {
        name: "Norton AntiVirus Plus",
        oldPrice: "US$ 29.99",
        discount: "US$ 10 OFF*",
        price: "US$24.99",
        duration: "month",
        features: [
            "10 PCs, Macs, tablets, or phones",
            "Antivirus, malware, ransomware, and hacking protection",
            "100% Virus Protection Promise²",
            "100GB Cloud Backup‡,4",
            "Password Manager",
            "VPN private internet connection",
            "Dark Web Monitoring§",
            "Parental Control‡",
        ],
    },
    {
        name: "Norton AntiVirus Plus",
        oldPrice: "US$ 29.99",
        discount: "US$ 10 OFF*",
        price: "US$24.99",
        duration: "month",
        features: [
            "10 PCs, Macs, tablets, or phones",
            "Antivirus, malware, ransomware, and hacking protection",
            "100% Virus Protection Promise²",
            "100GB Cloud Backup‡,4",
            "Password Manager",
            "VPN private internet connection",
            "Dark Web Monitoring§",
            "Parental Control‡",
        ],
    },
];

export default function ProductsManagement() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    // const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleEdit = (planName: string) => {
        // setSelectedPlan(planName);
        console.log(planName)
        setShowEditModal(true);
    };

    return (
        <div className="min-h-screen bg-[#0A2131] text-white px-6 py-8">
            <div className="bg-[#0D314B] rounded-lg p-6 h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#1b3b56] pb-4">
                    <h1 className="text-lg font-semibold">Products Management</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center cursor-pointer gap-2 bg-[#007ED6] hover:bg-[#006bb3] text-white px-4 py-2 rounded-lg font-medium"
                    >
                        <Plus size={18} /> Create New Product
                    </button>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="bg-[#0A2131] border border-[#1b4b70] rounded-xl p-6 relative"
                        >
                            <h4 className="text-[18px] font-semibold text-white mb-6 text-center">
                                {plan.name}
                                <span className="text-[#007ED6]"> Plus</span>
                            </h4>

                            <p className="text-gray-400 text-sm mb-5 text-center">
                                <span className="line-through text-white">{plan.oldPrice}</span>{" "}
                                <span className="text-[#007ED6] font-medium">
                                    {plan.discount}
                                </span>
                            </p>

                            <p className="text-[#007ED6] text-3xl font-bold mb-6 text-center">
                                {plan.price}
                                <span className="text-gray-300 text-sm font-normal">
                                    /{plan.duration}
                                </span>
                            </p>

                            <ul className="space-y-4 text-sm mb-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        {/* {feature.available ? ( */}
                                        <CircleCheck size={14} className="text-[#007ED6]" />
                                        {/* ) : (
                                            <CircleX size={14} className="text-[#EB4335]" />
                                        )} */}

                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => handleEdit(plan.name)}
                                    className="p-2 rounded-full border border-[#007ED6] hover:bg-[#12446a]"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button className="p-2 rounded-full border border-[#EB4335] hover:bg-[#12446a]">
                                    <Trash size={16} className="text-[#EB4335]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-[#0e304a] border border-[#1b4b70] rounded-lg p-6 w-[90%] max-w-2xl text-white">
                            <h2 className="text-xl font-semibold mb-6">
                                Products Management
                            </h2>

                            {/* Plan Name & Price Row */}
                            <div className="grid gap-6 mb-6">
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        {/* <label className="block text-sm font-medium">Plan name</label> */}
                                        {/* <label className="block text-sm font-medium">Price</label> */}
                                    </div>
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Add Category</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Category name"
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
                                    {/* <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium">Limit</label>
                                        <label className="block text-sm font-medium">Visibility Type</label>
                                    </div> */}
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Old Price</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Old Price"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Add Link</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Add Link"
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
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-[#0e304a] border border-[#1b4b70] rounded-lg p-6 w-[90%] max-w-2xl text-white">
                            <h2 className="text-xl font-semibold mb-6">
                                Edit Product
                            </h2>

                            {/* Plan Name & Price Row */}
                            <div className="grid gap-6 mb-6">
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        {/* <label className="block text-sm font-medium">Plan name</label> */}
                                        {/* <label className="block text-sm font-medium">Price</label> */}
                                    </div>
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Add Category</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Add Category"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Price</label>
                                            <input
                                                type="text"
                                                placeholder="%25.99"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Limit & Visibility Type Row */}
                            <div className="mb-6">
                                <div>
                                    {/* <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium">Limit</label>
                                        <label className="block text-sm font-medium">Visibility Type</label>
                                    </div> */}
                                    <div className="flex w-full gap-4">
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Old Price</label>
                                            <input
                                                type="text"
                                                placeholder="$29.99"
                                                className="bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 w-full"
                                            />
                                        </div>
                                        <div className="flex-1 ">
                                            <label className="block text-sm font-medium mb-2">Add Link</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Product Detail link"
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