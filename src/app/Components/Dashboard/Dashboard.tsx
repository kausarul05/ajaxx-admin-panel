'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const stats = [
    { title: 'Total User', value: '25,648' },
    { title: 'Subscribers', value: '58,320' },
    { title: 'Total Earning', value: '$52,567.53' },
  ];

  const users = [
    {
      id: 1,
      name: 'Savannah Nguyen',
      email: 'demo59@gmail.com',
      registrationDate: 'January 20, 2025',
      subscription: 'Basic Protection',
    },
    {
      id: 2,
      name: 'Annette Black',
      email: 'demo59@gmail.com',
      registrationDate: 'February 15, 2025',
      subscription: 'Silver Protection',
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'demo59@gmail.com',
      registrationDate: 'March 10, 2025',
      subscription: 'Gold Protection',
    },
    {
      id: 4,
      name: 'Brooklyn Simmons',
      email: 'demo59@gmail.com',
      registrationDate: 'April 09, 2025',
      subscription: 'Basic Protection',
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#0D314B] rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-white mb-2">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-white pb-3">No</th>
                  <th className="text-left text-sm font-medium text-white pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-white pb-3">Email</th>
                  <th className="text-left text-sm font-medium text-white pb-3">Registration Date</th>
                  <th className="text-left text-sm font-medium text-white pb-3">Subscriptions</th>
                  <th className="text-left text-sm font-medium text-white pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-white">{user.id}</td>
                    <td className="py-4 text-sm text-white">{user.name}</td>
                    <td className="py-4 text-sm text-white">{user.email}</td>
                    <td className="py-4 text-sm text-white">{user.registrationDate}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscription === 'Gold Protection' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : user.subscription === 'Silver Protection'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.subscription}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}