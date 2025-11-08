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
    email: string;
    registrationDate: string;
    subscription: string;
    image: typeof userImage;
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

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

interface TotalEarningsResponse {
    success: boolean;
    message: string;
    data: {
        total: number;
    };
}

interface SubscribersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
}

interface EarningsOverviewResponse {
    success: boolean;
    message: string;
    data: {
        earnings: Array<{
            month: string;
            total: number;
        }>;
        growth_percentage: number;
        trend: string;
    };
}
export default function Dashboard() {
    const [totalUsers, setTotalUsers] = useState<string>('0.00');
    const [totalEarnings, setTotalEarnings] = useState<string>('0.00');
    const [subscribersCount, setSubscribersCount] = useState<string>('0');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [growthPercentage, setGrowthPercentage] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    // const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    const stats: StatItem[] = [
        {
            title: 'Total User',
            value: `$${totalUsers}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
        {
            title: 'Subscribers',
            value: `$${subscribersCount}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
        {
            title: 'Total Earning',
            value: `$${totalEarnings}`,
            icon: <Users size={24} color='#0ABF9D' className='font-bold' />
        },
    ];

    // const users: User[] = [
    //   {
    //     id: 1,
    //     name: 'Savannah Nguyen',
    //     email: 'demo59@gmail.com',
    //     registrationDate: 'January 20, 2025',
    //     subscription: 'Basic Protection',
    //     image: userImage
    //   },
    //   {
    //     id: 2,
    //     name: 'Annette Black',
    //     email: 'demo59@gmail.com',
    //     registrationDate: 'February 15, 2025',
    //     subscription: 'Silver Protection',
    //     image: userImage
    //   },
    //   {
    //     id: 3,
    //     name: 'Cody Fisher',
    //     email: 'demo59@gmail.com',
    //     registrationDate: 'March 10, 2025',
    //     subscription: 'Gold Protection',
    //     image: userImage
    //   },
    //   {
    //     id: 4,
    //     name: 'Brooklyn Simmons',
    //     email: 'demo59@gmail.com',
    //     registrationDate: 'April 09, 2025',
    //     subscription: 'Basic Protection',
    //     image: userImage
    //   },
    // ];

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch total earnings
            const totalUserResponse = await apiRequest(
                "GET",
                "/accounts/users/count/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );
            // console.log(totalUserResponse)
            if (totalUserResponse?.total_users) {
                setTotalUsers(totalUserResponse.total_users);
            }


            const earningsResponse = await apiRequest(
                "GET",
                "/payment/payments/total-earnings/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );



            if (earningsResponse.data) {
                setTotalEarnings(earningsResponse.data.total.toFixed(2));
            }

            // Fetch subscribers count
            const subscribersResponse = await apiRequest(
                "GET",
                "/payment/payments/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (subscribersResponse.count) {
                setSubscribersCount(subscribersResponse.count.toString());
            }

            // Fetch earnings overview
            const earningsOverviewResponse = await apiRequest(
                "GET",
                "/payment/payments/earnings-overview/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );
            // console.log(earningsOverviewResponse)
            if (earningsOverviewResponse.data) {
                const earningsData = earningsOverviewResponse.data;
                setChartData(earningsData.earnings.map(item => ({
                    month: item.month,
                    revenue: item.total
                })));
                setGrowthPercentage(earningsData.growth_percentage);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Build query parameters
            let endpoint = `/accounts/user_all/?page=1&page_size=5`;

            // Add search parameter if search term exists
            // if (search) {
            //   endpoint += `&search=${encodeURIComponent(search)}`;
            // }

            const data = await apiRequest("GET", endpoint, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            setUsers(data.results);
            setTotalItems(data.total);
            setTotalPages(data.total_pages);
            // setCurrentPage(data.page);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

     const getDisplayName = (user: User) => {
        return user.Fullname || user.email.split('@')[0] || 'Unknown User';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchDashboardData();
        fetchUsers()
    }, []);

    // Custom tooltip
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#0D314B] rounded-lg shadow-sm p-6">
                        <div className='flex  justify-between items-center p-10 px-18'>
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
                {/* Earning Summary Section with Recharts */}
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

                    {/* Recharts Bar Chart */}
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

                {/* User Section */}
                <div className="bg-[#0D314B] rounded-lg shadow-sm p-6 mt-10">
                    <h2 className="text-lg font-semibold text-white mb-6">User</h2>

                    {/* Table */}
                    <div className="rounded-lg shadow-sm border border-[#007ED6] overflow-hidden">
                        {/* Table */}
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
                                <tbody className="">
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
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        {user.is_active === false ? (
                                                            // Show Unblock button for blocked users
                                                            <button
                                                                onClick={() => handleUnblock(user.id)}
                                                                disabled={actionLoading === user.id}
                                                                className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                            >
                                                                {actionLoading === user.id ? (
                                                                    <>
                                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Unblocking...
                                                                    </>
                                                                ) : (
                                                                    'Unblock'
                                                                )}
                                                            </button>
                                                        ) : (
                                                            // Show Block button for active users
                                                            <button
                                                                onClick={() => handleBlock(user.id)}
                                                                disabled={actionLoading === user.id}
                                                                className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                            >
                                                                {actionLoading === user.id ? (
                                                                    <>
                                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Blocking...
                                                                    </>
                                                                ) : (
                                                                    'Block'
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td> */}
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