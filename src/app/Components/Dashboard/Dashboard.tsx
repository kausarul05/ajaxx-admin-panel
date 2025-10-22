'use client'

import { Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import userImage from "@/../public/images/profile.jpg"

export default function Dashboard() {
  const stats = [
    { title: 'Total User', value: '25,648', icon: <Users size={24} color='#0ABF9D' className='font-bold' /> },
    { title: 'Subscribers', value: '58,320', icon: <Users size={24} color='#0ABF9D' className='font-bold' /> },
    { title: 'Total Earning', value: '$52,567.53', icon: <Users size={24} color='#0ABF9D' className='font-bold' /> },
  ];

  const users = [
    {
      id: 1,
      name: 'Savannah Nguyen',
      email: 'demo59@gmail.com',
      registrationDate: 'January 20, 2025',
      subscription: 'Basic Protection',
      image : userImage
    },
    {
      id: 2,
      name: 'Annette Black',
      email: 'demo59@gmail.com',
      registrationDate: 'February 15, 2025',
      subscription: 'Silver Protection',
      image : userImage
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'demo59@gmail.com',
      registrationDate: 'March 10, 2025',
      subscription: 'Gold Protection',
      image : userImage
    },
    {
      id: 4,
      name: 'Brooklyn Simmons',
      email: 'demo59@gmail.com',
      registrationDate: 'April 09, 2025',
      subscription: 'Basic Protection',
      image : userImage
    },
  ];

  // Chart data
  const chartData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21200 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24500 },
    { month: 'May', revenue: 23100 },
    { month: 'Jun', revenue: 26700 },
    { month: 'Jul', revenue: 25400 },
    { month: 'Aug', revenue: 28900 },
    { month: 'Sep', revenue: 27600 },
    { month: 'Oct', revenue: 31200 },
    { month: 'Nov', revenue: 29800 },
    { month: 'Dec', revenue: 32500 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Revenue: <span className="font-medium">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                +4% Monthly
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
                            src={user?.image}
                            alt={user?.name}
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