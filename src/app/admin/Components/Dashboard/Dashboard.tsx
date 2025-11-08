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
  const [totalEarnings, setTotalEarnings] = useState<string>('0.00');
  const [subscribersCount, setSubscribersCount] = useState<string>('0');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [growthPercentage, setGrowthPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const stats: StatItem[] = [
    { 
      title: 'Total User', 
      value: `$${totalEarnings}`, 
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

  const users: User[] = [
    {
      id: 1,
      name: 'Savannah Nguyen',
      email: 'demo59@gmail.com',
      registrationDate: 'January 20, 2025',
      subscription: 'Basic Protection',
      image: userImage
    },
    {
      id: 2,
      name: 'Annette Black',
      email: 'demo59@gmail.com',
      registrationDate: 'February 15, 2025',
      subscription: 'Silver Protection',
      image: userImage
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'demo59@gmail.com',
      registrationDate: 'March 10, 2025',
      subscription: 'Gold Protection',
      image: userImage
    },
    {
      id: 4,
      name: 'Brooklyn Simmons',
      email: 'demo59@gmail.com',
      registrationDate: 'April 09, 2025',
      subscription: 'Basic Protection',
      image: userImage
    },
  ];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total earnings
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
        setTotalEarnings(earningsResponse.data.data.total.toFixed(2));
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

      if (subscribersResponse.data) {
        setSubscribersCount(subscribersResponse.data.count.toString());
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

      if (earningsOverviewResponse.data) {
        const earningsData = earningsOverviewResponse.data.data;
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

  useEffect(() => {
    fetchDashboardData();
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
              <div className={`px-2 py-1 rounded text-sm font-medium ${
                growthPercentage >= 0 
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {users.map((user) => (
                    <tr key={user.id} className="">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <div className='flex items-center gap-3'>
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={120}
                            height={60}
                            className='w-10 h-10 object-fill rounded'
                          />
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.registrationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold text-[#F9FAFB] `}
                        >
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            // onClick={() => handleBlock(user.id)}
                            className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors"
                          >
                            Block
                          </button>
                          <button
                            // onClick={() => handleRemove(user.id)}
                            className="bg-[#551214] px-4 py-1 text-[#FE4D4F] rounded cursor-pointer font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}