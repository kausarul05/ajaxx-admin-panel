"use client"

import {
    LayoutDashboard,
    History,
    Star,
    User,
    Lock,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import React, { useState, useEffect } from 'react'
import logo from "@/../public/images/logo.png"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname()
    const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

    const menuItems = [
        { href: "/", icon: LayoutDashboard, label: "Dashboards" },
        { href: "/user-management", icon: History, label: "User Management" },
        { 
            href: "#", 
            icon: Star, 
            label: "Subscriptions Management", 
            hasNested: true,
            nestedItems: [
                { href: "/subscriptions/plans", label: "Plans" },
                { href: "/subscriptions/subscribers", label: "Subscribers" }
            ]
        },
        { href: "/review-management", icon: User, label: "Review Management" },
        { href: "/settings", icon: Lock, label: "Settings" },
    ];

    // Auto-open menu if current page is a nested item
    useEffect(() => {
        const subscriptionsItem = menuItems.find(item => item.hasNested);
        if (subscriptionsItem?.nestedItems?.some(nested => pathname === nested.href)) {
            setIsSubscriptionsOpen(true);
        }
    }, [pathname]);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        setIsSubscriptionsOpen(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            const subscriptionsItem = menuItems.find(item => item.hasNested);
            const isOnNestedItem = subscriptionsItem?.nestedItems?.some(nested => pathname === nested.href);
            
            if (!isOnNestedItem) {
                setIsSubscriptionsOpen(false);
            }
        }, 300);
        setHoverTimeout(timeout);
    };

    return (
        <div className="w-[385px] bg-[#0D314B] h-screen text-white py-14 pt-4 px-10 fixed z-50">
            <div>
                <Image
                    src={logo}
                    alt="Logo"
                    width={800}
                    height={600}
                    className="w-[230px] object-fill mx-auto"
                />
            </div>
            <ul className="space-y-1 mt-10">
                {menuItems.map((item) => {
                    if (item.hasNested) {
                        const isActive = item.nestedItems?.some(nested => pathname === nested.href);
                        
                        return (
                            <li 
                                key={item.label} 
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Parent menu item - just for hover, not clickable */}
                                <div
                                    className={`flex items-center justify-between gap-3 p-4 rounded-lg cursor-default transition-colors ${
                                        isActive
                                            ? "bg-[#007ED6] text-white font-semibold"
                                            : "hover:bg-gray-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} />
                                        {item.label}
                                    </div>
                                    {isSubscriptionsOpen ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </div>
                                
                                {/* Nested Menu Items - Proper Links */}
                                {isSubscriptionsOpen && (
                                    <div 
                                        className="ml-6 mt-1 space-y-1"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {item.nestedItems?.map((nestedItem) => (
                                            <Link 
                                                key={nestedItem.href} 
                                                href={nestedItem.href}
                                                passHref
                                            >
                                                <div
                                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                        pathname === nestedItem.href
                                                            ? "bg-[#007ED6] text-white font-semibold"
                                                            : "hover:bg-gray-700"
                                                    }`}
                                                >
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    {nestedItem.label}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        );
                    }

                    return (
                        <li key={item.href}>
                            <Link href={item.href} passHref>
                                <div
                                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                                        pathname === item.href
                                            ? "bg-[#007ED6] text-white font-semibold"
                                            : "hover:bg-gray-700"
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}