import {
    LayoutDashboard,
    History,
    Star,
    User,
    Lock,
    LogOut
} from "lucide-react";
import React from 'react'
import logo from "@/../public/images/logo.png"
import Image from "next/image";

export default function Sidebar() {
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboards", active: true },
        { icon: History, label: "User Management", active: false },
        { icon: Star, label: "Subscriptions Management", active: false },
        { icon: User, label: "Review Management", active: false },
        { icon: Lock, label: "Settings", active: false },
    ];
    return (
        <div className="w-[336px] bg-[#0D314B] h-screen text-white py-14 px-10">
            <div>
                <Image
                    src={logo}
                    alt="Logo"
                    width={1200}
                    height={600}
                    className="w-full object-contain"
                />
            </div>
            <ul className="space-y-1 mt-10">
                {menuItems.map((item, index) => {   
                    const Icon = item.icon;
                    return (
                        <li
                            key={index}
                            className={`flex items-center gap-2 p-5 rounded-lg cursor-pointer transition-colors  ${item.active
                                ? 'bg-[#007ED6] text-white font-semibold'
                                : 'hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </li>
                    );
                })}
                <li className="flex items-center gap-3 hover:bg-red-600 p-3 rounded cursor-pointer transition-colors mt-8">
                    <LogOut size={20} />
                    Logout
                </li>
            </ul>
        </div>
    )
}
