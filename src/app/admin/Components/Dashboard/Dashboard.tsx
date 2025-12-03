'use client'

import { Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import userImage from "@/../public/images/profile.jpg"
import { apiRequest } from '@/app/lib/api';

// Define types
interface StatItem {
    title: string;
    value: string;
    icon: React.ReactNode;
}

interface User {
    id: number;
    name: string;
    Fullname?: string;
    email: string;
    date_joined: string;
    is_active: boolean;
    image?: typeof userImage;
    subscription?: string;
}

interface ChartData {
    month: string;
    revenue: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: ChartData;
    }>;
    label?: string;
}

// API Response types
interface TotalUsersResponse {
    total_users?: number;
    data?: {
        total_users?: number;
    };
}

interface EarningsResponse {
    data?: {
        total?: number;
    };
    total?: number;
}

interface SubscribersResponse {
    count?: number;
    data?: {
        count?: number;
    };
}

interface EarningsItem {
    month: string;
    total: number;
}

interface EarningsOverviewResponse {
    data?: {
        earnings?: EarningsItem[];
        growth_percentage?: number;
    };
    earnings?: EarningsItem[];
    growth_percentage?: number;
}

interface UsersApiResponse {
    results: User[];
    total: number;
    total_pages: number;
}

export default function Dashboard() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [growthPercentage, setGrowthPercentage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalEarnings, setTotalEarnings] = useState<number>(0);
    const [subscribersCount, setSubscribersCount] = useState<number>(0);

    const stats: StatItem[] = [
        {
            title: 'Total User',
            value: `$${totalUsers.toFixed(2)}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
        {
            title: 'Subscribers',
            value: `$${subscribersCount.toLocaleString()}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
        {
            title: 'Total Earning',
            value: `$${totalEarnings.toFixed(2)}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
    ];

    const fetchDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);

            // Helper function to safely extract number
            const getNumberValue = (value: unknown): number => {
                if (value === null || value === undefined) return 0;
                const num = Number(value);
                return isNaN(num) ? 0 : num;
            };

            // Fetch total users
            const totalUserResponse = await apiRequest<TotalUsersResponse>(
                "GET",
                "/accounts/users/count/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (totalUserResponse) {
                const usersCount = totalUserResponse.total_users ?? totalUserResponse.data?.total_users;
                if (usersCount !== undefined) {
                    setTotalUsers(getNumberValue(usersCount));
                }
            }

            const earningsResponse = await apiRequest<EarningsResponse>(
                "GET",
                "/payment/payments/total-earnings/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (earningsResponse) {
                const earnings = earningsResponse.data?.total ?? earningsResponse.total;
                if (earnings !== undefined) {
                    setTotalEarnings(getNumberValue(earnings));
                }
            }

            const subscribersResponse = await apiRequest<SubscribersResponse>(
                "GET",
                "/payment/payments/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (subscribersResponse) {
                const count = subscribersResponse.count ?? subscribersResponse.data?.count;
                if (count !== undefined) {
                    setSubscribersCount(getNumberValue(count));
                }
            }

            const earningsOverviewResponse = await apiRequest<EarningsOverviewResponse>(
                "GET",
                "/payment/payments/earnings-overview/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (earningsOverviewResponse) {
                const growth = earningsOverviewResponse.data?.growth_percentage ??
                    earningsOverviewResponse.growth_percentage;
                if (growth !== undefined) {
                    setGrowthPercentage(getNumberValue(growth));
                }

                let earningsData: EarningsItem[] = [];

                // Check if data.earnings exists and is an array
                if (earningsOverviewResponse.data?.earnings &&
                    Array.isArray(earningsOverviewResponse.data.earnings)) {
                    earningsData = earningsOverviewResponse.data.earnings;
                }
                // Check if earnings exists and is an array
                else if (earningsOverviewResponse.earnings &&
                    Array.isArray(earningsOverviewResponse.earnings)) {
                    earningsData = earningsOverviewResponse.earnings;
                }

                if (earningsData.length > 0) {
                    setChartData(earningsData.map(item => ({
                        month: item.month || '',
                        revenue: getNumberValue(item.total)
                    })));
                }
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (): Promise<void> => {
        try {
            setLoading(true);
            const endpoint = `/accounts/user_all/?page=1&page_size=5`;

            const data = await apiRequest<UsersApiResponse>("GET", endpoint, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            // Check if data has the expected properties
            if (data && typeof data === 'object') {
                // Check if it has the results property
                if ('results' in data && Array.isArray(data.results)) {
                    setUsers(data.results);
                } else {
                    setUsers([]);
                }

                // Check if it has total property
                if ('total' in data && typeof data.total === 'number') {
                    setTotalItems(data.total);
                } else {
                    setTotalItems(0);
                }

                // Check if it has total_pages property
                if ('total_pages' in data && typeof data.total_pages === 'number') {
                    setTotalPages(data.total_pages);
                } else {
                    setTotalPages(0);
                }
            } else {
                setUsers([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const getDisplayName = (user: User): string => {
        return user.Fullname || user.name || user.email?.split('@')[0] || 'Unknown User';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchDashboardData();
        fetchUsers();
    }, []);

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-blue-600">
                        Revenue: <span className="font-medium">${payload[0].value?.toLocaleString()}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A2131] p-6">
                <div className="text-white text-center">Loading dashboard data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A2131] p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#0D314B] rounded-lg shadow-sm p-6">
                        <div className='flex justify-between items-center p-10 px-18'>
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">{stat.title}</h3>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className='bg-[#0ABF9D33] p-2 rounded-lg'>{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="bg-[#0D314B] rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-white">Earning Summary</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-white">Revenue</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-sm font-medium ${growthPercentage >= 0
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                                }`}>
                                {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% Monthly
                            </div>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#fff', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#fff', fontSize: 12 }}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="revenue"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    name="Revenue"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#0D314B] rounded-lg shadow-sm p-6 mt-10">
                    <h2 className="text-lg font-semibold text-white mb-6">User</h2>

                    <div className="rounded-lg shadow-sm border border-[#007ED6] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-[#007ED6]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            NO
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Registration Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Subscriptions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user, index) => (
                                            <tr key={user.id} className="">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                    <div className='flex items-center gap-3'>
                                                        <Image
                                                            src={userImage}
                                                            alt={"user profile"}
                                                            width={120}
                                                            height={60}
                                                            className='w-10 h-10 object-fill rounded'
                                                        />
                                                        {getDisplayName(user)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    {formatDate(user.date_joined)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold text-[#F9FAFB]`}
                                                    >
                                                        Basic Protection
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${user.is_active === false
                                                            ? 'bg-red-500/20 text-red-300 border border-red-500'
                                                            : 'bg-green-500/20 text-green-300 border border-green-500'
                                                            }`}
                                                    >
                                                        {user.is_active === false ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}